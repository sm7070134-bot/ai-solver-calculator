import { useState } from "react";

interface Props {
  onClose: () => void;
}

function shareScore(level: number) {
  const text = `I completed ${level} levels in Equation Builder on CALC AI Pro! 🔢🎮 Can you beat me?`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  if (navigator.share) {
    navigator
      .share({ title: "CALC AI Pro Score", text })
      .catch(() => window.open(whatsappUrl, "_blank"));
  } else {
    window.open(whatsappUrl, "_blank");
  }
}

interface Level {
  target: number;
  pieces: string[];
  hint: string;
}

const LEVELS: Level[] = [
  { target: 7, pieces: ["3", "+", "4"], hint: "3 + 4" },
  { target: 15, pieces: ["3", "×", "5"], hint: "3 × 5" },
  {
    target: 10,
    pieces: ["2", "+", "3", "×", "2"],
    hint: "2 + 3 × 2... wait, try 2 × 3 + 4",
  },
  { target: 12, pieces: ["4", "×", "3"], hint: "4 × 3" },
  { target: 20, pieces: ["4", "+", "16"], hint: "4 + 16" },
  { target: 36, pieces: ["6", "×", "6"], hint: "6 × 6" },
  { target: 25, pieces: ["5", "×", "5"], hint: "5 × 5" },
  { target: 50, pieces: ["5", "×", "8", "+", "10"], hint: "5 × 8 + 10" },
  { target: 14, pieces: ["2", "×", "7"], hint: "2 × 7" },
  { target: 100, pieces: ["10", "×", "10"], hint: "10 × 10" },
];

