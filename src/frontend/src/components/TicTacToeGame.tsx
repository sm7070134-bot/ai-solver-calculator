import { X } from "lucide-react";
import { useCallback, useState } from "react";

interface Props {
  onClose: () => void;
}

type Cell = null | "X" | "O";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board: Cell[]): [Cell, number[]] {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return [board[a], [a, b, c]];
  }
  return [null, []];
}

function aiMove(board: Cell[], diff: string): number {
  const empty = board
    .map((v, i) => (v === null ? i : -1))
    .filter((i) => i >= 0);
  if (diff === "easy") return empty[Math.floor(Math.random() * empty.length)];
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const vals = [board[a], board[b], board[c]];
    if (vals.filter((v) => v === "O").length === 2 && vals.includes(null))
      return line[vals.indexOf(null)];
  }
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const vals = [board[a], board[b], board[c]];
    if (vals.filter((v) => v === "X").length === 2 && vals.includes(null))
      return line[vals.indexOf(null)];
  }
  if (board[4] === null) return 4;
  return empty[Math.floor(Math.random() * empty.length)];
}

export function TicTacToeGame({ onClose }: Props) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [diff, setDiff] = useState<"easy" | "medium">("medium");
  const [status, setStatus] = useState<string>("Your turn (X)");
  const [winLine, setWinLine] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ player: 0, ai: 0, draw: 0 });

  const reset = useCallback(() => {
    setBoard(Array(9).fill(null));
    setStatus("Your turn (X)");
    setWinLine([]);
    setGameOver(false);
  }, []);

  const handleClick = useCallback(
    (idx: number) => {
      if (gameOver || board[idx]) return;
      const nb = [...board];
      nb[idx] = "X";
      const [w1, l1] = checkWinner(nb);
      if (w1 === "X") {
        setBoard(nb);
        setWinLine(l1);
        setStatus("You Win! 🎉");
        setGameOver(true);
        setScores((s) => ({ ...s, player: s.player + 1 }));
        return;
      }
      if (nb.every((v) => v !== null)) {
        setBoard(nb);
        setStatus("Draw! 🤝");
        setGameOver(true);
        setScores((s) => ({ ...s, draw: s.draw + 1 }));
        return;
      }
      setBoard(nb);
      setStatus("AI thinking...");
      setTimeout(() => {
        const ai = aiMove(nb, diff);
        if (ai === undefined) return;
        const nb2 = [...nb];
        nb2[ai] = "O";
        const [w2, l2] = checkWinner(nb2);
        if (w2 === "O") {
          setBoard(nb2);
          setWinLine(l2);
          setStatus("AI Wins! 🤖");
          setGameOver(true);
          setScores((s) => ({ ...s, ai: s.ai + 1 }));
          return;
        }
        if (nb2.every((v) => v !== null)) {
          setBoard(nb2);
          setStatus("Draw! 🤝");
          setGameOver(true);
          setScores((s) => ({ ...s, draw: s.draw + 1 }));
          return;
        }
        setBoard(nb2);
        setStatus("Your turn (X)");
      }, 400);
    },
    [board, gameOver, diff],
  );

  const cellBg = (i: number, v: Cell) => {
    if (winLine.includes(i))
      return v === "X" ? "rgba(57,255,20,0.25)" : "rgba(255,59,48,0.25)";
    return "rgba(255,255,255,0.05)";
  };
  const cellBorder = (i: number) =>
    winLine.includes(i) ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.08)";
  const cellColor = (v: Cell) => (v === "X" ? "#39FF14" : "#FF6B6B");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "#050510",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        <span style={{ color: "#00BFFF", fontWeight: 800, fontSize: 18 }}>
          ❌ Tic Tac Toe
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
          padding: 20,
          gap: 16,
        }}
      >
        <div style={{ display: "flex", gap: 20, marginBottom: 4 }}>
          {[
            { label: "You", val: scores.player, color: "#39FF14" },
            { label: "Draw", val: scores.draw, color: "#FFD700" },
            { label: "AI", val: scores.ai, color: "#FF6B6B" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ color: s.color, fontSize: 22, fontWeight: 800 }}>
                {s.val}
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["easy", "medium"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setDiff(d);
                reset();
              }}
              style={{
                padding: "6px 20px",
                borderRadius: 20,
                border: `1.5px solid ${diff === d ? "#A855F7" : "rgba(255,255,255,0.15)"}`,
                background: diff === d ? "rgba(168,85,247,0.2)" : "transparent",
                color: diff === d ? "#A855F7" : "rgba(255,255,255,0.5)",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {d}
            </button>
          ))}
        </div>
        <div
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            padding: "8px 24px",
            borderRadius: 20,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {status}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 8,
            width: "min(80vw,300px)",
          }}
        >
          {board.map((v, idx) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed game board
              key={`cell-${idx}`}
              type="button"
              onClick={() => handleClick(idx)}
              style={{
                aspectRatio: "1",
                borderRadius: 14,
                background: cellBg(idx, v),
                border: `2px solid ${cellBorder(idx)}`,
                cursor: v || gameOver ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                fontWeight: 900,
                color: v ? cellColor(v) : "transparent",
                transition: "all 0.15s",
                transform: winLine.includes(idx) ? "scale(1.05)" : "scale(1)",
              }}
            >
              {v || "·"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 8,
            padding: "12px 40px",
            borderRadius: 24,
            background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
            border: "none",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          New Game
        </button>
      </div>
    </div>
  );
}
