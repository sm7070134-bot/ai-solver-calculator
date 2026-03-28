import { Check, Copy, Mic } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import { AISolveModal } from "./components/AISolveModal";
import { AboutModal } from "./components/AboutModal";
import { AppMenuModal } from "./components/AppMenuModal";
import { BookMenuModal } from "./components/BookMenuModal";
import { BottomToolbar } from "./components/BottomToolbar";
import { BrickBreakerGame } from "./components/BrickBreakerGame";
import {
  ChildModeSetupModal,
  ChildModeUnlockModal,
  loadChildMode,
} from "./components/ChildModeModal";
import { DailyChallengeModal } from "./components/DailyChallengeModal";
import { EMIModal } from "./components/EMIModal";
import { EndlessRunnerGame } from "./components/EndlessRunnerGame";
import { EquationBuilderGame } from "./components/EquationBuilderGame";
import { ExplainModal } from "./components/ExplainModal";
import { FlappyBirdGame } from "./components/FlappyBirdGame";
import { FormulaModal } from "./components/FormulaModal";
import { GameSelectModal } from "./components/GameSelectModal";
import { GraphModal } from "./components/GraphModal";
import { type HistoryEntry, HistoryPanel } from "./components/HistoryPanel";
import { MathPuzzleModal } from "./components/MathPuzzleModal";
import { MathRunnerGame } from "./components/MathRunnerGame";
import { MemoryMatchGame } from "./components/MemoryMatchGame";
import { MoreMenu } from "./components/MoreMenu";
import { type Settings, SettingsModal } from "./components/SettingsModal";
import { SnakeGame } from "./components/SnakeGame";
import { SpeedMathGame } from "./components/SpeedMathGame";
import { StackTowerGame } from "./components/StackTowerGame";
import { TapReactionGame } from "./components/TapReactionGame";
import { TicTacToeGame } from "./components/TicTacToeGame";
import { useSound } from "./hooks/useSound";
import { useVoice } from "./hooks/useVoice";
import { LanguageContext } from "./i18n/LanguageContext";
import { getT } from "./i18n/translations";

type Modal =
  | "formula"
  | "settings"
  | "about"
  | "history"
  | "graph"
  | "explain"
  | "aisolve"
  | "challenge"
  | "gameSelect"
  | "puzzle"
  | "emi"
  | "speedMath"
  | "memoryMatch"
  | "equationBuilder"
  | "mathRunner"
  | "flappyBird"
  | "snake"
  | "stackTower"
  | "ticTacToe"
  | "endlessRunner"
  | "brickBreaker"
  | "tapReaction"
  | "physics"
  | "chemistry"
  | null;

const MAX_HISTORY = 500;
const STORAGE_KEYS = { history: "calc_history", settings: "calc_settings" };

// Memoized expression evaluator cache
const evalCache = new Map<string, string>();

function evaluateExpression(expr: string): string {
  if (evalCache.has(expr)) return evalCache.get(expr)!;
  let result: string;
  try {
    const sanitized = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/[^0-9+\-*/.%() ]/g, "");
    if (!sanitized) {
      result = "";
    } else {
      // eslint-disable-next-line no-new-func
      const val = new Function(
        `"use strict"; return (${sanitized})`,
      )() as number;
      if (
        val === Number.POSITIVE_INFINITY ||
        val === Number.NEGATIVE_INFINITY ||
        !Number.isFinite(val)
      ) {
        result = "Undefined";
      } else {
        result = String(Number.parseFloat(val.toPrecision(12)));
      }
    }
  } catch {
    result = "Error";
  }
  if (evalCache.size >= 50) {
    const firstKey = evalCache.keys().next().value;
    if (firstKey !== undefined) evalCache.delete(firstKey);
  }
  evalCache.set(expr, result);
  return result;
}

function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || "[]");
  } catch {
    return [];
  }
}

function loadSettings(): Settings {
  const defaults: Settings = {
    soundEnabled: true,
    hapticEnabled: true,
    voiceContinuous: false,
    voiceSensitivity: 70,
    language: "en-US",
    theme: "neon",
  };
  try {
    return {
      ...defaults,
      ...JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || "{}"),
    };
  } catch {
    return defaults;
  }
}

