import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  onClose: () => void;
}

type Phase =
  | "menu"
  | "starting"
  | "shattering"
  | "scrambled"
  | "playing"
  | "levelComplete";

const TILE_COLORS: Record<number, string> = {
  1: "linear-gradient(135deg, #00BFFF, #0080FF)",
  2: "linear-gradient(135deg, #FFD700, #FF8C00)",
  3: "linear-gradient(135deg, #39FF14, #00CC00)",
  4: "linear-gradient(135deg, #A855F7, #7C3AED)",
  5: "linear-gradient(135deg, #FF8C00, #FF4500)",
  6: "linear-gradient(135deg, #FF69B4, #E91E8C)",
  7: "linear-gradient(135deg, #00BFFF, #0040FF)",
  8: "linear-gradient(135deg, #FF3B30, #CC0000)",
};

const TILE_GLOWS: Record<number, string> = {
  1: "rgba(0,191,255,0.6)",
  2: "rgba(255,215,0,0.6)",
  3: "rgba(57,255,20,0.6)",
  4: "rgba(168,85,247,0.6)",
  5: "rgba(255,140,0,0.6)",
  6: "rgba(255,105,180,0.6)",
  7: "rgba(0,191,255,0.5)",
  8: "rgba(255,59,48,0.6)",
};

const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, null];

function isSolved(tiles: (number | null)[]) {
  return JSON.stringify(tiles) === JSON.stringify(SOLVED);
}

function shuffle(level: number): (number | null)[] {
  const moves = level === 1 ? 20 : level === 2 ? 40 : 60;
  let tiles: (number | null)[] = [...SOLVED];
  let emptyIdx = 8;
  const dirs = [-1, 1, -3, 3];
  for (let i = 0; i < moves; i++) {
    const _row = Math.floor(emptyIdx / 3);
    const col = emptyIdx % 3;
    const valid = dirs.filter((d) => {
      const ni = emptyIdx + d;
      if (ni < 0 || ni > 8) return false;
      // horizontal moves must stay on same row
      if (d === 1 && col === 2) return false;
      if (d === -1 && col === 0) return false;
      return true;
    });
    const d = valid[Math.floor(Math.random() * valid.length)];
    const ni = emptyIdx + d;
    [tiles[emptyIdx], tiles[ni]] = [tiles[ni], tiles[emptyIdx]];
    emptyIdx = ni;
  }
  return tiles;
}

const MCQ_QUESTIONS = [
  { q: "12 × 4 = ?", options: ["46", "48", "52", "44"], answer: "48" },
  { q: "81 ÷ 9 = ?", options: ["7", "8", "9", "11"], answer: "9" },
  { q: "15 + 27 = ?", options: ["40", "42", "43", "44"], answer: "42" },
  { q: "100 - 37 = ?", options: ["63", "67", "73", "53"], answer: "63" },
  { q: "7² = ?", options: ["42", "49", "56", "14"], answer: "49" },
  { q: "√144 = ?", options: ["10", "11", "12", "13"], answer: "12" },
  { q: "3 × 3 × 3 = ?", options: ["9", "18", "27", "24"], answer: "27" },
  { q: "250 ÷ 5 = ?", options: ["40", "45", "50", "55"], answer: "50" },
];