function evalEquation(parts: string[]): number | null {
  try {
    const expr = parts.join(" ").replace(/×/g, "*").replace(/÷/g, "/");
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${expr})`)() as number;
    return Number.isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

export function EquationBuilderGame({ onClose }: Props) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [built, setBuilt] = useState<Array<{ uid: number; piece: string }>>([]);
  const uidCounter = { current: 0 };
  const [hints, setHints] = useState(2);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [phase, setPhase] = useState<"playing" | "gameover">("playing");

  const level = LEVELS[levelIdx];

  function addPiece(piece: string) {
    const next = [...built, { uid: uidCounter.current++, piece }];
    setBuilt(next);
    setShowHint(false);
    const result = evalEquation(next.map((x) => x.piece));
    if (result !== null && result === level.target) {
      setFeedback("correct");
      setTimeout(() => {
        setFeedback(null);
        if (levelIdx + 1 >= LEVELS.length) setPhase("gameover");
        else {
          setLevelIdx((i) => i + 1);
          setBuilt([]);
        }
      }, 800);
    } else if (result !== null && next.length >= level.pieces.length) {
      setFeedback("wrong");
      setTimeout(() => {
        setFeedback(null);
        setBuilt([]);
      }, 700);
    }
  }

  function removeLast() {
    setBuilt((b) => b.slice(0, -1));
  }

  function useHint() {
    if (hints <= 0) return;
    setHints((h) => h - 1);
    setShowHint(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(0,0,0,0.97)" }}
      data-ocid="equation_builder.modal"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔢</span>
          <span className="text-white font-black text-lg">
            Equation Builder
          </span>
          <span className="text-white/40 text-sm">
            Lv {levelIdx + 1}/{LEVELS.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)",
          }}
          data-ocid="equation_builder.close_button"
        >
          ✕
        </button>
      </div>

      {phase === "playing" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-5">
          {/* Target */}
          <div className="text-center">
            <p className="text-white/40 text-sm uppercase tracking-wider mb-1">
              Target
            </p>
            <p
              className="font-black text-6xl"
              style={{
                color: "#39FF14",
                textShadow: "0 0 20px rgba(57,255,20,0.60)",
              }}
            >
              = {level.target}
            </p>
          </div>

          {/* Equation bar */}
          <div
            className="w-full max-w-sm rounded-2xl p-4 min-h-16 flex flex-wrap gap-2 items-center justify-center transition-all duration-200"
            style={{
              background:
                feedback === "correct"
                  ? "rgba(57,255,20,0.15)"
                  : feedback === "wrong"
                    ? "rgba(255,59,48,0.15)"
                    : "rgba(255,255,255,0.05)",
              border: `2px solid ${feedback === "correct" ? "rgba(57,255,20,0.50)" : feedback === "wrong" ? "rgba(255,59,48,0.50)" : "rgba(255,255,255,0.12)"}`,
            }}
          >
            {built.length === 0 ? (
              <span className="text-white/30 text-sm">
                Tap pieces below to build...
              </span>
            ) : (
              built.map((x) => (
                <span
                  key={x.uid}
                  className="rounded-xl px-3 py-1.5 font-black text-xl text-white"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  {x.piece}
                </span>
              ))
            )}
          </div>

          {showHint && (
            <p className="text-sm" style={{ color: "#FFD700" }}>
              💡 Hint: {level.hint}
            </p>
          )}

          {/* Pieces */}
          <div className="flex flex-wrap gap-3 justify-center max-w-sm">
            {level.pieces.map((piece) => (
              <button
                key={piece}
                type="button"
                className="rounded-2xl px-5 py-4 font-black text-2xl text-white active:scale-90 transition-all"
                style={{
                  background: /[+\-×÷]/.test(piece)
                    ? "rgba(168,85,247,0.25)"
                    : "rgba(255,215,0,0.15)",
                  border: `1px solid ${/[+\-×÷]/.test(piece) ? "rgba(168,85,247,0.40)" : "rgba(255,215,0,0.30)"}`,
                  color: /[+\-×÷]/.test(piece) ? "#A855F7" : "#FFD700",
                }}
                onClick={() => addPiece(piece)}
                data-ocid="equation_builder.button"
              >
                {piece}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={removeLast}
              className="rounded-xl px-5 py-3 font-bold text-white active:scale-90"
              style={{
                background: "rgba(255,59,48,0.20)",
                border: "1px solid rgba(255,59,48,0.40)",
              }}
              data-ocid="equation_builder.delete_button"
            >
              ⌫ Back
            </button>
            <button
              type="button"
              onClick={() => setBuilt([])}
              className="rounded-xl px-5 py-3 font-bold text-white active:scale-90"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              data-ocid="equation_builder.secondary_button"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={useHint}
              disabled={hints === 0}
              className="rounded-xl px-5 py-3 font-bold active:scale-90"
              style={{
                background:
                  hints > 0 ? "rgba(255,215,0,0.20)" : "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,215,0,0.30)",
                color: hints > 0 ? "#FFD700" : "rgba(255,255,255,0.20)",
              }}
              data-ocid="equation_builder.toggle"
            >
              💡 {hints}
            </button>
          </div>
        </div>
      )}

      {phase === "gameover" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 text-center">
          <span style={{ fontSize: 64 }}>🏆</span>
          <h2 className="text-white font-black text-3xl">All Levels Done!</h2>
          <p className="text-white/50">
            You completed all {LEVELS.length} levels!
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              type="button"
              className="rounded-2xl py-4 font-black text-black text-lg active:scale-95"
              style={{
                background: "linear-gradient(90deg,#25D366,#128C7E)",
                boxShadow: "0 0 20px rgba(37,211,102,0.40)",
              }}
              onClick={() => shareScore(LEVELS.length)}
              data-ocid="equation_builder.secondary_button"
            >
              📤 Share on WhatsApp
            </button>
            <button
              type="button"
              className="rounded-2xl py-4 font-black text-black text-lg active:scale-95"
              style={{ background: "linear-gradient(90deg,#39FF14,#00BFFF)" }}
              onClick={() => {
                setLevelIdx(0);
                setBuilt([]);
                setHints(2);
                setPhase("playing");
              }}
              data-ocid="equation_builder.primary_button"
            >
              🔄 Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