const THEME_VARS: Record<string, Record<string, string>> = {
  neon: {
    "--clr-yellow": "#FFD700",
    "--clr-blue": "#00BFFF",
    "--clr-green": "#39FF14",
    "--clr-purple": "#A855F7",
    "--clr-orange": "#FF8C00",
    "--clr-red": "#FF3B30",
  },
  amoled: {
    "--clr-yellow": "#E0E0E0",
    "--clr-blue": "#00E5FF",
    "--clr-green": "#00E676",
    "--clr-purple": "#7C4DFF",
    "--clr-orange": "#FFAB40",
    "--clr-red": "#FF1744",
  },
  luxury: {
    "--clr-yellow": "#FFD700",
    "--clr-blue": "#FF69B4",
    "--clr-green": "#50C878",
    "--clr-purple": "#6A0DAD",
    "--clr-orange": "#FF7F50",
    "--clr-red": "#DC143C",
  },
  cyberpunk: {
    "--clr-yellow": "#39FF14",
    "--clr-blue": "#FF2D87",
    "--clr-green": "#00FFFF",
    "--clr-purple": "#FF00FF",
    "--clr-orange": "#FF6B00",
    "--clr-red": "#FF0040",
  },
};

const ROW_KEYS = ["row-ac", "row-7", "row-4", "row-1", "row-0"];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [isError, setIsError] = useState(false);
  const [isErrorFlash, setIsErrorFlash] = useState(false);
  const [waitingOperand, setWaitingOperand] = useState(false);
  const [copied, setCopied] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [showMore, setShowMore] = useState(false);
  const [showBookMenu, setShowBookMenu] = useState(false);
  const [showAppMenu, setShowAppMenu] = useState(false);
  const [showChildSetup, setShowChildSetup] = useState(false);
  const [showChildUnlock, setShowChildUnlock] = useState(false);
  const [childModeActive, setChildModeActive] = useState(
    () => !!loadChildMode()?.active,
  );
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [historyCount, setHistoryCount] = useState(() => loadHistory().length);
  const [formulaForAI, setFormulaForAI] = useState("");
  const [formulaAutoSolve, setFormulaAutoSolve] = useState(false);

  const t = getT(settings.language);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Load jsPDF from CDN
  useEffect(() => {
    if (document.getElementById("jspdf-cdn")) return;
    const script = document.createElement("script");
    script.id = "jspdf-cdn";
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // Apply theme CSS variables
  useEffect(() => {
    const vars = THEME_VARS[settings.theme] || THEME_VARS.neon;
    for (const [k, v] of Object.entries(vars)) {
      document.documentElement.style.setProperty(k, v);
    }
  }, [settings.theme]);

  const {
    playNumber,
    playPlus,
    playMinus,
    playMultiply,
    playDivide,
    playNeutral,
    playEquals,
    playError,
  } = useSound(settings.soundEnabled);

  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (settings.hapticEnabled && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    },
    [settings.hapticEnabled],
  );

  const triggerErrorFlash = useCallback(() => {
    setIsErrorFlash(true);
    setTimeout(() => setIsErrorFlash(false), 400);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
  }, [history]);

  const addHistory = useCallback((expr: string, result: string) => {
    setHistory((prev) => {
      const next = [{ expr, result, id: Date.now() }, ...prev].slice(
        0,
        MAX_HISTORY,
      );
      return next;
    });
    setHistoryCount((c) => c + 1);
  }, []);

  const handleVoiceResult = useCallback(
    (expr: string, result: number) => {
      const resultStr = String(Number.parseFloat(result.toPrecision(12)));
      setExpression(`${expr} =`);
      setDisplay(resultStr);
      setIsError(false);
      setWaitingOperand(true);
      addHistory(expr, resultStr);
    },
    [addHistory],
  );

  const handleVoiceError = useCallback((msg: string) => {
    toast.error(msg);
  }, []);

  const {
    status: voiceStatus,
    startListening,
    stopListening,
  } = useVoice({
    lang: settings.language,
    continuous: settings.voiceContinuous,
    onResult: handleVoiceResult,
    onError: handleVoiceError,
  });

  const pressDigit = useCallback(
    (digit: string) => {
      playNumber();
      vibrate(10);
      setIsError(false);
      if (waitingOperand) {
        setDisplay(digit === "." ? "0." : digit);
        setWaitingOperand(false);
      } else {
        setDisplay((prev) => {
          if (digit === "." && prev.includes(".")) return prev;
          if (prev === "0" && digit !== ".") return digit;
          if (prev.length >= 16) return prev;
          return `${prev}${digit}`;
        });
      }
    },
    [playNumber, vibrate, waitingOperand],
  );

  const pressOperator = useCallback(
    (op: string, soundFn: () => void) => {
      soundFn();
      vibrate(15);
      setIsError(false);
      setExpression((prev) => {
        if (waitingOperand && prev) {
          return `${prev.slice(0, -2)}${op} `;
        }
        return prev ? `${prev}${display} ${op} ` : `${display} ${op} `;
      });
      setWaitingOperand(true);
    },
    [vibrate, display, waitingOperand],
  );

  const pressEquals = useCallback(() => {
    playEquals();
    const expr = `${expression}${display}`;
    if (!expr) return;
    const result = evaluateExpression(expr);
    const isResultError = result === "Error" || result === "Undefined";
    setIsError(isResultError);
    setDisplay(result);
    setExpression(`${expr} =`);
    setWaitingOperand(true);
    if (isResultError) {
      playError();
      vibrate([30, 10, 30]);
      triggerErrorFlash();
    } else {
      vibrate(50);
      addHistory(expr, result);
    }
  }, [
    playEquals,
    playError,
    vibrate,
    triggerErrorFlash,
    expression,
    display,
    addHistory,
  ]);

  const pressPercent = useCallback(() => {
    playNeutral();
    setDisplay((prev) => {
      const n = Number.parseFloat(prev);
      if (Number.isNaN(n)) return prev;
      return String(n / 100);
    });
  }, [playNeutral]);

  const pressClear = useCallback(() => {
    playNeutral();
    setDisplay("0");
    setIsError(false);
    setWaitingOperand(false);
  }, [playNeutral]);

  const pressAllClear = useCallback(() => {
    playNeutral();
    setDisplay("0");
    setExpression("");
    setIsError(false);
    setWaitingOperand(false);
  }, [playNeutral]);

  const copyResult = useCallback(() => {
    navigator.clipboard.writeText(display).then(() => {
      setCopied(true);
      toast.success(t.copied);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [display, t.copied]);

  const exportPDF = useCallback(() => {
    const jspdfLib = (window as any).jspdf;
    if (!jspdfLib) {
      toast.error(t.pdfNotLoaded);
      return;
    }
    const { jsPDF } = jspdfLib;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(255, 215, 0);
    doc.text("CALC AI Pro", 20, 20);

    doc.setFontSize(11);
    doc.setTextColor(180, 180, 180);
    doc.text("Powered by Shreyash", 20, 30);

    doc.setDrawColor(80, 80, 80);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text("Expression:", 20, 46);
    doc.setFontSize(12);
    doc.setTextColor(200, 200, 200);
    doc.text(expression || display, 20, 54);

    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text("Result:", 20, 65);
    doc.setFontSize(16);
    doc.setTextColor(57, 255, 20);
    doc.text(display, 20, 75);

    if (history.length > 0) {
      doc.setDrawColor(80, 80, 80);
      doc.line(20, 82, 190, 82);

      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text("Recent History (last 5):", 20, 92);

      doc.setFontSize(10);
      doc.setTextColor(180, 180, 180);
      const recent = history.slice(0, 5);
      recent.forEach((entry, i) => {
        doc.text(`${i + 1}. ${entry.expr} = ${entry.result}`, 20, 102 + i * 9);
      });
    }

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Generated by CALC AI Pro — Powered by Shreyash", 20, 285);

    doc.save("calculation.pdf");
    toast.success(t.pdfExported);
  }, [display, expression, history, t.pdfExported, t.pdfNotLoaded]);

  const previewResult = useMemo(() => {
    const previewExpr = `${expression}${!waitingOperand && display !== "0" ? display : ""}`;
    if (!previewExpr || previewExpr.endsWith("= ") || previewExpr.endsWith("="))
      return "";
    const r = evaluateExpression(previewExpr);
    return r !== "Error" && r !== "Undefined" && r !== display ? r : "";
  }, [expression, display, waitingOperand]);

  type BtnVariant =
    | "yellow"
    | "blue"
    | "green"
    | "purple"
    | "orange"
    | "red"
    | "neutral";
  interface CalcBtn {
    label: string;
    variant: BtnVariant;
    wide?: boolean;
    action: () => void;
  }

  const buttons: CalcBtn[][] = [
    [
      { label: "AC", variant: "neutral", action: pressAllClear },
      { label: "C", variant: "neutral", action: pressClear },
      { label: "%", variant: "neutral", action: pressPercent },
      {
        label: "÷",
        variant: "orange",
        action: () => pressOperator("÷", playDivide),
      },
    ],
    [
      { label: "7", variant: "yellow", action: () => pressDigit("7") },
      { label: "8", variant: "yellow", action: () => pressDigit("8") },
      { label: "9", variant: "yellow", action: () => pressDigit("9") },
      {
        label: "×",
        variant: "purple",
        action: () => pressOperator("×", playMultiply),
      },
    ],
    [
      { label: "4", variant: "yellow", action: () => pressDigit("4") },
      { label: "5", variant: "yellow", action: () => pressDigit("5") },
      { label: "6", variant: "yellow", action: () => pressDigit("6") },
      {
        label: "-",
        variant: "green",
        action: () => pressOperator("-", playMinus),
      },
    ],
    [
      { label: "1", variant: "yellow", action: () => pressDigit("1") },
      { label: "2", variant: "yellow", action: () => pressDigit("2") },
      { label: "3", variant: "yellow", action: () => pressDigit("3") },
      {
        label: "+",
        variant: "blue",
        action: () => pressOperator("+", playPlus),
      },
    ],
    [
      {
        label: "0",
        variant: "yellow",
        wide: true,
        action: () => pressDigit("0"),
      },
      { label: ".", variant: "yellow", action: () => pressDigit(".") },
      { label: "=", variant: "red", action: pressEquals },
    ],
  ];

  const btnClass = (v: BtnVariant) =>
    `btn-${v} relative rounded-2xl font-black text-lg transition-all duration-100 hover:brightness-110 btn-glossy overflow-hidden`;

  const currentExpression = `${expression}${display}`;
  const explainExpression = expression.trimEnd().endsWith("=")
    ? expression.replace(/\s*=\s*$/, "").trim()
    : `${expression}${display !== "0" ? display : ""}`.trim();

  // ── SPLASH SCREEN ──
  if (showSplash) {
    return (
      <div
        style={{
          height: "100dvh",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Ambient glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,215,0,0.14) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "20%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            right: "10%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,191,255,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* App Icon */}
        <img
          src="/assets/generated/app-icon.dim_512x512.png"
          alt="icon"
          className="splash-icon"
          style={{
            width: 100,
            height: 100,
            borderRadius: 24,
            marginBottom: 28,
            boxShadow:
              "0 0 50px rgba(255,215,0,0.45), 0 0 100px rgba(255,215,0,0.18)",
          }}
        />

        {/* Main title: AI Solver */}
        <h1
          className="splash-title"
          style={{
            margin: 0,
            fontSize: "clamp(36px, 10vw, 54px)",
            fontWeight: 900,
            letterSpacing: "6px",
            background:
              "linear-gradient(135deg, #FFD700 0%, #FF8C00 40%, #A855F7 80%, #00BFFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textTransform: "uppercase",
            lineHeight: 1.1,
            textAlign: "center",
            paddingLeft: 12,
            paddingRight: 12,
          }}
        >
          AI Solver
        </h1>

        {/* Sub title: Calculator */}
        <h2
          className="splash-sub"
          style={{
            margin: "6px 0 0",
            fontSize: "clamp(24px, 7vw, 36px)",
            fontWeight: 700,
            letterSpacing: "12px",
            color: "rgba(255,255,255,0.85)",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          CALCULATOR
        </h2>

        {/* Divider line */}
        <div
          style={{
            marginTop: 18,
            width: 120,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #FFD700, #A855F7, transparent)",
            borderRadius: 2,
            opacity: 0.8,
            animation: "splashSubReveal 0.6s ease 1.2s both",
          }}
        />

        {/* Tagline */}
        <p
          className="splash-sub"
          style={{
            marginTop: 14,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 3,
            color: "rgba(255,255,255,0.45)",
            textTransform: "uppercase",
            textAlign: "center",
            animationDelay: "1.4s",
          }}
        >
          Powered by Shreyash
        </p>
      </div>
    );
  }

  // ── MAIN APP ──
  return (
    <LanguageContext.Provider value={t}>
      <div
        className="h-[100dvh] flex flex-col md:items-center md:justify-center md:py-6 md:px-4 bg-amoled-animated"
        style={{
          background:
            "radial-gradient(ellipse at 30% 0%, rgba(80,40,160,0.18) 0%, transparent 60%), radial-gradient(ellipse at 70% 100%, rgba(0,80,160,0.12) 0%, transparent 60%), #000",
        }}
      >
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "rgba(30,30,30,0.95)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "white",
            },
          }}
        />

        {/* Calculator card */}
        <div
          className="flex-1 flex flex-col md:flex-none md:max-w-[420px] w-full rounded-none md:rounded-3xl p-3 md:p-5 gap-2 md:gap-3"
          style={{
            background: "rgba(18,18,18,0.97)",
            border: "1px solid rgba(255,215,0,0.12)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.80), inset 0 1px 0 rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Display */}
          <div
            className={`glass-display rounded-2xl px-5 pt-4 pb-3 flex flex-col gap-1 justify-end ${
              isErrorFlash ? "error-flash" : ""
            }`}
            style={{
              minHeight: "210px",
              boxShadow:
                "0 0 40px rgba(255,215,0,0.08), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
            data-ocid="calc.panel"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-white/40 text-sm font-mono truncate flex-1 min-h-[20px]">
                {expression || ""}
              </p>
              <button
                type="button"
                onClick={copyResult}
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
                data-ocid="calc.copy_button"
              >
                {copied ? (
                  <Check size={13} className="text-green-400" />
                ) : (
                  <Copy size={13} className="text-white/50" />
                )}
              </button>
            </div>

            <p
              className={`font-black text-right leading-none transition-colors ${
                isError ? "text-red-400" : "text-white"
              }`}
              style={{
                fontSize:
                  display.length > 12
                    ? "44px"
                    : display.length > 8
                      ? "60px"
                      : "80px",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-1px",
                fontWeight: 900,
                textShadow: isError
                  ? "0 0 20px rgba(255,59,48,0.5)"
                  : "0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              {display}
            </p>

            {previewResult && (
              <p className="text-right text-white/30 text-sm font-mono">
                = {previewResult}
              </p>
            )}
          </div>

          {/* Mic row */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={
                voiceStatus === "listening" ? stopListening : startListening
              }
              className={`flex items-center gap-2 px-4 h-10 rounded-2xl font-semibold text-sm transition-all active:scale-90 ${
                voiceStatus === "listening" ? "mic-active" : "mic-idle"
              }`}
              data-ocid="calc.mic_button"
            >
              <Mic size={16} />
              {voiceStatus === "listening" ? (
                <div
                  className="flex items-center gap-0.5"
                  style={{ height: 14 }}
                >
                  <div className="waveform-bar" />
                  <div className="waveform-bar" />
                  <div className="waveform-bar" />
                </div>
              ) : (
                <span className="text-xs">
                  {voiceStatus === "idle" ? t.voiceLabel : t.voiceProcessing}
                </span>
              )}
            </button>

            {historyCount > 0 && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{
                  background: "rgba(255,215,0,0.15)",
                  color: "var(--clr-yellow)",
                  border: "1px solid rgba(255,215,0,0.25)",
                }}
              >
                {history.length}
              </span>
            )}
          </div>

          {/* Keypad */}
          <div
            className="flex-1 flex flex-col gap-1 md:gap-1"
            style={{ minHeight: 0 }}
          >
            {buttons.map((row, ri) => (
              <div
                key={ROW_KEYS[ri]}
                className="flex-1 grid gap-1"
                style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
              >
                {row.map((btn) => (
                  <button
                    type="button"
                    key={btn.label}
                    onClick={btn.action}
                    className={`${btnClass(btn.variant)} h-full w-full ${
                      btn.wide ? "col-span-2" : ""
                    }`}
                    style={btn.wide ? { gridColumn: "span 2" } : {}}
                    data-ocid={`calc.${btn.label === "=" ? "submit_button" : "button"}`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom toolbar — single More button */}
          <div className="flex-shrink-0">
            <BottomToolbar
              onMore={() => setShowMore(true)}
              onBook={() => setShowBookMenu(true)}
              onAppMenu={() => {
                if (childModeActive) {
                  setShowChildUnlock(true);
                } else {
                  setShowAppMenu(true);
                }
              }}
            />
          </div>

          <div className="hidden md:block pt-1">
            <p className="text-white/20 text-xs text-center">
              © {new Date().getFullYear()}. Built with{" "}
              <span style={{ color: "#FF6058" }}>❤️</span> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white/40 transition-colors"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                caffeine.ai
              </a>
            </p>
            <p className="text-white/20 text-xs text-center">
              Crafted by{" "}
              <span style={{ color: "var(--clr-yellow)", fontWeight: 600 }}>
                Shreyash
              </span>
            </p>
          </div>
        </div>

        {modal === "formula" && (
          <FormulaModal
            onClose={() => setModal(null)}
            onFormulaClick={(formula) => {
              setFormulaForAI(formula);
              setFormulaAutoSolve(true);
              setModal("aisolve");
            }}
          />
        )}
        {modal === "physics" && (
          <FormulaModal
            onClose={() => setModal(null)}
            defaultTab="physics"
            onFormulaClick={(formula) => {
              setFormulaForAI(formula);
              setFormulaAutoSolve(true);
              setModal("aisolve");
            }}
          />
        )}
        {modal === "settings" && (
          <SettingsModal
            settings={settings}
            onChange={(s) => setSettings(s)}
            onClose={() => setModal(null)}
            onAbout={() => {
              setModal(null);
              setTimeout(() => setModal("about"), 50);
            }}
          />
        )}
        {modal === "chemistry" && (
          <FormulaModal
            onClose={() => setModal(null)}
            defaultTab="chemistry"
            onFormulaClick={(formula) => {
              setFormulaForAI(formula);
              setFormulaAutoSolve(true);
              setModal("aisolve");
            }}
          />
        )}
        {modal === "about" && <AboutModal onClose={() => setModal(null)} />}
        {modal === "history" && (
          <HistoryPanel
            history={history}
            onRestore={(result) => {
              setDisplay(result);
              setExpression("");
              setWaitingOperand(true);
            }}
            onClear={() => {
              setHistory([]);
              setHistoryCount(0);
            }}
            onDeleteEntry={(id) =>
              setHistory((prev) => prev.filter((e) => e.id !== id))
            }
            onClose={() => setModal(null)}
          />
        )}
        {modal === "graph" && (
          <GraphModal
            expression={currentExpression}
            onClose={() => setModal(null)}
          />
        )}
        {modal === "explain" && (
          <ExplainModal
            expression={explainExpression}
            lang={settings.language}
            onClose={() => setModal(null)}
          />
        )}
        {modal === "aisolve" && (
          <AISolveModal
            expression={formulaAutoSolve ? formulaForAI : currentExpression}
            autoSolve={formulaAutoSolve}
            onClose={() => {
              setModal(null);
              setFormulaAutoSolve(false);
            }}
          />
        )}
        {modal === "challenge" && (
          <DailyChallengeModal onClose={() => setModal("gameSelect")} />
        )}
        {modal === "gameSelect" && (
          <GameSelectModal
            onClose={() => setModal(null)}
            onDailyChallenge={() => {
              setModal(null);
              setTimeout(() => setModal("challenge"), 50);
            }}
            onMathPuzzle={() => {
              setModal(null);
              setTimeout(() => setModal("puzzle"), 50);
            }}
            onSpeedMath={() => {
              setModal(null);
              setTimeout(() => setModal("speedMath"), 50);
            }}
            onMemoryMatch={() => {
              setModal(null);
              setTimeout(() => setModal("memoryMatch"), 50);
            }}
            onEquationBuilder={() => {
              setModal(null);
              setTimeout(() => setModal("equationBuilder"), 50);
            }}
            onMathRunner={() => {
              setModal(null);
              setTimeout(() => setModal("mathRunner"), 50);
            }}
            onFlappyBird={() => {
              setModal(null);
              setTimeout(() => setModal("flappyBird"), 50);
            }}
            onSnake={() => {
              setModal(null);
              setTimeout(() => setModal("snake"), 50);
            }}
            onStackTower={() => {
              setModal(null);
              setTimeout(() => setModal("stackTower"), 50);
            }}
            onTicTacToe={() => {
              setModal(null);
              setTimeout(() => setModal("ticTacToe"), 50);
            }}
            onEndlessRunner={() => {
              setModal(null);
              setTimeout(() => setModal("endlessRunner"), 50);
            }}
            onBrickBreaker={() => {
              setModal(null);
              setTimeout(() => setModal("brickBreaker"), 50);
            }}
            onTapReaction={() => {
              setModal(null);
              setTimeout(() => setModal("tapReaction"), 50);
            }}
          />
        )}
        {modal === "speedMath" && (
          <SpeedMathGame onClose={() => setModal("gameSelect")} />
        )}
        {modal === "memoryMatch" && (
          <MemoryMatchGame onClose={() => setModal("gameSelect")} />
        )}
        {modal === "equationBuilder" && (
          <EquationBuilderGame onClose={() => setModal("gameSelect")} />
        )}
        {modal === "mathRunner" && (
          <MathRunnerGame onClose={() => setModal("gameSelect")} />
        )}
        {modal === "flappyBird" && (
          <FlappyBirdGame onClose={() => setModal("gameSelect")} />
        )}
        {modal === "snake" && (
          <SnakeGame onClose={() => setModal("gameSelect")} />
        )}
        {modal === "stackTower" && (
          <StackTowerGame onClose={() => setModal("gameSelect")} />
        )}
        {modal === "ticTacToe" && (
          <TicTacToeGame onClose={() => setModal("gameSelect")} />
        )}
        {modal === "endlessRunner" && (
          <EndlessRunnerGame onClose={() => setModal("gameSelect")} />
        )}
        {modal === "brickBreaker" && (
          <BrickBreakerGame onClose={() => setModal("gameSelect")} />
        )}
        {modal === "tapReaction" && (
          <TapReactionGame onClose={() => setModal("gameSelect")} />
        )}
        {modal === "puzzle" && (
          <MathPuzzleModal onClose={() => setModal("gameSelect")} />
        )}
        {modal === "emi" && <EMIModal onClose={() => setModal(null)} />}

        {showAppMenu && (
          <AppMenuModal
            onClose={() => setShowAppMenu(false)}
            onChildMode={() => {
              if (childModeActive) {
                // Already active: show unlock to disable
                setShowAppMenu(false);
                setShowChildUnlock(true);
              } else {
                setShowAppMenu(false);
                setShowChildSetup(true);
              }
            }}
          />
        )}
        {showChildSetup && (
          <ChildModeSetupModal
            onClose={() => setShowChildSetup(false)}
            onDone={() => {
              setShowChildSetup(false);
              setChildModeActive(true);
            }}
          />
        )}
        {showChildUnlock && (
          <ChildModeUnlockModal
            config={loadChildMode()!}
            onClose={() => setShowChildUnlock(false)}
            onUnlocked={() => {
              setShowChildUnlock(false);
              setChildModeActive(false);
            }}
          />
        )}

        {showBookMenu && (
          <BookMenuModal
            onClose={() => setShowBookMenu(false)}
            onMath={() => {
              setShowBookMenu(false);
              setModal("formula");
            }}
            onPhysics={() => {
              setShowBookMenu(false);
              setModal("physics");
            }}
            onChemistry={() => {
              setShowBookMenu(false);
              setModal("chemistry");
            }}
          />
        )}

        {showMore && (
          <MoreMenu
            onClose={() => setShowMore(false)}
            onHistory={() => {
              setShowMore(false);
              setModal("history");
            }}
            onGraph={() => {
              setShowMore(false);
              setModal("graph");
            }}
            onExplain={() => {
              setShowMore(false);
              setModal("explain");
            }}
            onSettings={() => {
              setShowMore(false);
              setModal("settings");
            }}
            onAiSolve={() => {
              setShowMore(false);
              setModal("aisolve");
            }}
            onExportPdf={() => {
              setShowMore(false);
              exportPDF();
            }}
            onChallenge={() => {
              setShowMore(false);
              setModal("gameSelect");
            }}
            onEmi={() => {
              setShowMore(false);
              setModal("emi");
            }}
          />
        )}
      </div>
    </LanguageContext.Provider>
  );
}
