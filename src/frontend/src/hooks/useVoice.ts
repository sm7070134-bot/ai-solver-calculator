import { useCallback, useRef, useState } from "react";

export type VoiceStatus = "idle" | "listening" | "processing";

const NUMBER_WORDS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
  thousand: 1000,
};

function wordsToNumber(words: string[]): number | null {
  let result = 0;
  let current = 0;
  for (const w of words) {
    const n = NUMBER_WORDS[w];
    if (n === undefined) return null;
    if (n === 100) current *= 100;
    else if (n === 1000) {
      result += current * 1000;
      current = 0;
    } else current += n;
  }
  return result + current;
}

function parseSpokenMath(
  text: string,
): { expression: string; result: number } | null {
  const t = text
    .toLowerCase()
    .trim()
    .replace(/what is /g, "")
    .replace(/calculate /g, "")
    .replace(/equals?/g, "=")
    .replace(/\bfor\b/g, "4")
    .replace(/\bate\b/g, "8")
    .replace(/\bto\b/g, "2")
    .replace(/\btoo\b/g, "2")
    .replace(/\bwon\b/g, "1")
    .replace(/\btree\b/g, "3")
    .replace(/\bnine\b/g, "9")
    .replace(/\bsix\b/g, "6");

  const mapped = t
    .replace(/divided by|over/g, "÷")
    .replace(/multiplied by|times/g, "×")
    .replace(/plus/g, "+")
    .replace(/minus/g, "-");

  const tokenRegex = /([+\-×÷])/;
  const parts = mapped
    .split(tokenRegex)
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length < 3) return null;

  const parsePart = (p: string): number | null => {
    const n = Number.parseFloat(p);
    if (!Number.isNaN(n)) return n;
    const ws = p.split(/\s+/);
    return wordsToNumber(ws);
  };

  let exprStr = "";
  let jsExpr = "";
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p === "+" || p === "-") {
      exprStr += ` ${p} `;
      jsExpr += p;
    } else if (p === "×") {
      exprStr += " × ";
      jsExpr += "*";
    } else if (p === "÷") {
      exprStr += " ÷ ";
      jsExpr += "/";
    } else {
      const val = parsePart(p);
      if (val === null) return null;
      exprStr += String(val);
      jsExpr += String(val);
    }
  }

  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${jsExpr})`)() as number;
    if (!Number.isFinite(result)) return null;
    return { expression: exprStr.trim(), result };
  } catch {
    return null;
  }
}

interface UseVoiceOptions {
  lang: string;
  continuous: boolean;
  onResult: (expression: string, result: number) => void;
  onError?: (msg: string) => void;
}

export function useVoice({ lang, onResult, onError }: UseVoiceOptions) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const recogRef = useRef<any>(null);
  const activeRef = useRef(false);

  const startListening = useCallback(async () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError?.("Speech recognition not supported");
      return;
    }

    // Pre-check microphone permission if Permissions API is available
    if (navigator.permissions) {
      try {
        const permStatus = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });
        if (permStatus.state === "denied") {
          onError?.(
            "🎤 Microphone permission denied. Please allow microphone access in browser settings (click the lock icon in address bar) and try again.",
          );
          return;
        }
      } catch {
        // Permissions API may not support microphone query in some browsers — ignore
      }
    }

    if (recogRef.current) {
      recogRef.current.abort();
    }

    activeRef.current = true;

    const startRecog = () => {
      if (!activeRef.current) return;
      const recog = new SpeechRecognition();
      recog.lang = lang;
      recog.continuous = true;
      recog.interimResults = false;
      recog.maxAlternatives = 1;

      recog.onstart = () => setStatus("listening");

      recog.onend = () => {
        // If still active, restart for continuous listening
        if (activeRef.current) {
          setTimeout(() => startRecog(), 300);
        } else {
          setStatus("idle");
        }
      };

      recog.onerror = (e: any) => {
        const errType = e?.error;
        if (errType === "not-allowed" || errType === "service-not-allowed") {
          activeRef.current = false;
          setStatus("idle");
          onError?.(
            "🎤 Microphone permission denied. Please allow microphone access in browser settings (click the lock icon in address bar) and try again.",
          );
        } else if (errType === "audio-capture") {
          activeRef.current = false;
          setStatus("idle");
          onError?.(
            "🎤 No microphone found. Please connect a microphone and try again.",
          );
        } else if (errType === "network") {
          activeRef.current = false;
          setStatus("idle");
          onError?.("🎤 Network error. Please check your connection.");
        }
        // For no-speech / aborted: just let onend handle restart
      };

      recog.onresult = (e: any) => {
        setStatus("processing");
        const transcript = e.results[e.results.length - 1][0]
          .transcript as string;
        const parsed = parseSpokenMath(transcript);
        if (parsed) {
          onResult(parsed.expression, parsed.result);
          const utt = new SpeechSynthesisUtterance(
            `This answer is ${parsed.result}`,
          );
          utt.lang = lang;
          window.speechSynthesis.speak(utt);
        } else {
          onError?.(`Could not parse: "${transcript}"`);
        }
        setStatus("listening");
      };

      recogRef.current = recog;
      try {
        recog.start();
      } catch (err: any) {
        if (err?.name === "NotAllowedError") {
          activeRef.current = false;
          setStatus("idle");
          onError?.(
            "🎤 Microphone permission denied. Please allow microphone access in browser settings.",
          );
        }
      }
    };

    startRecog();
  }, [lang, onResult, onError]);

  const stopListening = useCallback(() => {
    activeRef.current = false;
    recogRef.current?.stop();
    setStatus("idle");
  }, []);

  return { status, startListening, stopListening };
}