export function MathPuzzleModal({ onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("menu");
  const [level, setLevel] = useState(1);
  const [tiles, setTiles] = useState<(number | null)[]>(SOLVED);
  const [shatterOffsets, setShatterOffsets] = useState<
    { x: number; y: number; rotate: number }[]
  >(Array.from({ length: 9 }, () => ({ x: 0, y: 0, rotate: 0 })));
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem("puzzle_highscore") || "0");
    } catch {
      return 0;
    }
  });
  const [bonusQ, setBonusQ] = useState<(typeof MCQ_QUESTIONS)[0] | null>(null);
  const [bonusAnswer, setBonusAnswer] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (phase === "playing") {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const startLevel = useCallback((lvl: number) => {
    setLevel(lvl);
    setMoves(0);
    setSeconds(0);
    setBonusQ(null);
    setBonusAnswer(null);
    // Step 1: show solved
    setTiles([...SOLVED]);
    setShatterOffsets(
      Array.from({ length: 9 }, () => ({ x: 0, y: 0, rotate: 0 })),
    );
    setPhase("starting");

    // Step 2: shatter
    setTimeout(() => {
      setShatterOffsets(
        Array.from({ length: 9 }, (_, i) => {
          if (i === 8) return { x: 0, y: 0, rotate: 0 }; // empty cell
          return {
            x: (Math.random() - 0.5) * 180,
            y: (Math.random() - 0.5) * 180,
            rotate: (Math.random() - 0.5) * 60,
          };
        }),
      );
      setPhase("shattering");
    }, 800);

    // Step 3: snap to shuffled
    setTimeout(() => {
      setTiles(shuffle(lvl));
      setShatterOffsets(
        Array.from({ length: 9 }, () => ({ x: 0, y: 0, rotate: 0 })),
      );
      setPhase("scrambled");
    }, 1400);

    // Step 4: playing
    setTimeout(() => {
      setPhase("playing");
    }, 1800);
  }, []);

  const handleTileClick = useCallback(
    (idx: number) => {
      if (phase !== "playing") return;
      setTiles((prev) => {
        const emptyIdx = prev.indexOf(null);
        if (emptyIdx === -1) return prev;
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        const eRow = Math.floor(emptyIdx / 3);
        const eCol = emptyIdx % 3;
        const isAdj =
          (Math.abs(row - eRow) === 1 && col === eCol) ||
          (Math.abs(col - eCol) === 1 && row === eRow);
        if (!isAdj) return prev;
        const next = [...prev];
        [next[idx], next[emptyIdx]] = [next[emptyIdx], next[idx]];
        setMoves((m) => m + 1);
        if (isSolved(next)) {
          setPhase("levelComplete");
          const lvlScore = Math.max(0, 1000 - next.indexOf(null) * 5);
          setScore((s) => {
            const ns = s + lvlScore;
            if (ns > highScore) {
              setHighScore(ns);
              try {
                localStorage.setItem("puzzle_highscore", String(ns));
              } catch {
                /* ignore */
              }
            }
            return ns;
          });
          const q =
            MCQ_QUESTIONS[Math.floor(Math.random() * MCQ_QUESTIONS.length)];
          setBonusQ(q);
        }
        return next;
      });
    },
    [phase, highScore],
  );

  const handleBonusAnswer = (opt: string) => {
    if (!bonusQ) return;
    setBonusAnswer(opt);
    if (opt === bonusQ.answer) {
      setScore((s) => {
        const ns = s + 200;
        if (ns > highScore) {
          setHighScore(ns);
          try {
            localStorage.setItem("puzzle_highscore", String(ns));
          } catch {
            /* ignore */
          }
        }
        return ns;
      });
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.95)" }}
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="puzzle.modal"
    >
      <div
        className="w-full max-w-sm rounded-3xl p-5 flex flex-col gap-4 fade-in relative"
        style={{
          background: "rgba(10,10,10,0.99)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.90)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-black text-xl">🧩 Math Puzzle</h2>
            {phase !== "menu" && (
              <p className="text-white/40 text-xs">
                Level {level} · Score:{" "}
                <span style={{ color: "#FFD700" }}>{score}</span>
              </p>
            )}
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onClick={onClose}
            data-ocid="puzzle.close_button"
          >
            <X size={14} className="text-white/70" />
          </button>
        </div>

        {/* MENU */}
        {phase === "menu" && (
          <div className="flex flex-col items-center gap-5 py-4">
            <div
              className="text-center p-5 rounded-2xl"
              style={{
                background: "rgba(0,191,255,0.08)",
                border: "1px solid rgba(0,191,255,0.20)",
              }}
            >
              <p className="text-5xl mb-3">🧩</p>
              <p className="text-white/70 text-sm">
                Arrange tiles 1–8 in order.
              </p>
              <p className="text-white/50 text-xs mt-1">
                Tap tiles next to the empty space to slide them.
              </p>
            </div>

            <div
              className="w-full rounded-xl px-4 py-3 flex items-center justify-between"
              style={{
                background: "rgba(255,215,0,0.08)",
                border: "1px solid rgba(255,215,0,0.20)",
              }}
            >
              <span className="text-white/60 text-sm">🏆 High Score</span>
              <span className="text-yellow-400 font-black text-lg">
                {highScore}
              </span>
            </div>

            <button
              type="button"
              className="w-full rounded-2xl py-4 font-black text-lg text-black transition-all active:scale-95"
              style={{
                background: "linear-gradient(90deg, #00BFFF, #39FF14)",
                boxShadow: "0 0 30px rgba(0,191,255,0.40)",
              }}
              onClick={() => startLevel(1)}
              data-ocid="puzzle.primary_button"
            >
              Start Game 🚀
            </button>
          </div>
        )}

        {/* GAME BOARD */}
        {(phase === "starting" ||
          phase === "shattering" ||
          phase === "scrambled" ||
          phase === "playing") && (
          <>
            {/* Stats */}
            <div className="flex gap-3">
              <div
                className="flex-1 rounded-xl px-3 py-2 text-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-white/40 text-xs">Moves</p>
                <p className="text-white font-black">{moves}</p>
              </div>
              <div
                className="flex-1 rounded-xl px-3 py-2 text-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-white/40 text-xs">Time</p>
                <p className="text-white font-black">{formatTime(seconds)}</p>
              </div>
              <div
                className="flex-1 rounded-xl px-3 py-2 text-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-white/40 text-xs">Level</p>
                <p style={{ color: "#FFD700" }} className="font-black">
                  {level}
                </p>
              </div>
            </div>

            {/* Grid */}
            <div
              className="rounded-2xl p-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 6,
              }}
              data-ocid="puzzle.canvas_target"
            >
              {tiles.map((tile, idx) => {
                const offset = shatterOffsets[idx];
                const isShattered = phase === "shattering";
                const transform = isShattered
                  ? `translate(${offset.x}px, ${offset.y}px) rotate(${offset.rotate}deg)`
                  : "none";
                const transition =
                  phase === "shattering" || phase === "scrambled"
                    ? "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)"
                    : "transform 0.15s ease";

                if (tile === null) {
                  return (
                    <div
                      key="empty"
                      className="rounded-xl"
                      style={{
                        aspectRatio: "1",
                        border: "2px dashed rgba(255,255,255,0.15)",
                        background: "rgba(255,255,255,0.02)",
                      }}
                    />
                  );
                }

                return (
                  <button
                    type="button"
                    key={tile}
                    onClick={() => handleTileClick(idx)}
                    className="rounded-xl font-black text-2xl flex items-center justify-center transition-all active:scale-90"
                    style={{
                      aspectRatio: "1",
                      background: TILE_COLORS[tile],
                      boxShadow: `0 0 16px ${TILE_GLOWS[tile]}`,
                      color: "#fff",
                      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                      transform,
                      transition,
                      cursor: phase === "playing" ? "pointer" : "default",
                    }}
                    disabled={phase !== "playing"}
                    data-ocid={`puzzle.item.${tile}`}
                  >
                    {tile}
                  </button>
                );
              })}
            </div>

            {(phase === "starting" ||
              phase === "shattering" ||
              phase === "scrambled") && (
              <div className="text-center">
                <p
                  className="text-white/50 text-sm animate-pulse"
                  style={{ letterSpacing: 2 }}
                >
                  {phase === "starting"
                    ? "Get Ready..."
                    : phase === "shattering"
                      ? "💥 Shattering!"
                      : "Assembling..."}
                </p>
              </div>
            )}
          </>
        )}

        {/* LEVEL COMPLETE */}
        {phase === "levelComplete" && (
          <div className="flex flex-col items-center gap-4 py-2">
            <div
              className="text-center p-5 rounded-2xl w-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(57,255,20,0.12), rgba(0,191,255,0.12))",
                border: "1px solid rgba(57,255,20,0.30)",
              }}
            >
              <p className="text-4xl mb-2">🎉</p>
              <p className="text-white font-black text-xl">
                Level {level} Complete!
              </p>
              <p className="text-white/60 text-sm mt-1">
                {moves} moves · {formatTime(seconds)}
              </p>
              <p className="font-bold mt-2" style={{ color: "#FFD700" }}>
                Score: {score}
              </p>
            </div>

            {/* Bonus MCQ */}
            {bonusQ && (
              <div
                className="w-full rounded-2xl p-4"
                style={{
                  background: "rgba(255,215,0,0.07)",
                  border: "1px solid rgba(255,215,0,0.25)",
                }}
              >
                <p className="text-white/70 text-xs mb-2 font-bold uppercase tracking-wider">
                  🌟 Bonus Question +200pts
                </p>
                <p className="text-white font-bold mb-3">{bonusQ.q}</p>
                <div className="grid grid-cols-2 gap-2">
                  {bonusQ.options.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => handleBonusAnswer(opt)}
                      disabled={!!bonusAnswer}
                      className="rounded-xl py-2 px-3 text-sm font-bold transition-all active:scale-95"
                      style={{
                        background:
                          bonusAnswer === opt
                            ? opt === bonusQ.answer
                              ? "rgba(57,255,20,0.25)"
                              : "rgba(255,59,48,0.25)"
                            : bonusAnswer && opt === bonusQ.answer
                              ? "rgba(57,255,20,0.25)"
                              : "rgba(255,255,255,0.07)",
                        border:
                          bonusAnswer === opt
                            ? opt === bonusQ.answer
                              ? "1px solid rgba(57,255,20,0.5)"
                              : "1px solid rgba(255,59,48,0.5)"
                            : bonusAnswer && opt === bonusQ.answer
                              ? "1px solid rgba(57,255,20,0.5)"
                              : "1px solid rgba(255,255,255,0.12)",
                        color: "#fff",
                      }}
                      data-ocid="puzzle.button"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {bonusAnswer && (
                  <p
                    className="text-center text-sm mt-2"
                    style={{
                      color:
                        bonusAnswer === bonusQ.answer ? "#39FF14" : "#FF3B30",
                    }}
                  >
                    {bonusAnswer === bonusQ.answer
                      ? "✅ Correct! +200 pts"
                      : `❌ Answer: ${bonusQ.answer}`}
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              className="w-full rounded-2xl py-4 font-black text-lg text-black transition-all active:scale-95"
              style={{
                background: "linear-gradient(90deg, #A855F7, #00BFFF)",
                boxShadow: "0 0 30px rgba(168,85,247,0.40)",
              }}
              onClick={() => startLevel(level + 1)}
              data-ocid="puzzle.primary_button"
            >
              Next Level →
            </button>

            <button
              type="button"
              className="w-full rounded-2xl py-3 font-bold text-white/70 transition-all active:scale-95"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
              onClick={onClose}
              data-ocid="puzzle.cancel_button"
            >
              Exit Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
