import { X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface Props {
  onClose: () => void;
}

type Phase = "waiting" | "ready" | "tapped" | "toosoon";

const COLORS = [
  "#7c3aed",
  "#0070c0",
  "#1a7a1a",
  "#c05000",
  "#8a0030",
  "#006060",
  "#4a4a00",
];
const READY_COLORS = ["#39FF14", "#00FF88", "#88FF00"];

function getLabel(ms: number) {
  if (ms < 200) return { text: "⚡ Incredible!", color: "#FFD700" };
  if (ms < 300) return { text: "🚀 Fast!", color: "#39FF14" };
  if (ms < 500) return { text: "👍 Average", color: "#00BFFF" };
  return { text: "🐢 Slow", color: "#FF8C00" };
}

export function TapReactionGame({ onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("waiting");
  const [bgColor, setBgColor] = useState("#1a1a2e");
  const [reaction, setReaction] = useState<number | null>(null);
  const [best, setBest] = useState(() =>
    Number.parseInt(localStorage.getItem("hs_reaction") || "9999"),
  );
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);

  const startWaiting = useCallback(() => {
    setPhase("waiting");
    setBgColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setReaction(null);
    const delay = 1500 + Math.random() * 3500;
    timerRef.current = setTimeout(() => {
      setPhase("ready");
      setBgColor(READY_COLORS[Math.floor(Math.random() * READY_COLORS.length)]);
      startTimeRef.current = Date.now();
    }, delay);
  }, []);

  const handleTap = useCallback(() => {
    if (phase === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase("toosoon");
      setBgColor("#8a0010");
      return;
    }
    if (phase === "ready") {
      const ms = Date.now() - startTimeRef.current;
      setReaction(ms);
      setPhase("tapped");
      setBgColor("#0a0a20");
      const newScores = [...scores, ms];
      setScores(newScores);
      setRound((r) => r + 1);
      const newBest = Math.min(best, ms);
      setBest(newBest);
      if (
        ms <
        (Number.parseInt(localStorage.getItem("hs_reaction") || "9999") || 9999)
      ) {
        localStorage.setItem("hs_reaction", String(ms));
      }
      if (navigator.vibrate) navigator.vibrate(20);
    }
  }, [phase, best, scores]);

  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: game tap
    <div
      onClick={handleTap}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: bgColor,
        display: "flex",
        flexDirection: "column",
        transition: "background 0.3s",
        userSelect: "none",
        cursor: "pointer",
      }}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: header stop */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
          background: "rgba(0,0,0,0.4)",
        }}
      >
        <span style={{ color: "#FFD700", fontWeight: 800, fontSize: 18 }}>
          ⚡ Tap Reaction
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          padding: 24,
        }}
      >
        {phase === "waiting" && (
          <>
            <div style={{ fontSize: 64, lineHeight: 1 }}>⏳</div>
            <div
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 24,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Wait for green...
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
              Don't tap yet!
            </div>
          </>
        )}
        {phase === "ready" && (
          <>
            <div style={{ fontSize: 80, lineHeight: 1 }}>🟢</div>
            <div
              style={{
                color: "#000",
                fontSize: 30,
                fontWeight: 900,
                textAlign: "center",
              }}
            >
              TAP NOW!
            </div>
          </>
        )}
        {phase === "toosoon" && (
          <>
            <div style={{ fontSize: 64, lineHeight: 1 }}>❌</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>
              Too soon!
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startWaiting();
              }}
              style={{
                padding: "12px 36px",
                borderRadius: 24,
                background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
                border: "none",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </>
        )}
        {phase === "tapped" && reaction !== null && (
          <>
            <div
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: getLabel(reaction).color,
              }}
            >
              {reaction} ms
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: getLabel(reaction).color,
              }}
            >
              {getLabel(reaction).text}
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              {best < 9999 && (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{ color: "#FFD700", fontWeight: 800, fontSize: 20 }}
                  >
                    {best}ms
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                    Best
                  </div>
                </div>
              )}
              {avgScore !== null && (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{ color: "#00BFFF", fontWeight: 800, fontSize: 20 }}
                  >
                    {avgScore}ms
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                    Avg ({round})
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startWaiting();
              }}
              style={{
                padding: "14px 48px",
                borderRadius: 28,
                background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
                border: "none",
                color: "#fff",
                fontWeight: 800,
                fontSize: 17,
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(124,58,237,0.5)",
              }}
            >
              Try Again
            </button>
          </>
        )}
        {phase === "waiting" && round === 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              startWaiting();
            }}
            style={{
              marginTop: 20,
              padding: "14px 48px",
              borderRadius: 28,
              background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
              border: "none",
              color: "#fff",
              fontWeight: 800,
              fontSize: 17,
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(124,58,237,0.5)",
            }}
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
}
