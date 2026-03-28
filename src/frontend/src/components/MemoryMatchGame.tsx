import { useEffect, useState } from "react";

interface Props {
  onClose: () => void;
}

function shareScore(moves: number, level: number) {
  const text = `I completed Memory Match Level ${level} in ${moves} moves on CALC AI Pro! 🧠🎮 Can you beat me?`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  if (navigator.share) {
    navigator
      .share({ title: "CALC AI Pro Score", text })
      .catch(() => window.open(whatsappUrl, "_blank"));
  } else {
    window.open(whatsappUrl, "_blank");
  }
}

interface Card {
  id: number;
  front: string;
  pairId: number;
  flipped: boolean;
  matched: boolean;
}

const BASE_PAIRS: Array<[string, string]> = [
  ["6 × 2", "12"],
  ["3 + 5", "8"],
  ["10 - 4", "6"],
  ["9 × 3", "27"],
  ["15 ÷ 3", "5"],
  ["7 + 8", "15"],
  ["4 × 4", "16"],
  ["20 - 7", "13"],
  ["5 × 6", "30"],
  ["18 ÷ 2", "9"],
  ["11 + 9", "20"],
  ["25 - 8", "17"],
];

function buildCards(pairsCount: number): Card[] {
  const pairs = BASE_PAIRS.slice(0, pairsCount);
  const cards: Card[] = [];
  pairs.forEach(([eq, ans], i) => {
    cards.push({
      id: i * 2,
      front: eq,
      pairId: i,
      flipped: false,
      matched: false,
    });
    cards.push({
      id: i * 2 + 1,
      front: ans,
      pairId: i,
      flipped: false,
      matched: false,
    });
  });
  return cards.sort(() => Math.random() - 0.5);
}

export function MemoryMatchGame({ onClose }: Props) {
  const [level, setLevel] = useState(1);
  const [moves, setMoves] = useState(0);
  const [cards, setCards] = useState(() => buildCards(4));
  const [selected, setSelected] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [phase, setPhase] = useState<"playing" | "levelcomplete" | "gameover">(
    "playing",
  );
  const [totalMoves, setTotalMoves] = useState(0);

  const pairCount = level === 1 ? 4 : level === 2 ? 6 : 8;

  useEffect(() => {
    setCards(buildCards(pairCount));
    setSelected([]);
    setMoves(0);
    setLocked(false);
  }, [pairCount]);

  function handleCardClick(id: number) {
    if (locked) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (selected.length === 1 && selected[0] === id) return;

    const newSelected = [...selected, id];
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)),
    );

    if (newSelected.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [a, b] = newSelected.map((sid) => cards.find((c) => c.id === sid)!);
      if (a.pairId === b.pairId) {
        setCards((prev) =>
          prev.map((c) =>
            newSelected.includes(c.id)
              ? { ...c, matched: true, flipped: true }
              : c,
          ),
        );
        setSelected([]);
        setLocked(false);
        // Check if all matched
        setTimeout(() => {
          setCards((prev) => {
            const allDone = prev.every(
              (c) => c.matched || newSelected.includes(c.id),
            );
            if (allDone) {
              setTotalMoves((tm) => tm + moves + 1);
              if (level >= 3) setPhase("gameover");
              else setPhase("levelcomplete");
            }
            return prev.map((c) =>
              newSelected.includes(c.id) ? { ...c, matched: true } : c,
            );
          });
        }, 300);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.id) ? { ...c, flipped: false } : c,
            ),
          );
          setSelected([]);
          setLocked(false);
        }, 900);
      }
    } else {
      setSelected(newSelected);
    }
  }

  const cols = pairCount <= 4 ? 4 : pairCount <= 6 ? 4 : 4;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(0,0,0,0.97)" }}
      data-ocid="memory_match.modal"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          <span className="text-white font-black text-lg">Memory Match</span>
          <span className="text-white/40 text-sm">Lv {level}/3</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)",
          }}
          data-ocid="memory_match.close_button"
        >
          ✕
        </button>
      </div>

      {(phase === "playing" || phase === "levelcomplete") && (
        <div className="flex-1 flex flex-col items-center gap-4 p-4 overflow-auto">
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-white/40 text-xs uppercase">Moves</p>
              <p className="font-black text-2xl" style={{ color: "#00BFFF" }}>
                {moves}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/40 text-xs uppercase">Level</p>
              <p className="font-black text-2xl" style={{ color: "#A855F7" }}>
                {level}
              </p>
            </div>
          </div>

          <div
            className="grid gap-2 w-full max-w-xs"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {cards.map((card) => (
              <button
                key={card.id}
                type="button"
                style={{
                  perspective: 600,
                  height: 70,
                  display: "block",
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick(card.id)}
                data-ocid={`memory_match.item.${card.id + 1}`}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.4s",
                    transform:
                      card.flipped || card.matched
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                    cursor: card.matched ? "default" : "pointer",
                  }}
                >
                  {/* Back */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    🂠
                  </div>
                  {/* Front */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background: card.matched
                        ? "rgba(57,255,20,0.18)"
                        : "rgba(0,191,255,0.15)",
                      border: `1px solid ${card.matched ? "rgba(57,255,20,0.50)" : "rgba(0,191,255,0.40)"}`,
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: 12,
                      textAlign: "center",
                      padding: 4,
                    }}
                  >
                    {card.front}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {phase === "levelcomplete" && (
            <div className="flex flex-col items-center gap-3 mt-2">
              <p className="text-white font-black text-xl">
                🎉 Level {level} Complete!
              </p>
              <button
                type="button"
                className="rounded-2xl px-8 py-3 font-black text-white active:scale-95 transition-all"
                style={{
                  background: "linear-gradient(90deg,#A855F7,#00BFFF)",
                  boxShadow: "0 0 20px rgba(168,85,247,0.40)",
                }}
                onClick={() => {
                  setLevel((l) => l + 1);
                  setPhase("playing");
                }}
                data-ocid="memory_match.primary_button"
              >
                Next Level ▶
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "gameover" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 text-center">
          <span style={{ fontSize: 64 }}>🏆</span>
          <h2 className="text-white font-black text-3xl">All Done!</h2>
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <p className="text-white/50 text-sm">Total Moves</p>
            <p className="font-black text-5xl" style={{ color: "#00BFFF" }}>
              {totalMoves + moves}
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              type="button"
              className="rounded-2xl py-4 font-black text-black text-lg active:scale-95"
              style={{
                background: "linear-gradient(90deg,#25D366,#128C7E)",
                boxShadow: "0 0 20px rgba(37,211,102,0.40)",
              }}
              onClick={() => shareScore(totalMoves + moves, 3)}
              data-ocid="memory_match.secondary_button"
            >
              📤 Share on WhatsApp
            </button>
            <button
              type="button"
              className="rounded-2xl py-4 font-black text-white text-lg active:scale-95"
              style={{
                background: "linear-gradient(90deg,#00BFFF,#A855F7)",
                color: "#000",
              }}
              onClick={() => {
                setLevel(1);
                setMoves(0);
                setTotalMoves(0);
                setPhase("playing");
              }}
              data-ocid="memory_match.primary_button"
            >
              🔄 Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
