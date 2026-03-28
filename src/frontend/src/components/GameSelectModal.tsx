import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  onDailyChallenge: () => void;
  onMathPuzzle: () => void;
  onSpeedMath: () => void;
  onMemoryMatch: () => void;
  onEquationBuilder: () => void;
  onMathRunner: () => void;
  onFlappyBird: () => void;
  onSnake: () => void;
  onStackTower: () => void;
  onTicTacToe: () => void;
  onEndlessRunner: () => void;
  onBrickBreaker: () => void;
  onTapReaction: () => void;
}

const GAMES = [
  {
    id: "daily",
    emoji: "🎮",
    title: "Daily Challenge",
    gradient:
      "linear-gradient(135deg, rgba(168,85,247,0.30) 0%, rgba(255,101,132,0.30) 100%)",
    border: "rgba(168,85,247,0.50)",
    glow: "rgba(168,85,247,0.40)",
  },
  {
    id: "puzzle",
    emoji: "🧩",
    title: "Math Puzzle",
    gradient:
      "linear-gradient(135deg, rgba(0,191,255,0.30) 0%, rgba(57,255,20,0.25) 100%)",
    border: "rgba(0,191,255,0.50)",
    glow: "rgba(0,191,255,0.40)",
  },
  {
    id: "speed",
    emoji: "⚡",
    title: "Speed Math",
    gradient:
      "linear-gradient(135deg, rgba(255,215,0,0.30) 0%, rgba(255,140,0,0.30) 100%)",
    border: "rgba(255,215,0,0.50)",
    glow: "rgba(255,215,0,0.40)",
  },
  {
    id: "memory",
    emoji: "🧠",
    title: "Memory Match",
    gradient:
      "linear-gradient(135deg, rgba(0,191,255,0.30) 0%, rgba(168,85,247,0.30) 100%)",
    border: "rgba(100,180,255,0.50)",
    glow: "rgba(100,180,255,0.40)",
  },
  {
    id: "equation",
    emoji: "🔢",
    title: "Equation Builder",
    gradient:
      "linear-gradient(135deg, rgba(57,255,20,0.30) 0%, rgba(0,191,255,0.30) 100%)",
    border: "rgba(57,255,20,0.50)",
    glow: "rgba(57,255,20,0.40)",
  },
  {
    id: "runner",
    emoji: "🏃‍♂️",
    title: "Math Runner",
    gradient:
      "linear-gradient(135deg, rgba(255,140,0,0.30) 0%, rgba(255,59,48,0.30) 100%)",
    border: "rgba(255,140,0,0.50)",
    glow: "rgba(255,140,0,0.40)",
  },
  {
    id: "flappy",
    emoji: "🐦",
    title: "Flappy Bird",
    gradient:
      "linear-gradient(135deg, rgba(255,215,0,0.30) 0%, rgba(57,255,20,0.25) 100%)",
    border: "rgba(255,215,0,0.50)",
    glow: "rgba(255,215,0,0.40)",
  },
  {
    id: "snake",
    emoji: "🐍",
    title: "Snake",
    gradient:
      "linear-gradient(135deg, rgba(57,255,20,0.30) 0%, rgba(0,100,0,0.30) 100%)",
    border: "rgba(57,255,20,0.50)",
    glow: "rgba(57,255,20,0.40)",
  },
  {
    id: "stack",
    emoji: "🗼",
    title: "Stack Tower",
    gradient:
      "linear-gradient(135deg, rgba(168,85,247,0.30) 0%, rgba(0,191,255,0.30) 100%)",
    border: "rgba(168,85,247,0.50)",
    glow: "rgba(168,85,247,0.40)",
  },
  {
    id: "tictactoe",
    emoji: "❌",
    title: "Tic Tac Toe",
    gradient:
      "linear-gradient(135deg, rgba(0,191,255,0.30) 0%, rgba(168,85,247,0.30) 100%)",
    border: "rgba(0,191,255,0.50)",
    glow: "rgba(0,191,255,0.40)",
  },
  {
    id: "endless",
    emoji: "🏃",
    title: "Endless Runner",
    gradient:
      "linear-gradient(135deg, rgba(0,191,255,0.30) 0%, rgba(57,255,20,0.25) 100%)",
    border: "rgba(0,191,255,0.50)",
    glow: "rgba(0,191,255,0.40)",
  },
  {
    id: "brick",
    emoji: "🧱",
    title: "Brick Breaker",
    gradient:
      "linear-gradient(135deg, rgba(255,59,48,0.30) 0%, rgba(255,140,0,0.30) 100%)",
    border: "rgba(255,100,80,0.50)",
    glow: "rgba(255,100,80,0.40)",
  },
  {
    id: "reaction",
    emoji: "⚡",
    title: "Tap Reaction",
    gradient:
      "linear-gradient(135deg, rgba(255,215,0,0.30) 0%, rgba(168,85,247,0.30) 100%)",
    border: "rgba(255,215,0,0.50)",
    glow: "rgba(255,215,0,0.40)",
  },
];

export function GameSelectModal({
  onClose,
  onDailyChallenge,
  onMathPuzzle,
  onSpeedMath,
  onMemoryMatch,
  onEquationBuilder,
  onMathRunner,
  onFlappyBird,
  onSnake,
  onStackTower,
  onTicTacToe,
  onEndlessRunner,
  onBrickBreaker,
  onTapReaction,
}: Props) {
  const handlers = [
    onDailyChallenge,
    onMathPuzzle,
    onSpeedMath,
    onMemoryMatch,
    onEquationBuilder,
    onMathRunner,
    onFlappyBird,
    onSnake,
    onStackTower,
    onTicTacToe,
    onEndlessRunner,
    onBrickBreaker,
    onTapReaction,
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(8,8,12,0.99)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      data-ocid="game_select.modal"
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 20, margin: 0 }}>
          🎮 Game Hub
        </h2>
        <button
          type="button"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.7)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
          onClick={onClose}
          data-ocid="game_select.close_button"
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable 2-column grid */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: "20px",
        }}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          {GAMES.map((game, i) => (
            <button
              key={game.id}
              type="button"
              style={{
                borderRadius: 16,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                background: game.gradient,
                border: `1px solid ${game.border}`,
                boxShadow: `0 0 18px ${game.glow}`,
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onClick={() => handlers[i]?.()}
              data-ocid="game_select.game_card"
            >
              <span style={{ fontSize: 38, lineHeight: 1 }}>{game.emoji}</span>
              <span
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: 13,
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                {game.title}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 12px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                }}
              >
                ▶ Play
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
