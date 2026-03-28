import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  onClose: () => void;
}

function shareScore(score: number) {
  const text = `I scored ${score} points in Math Runner on CALC AI Pro! 🏃🔢 Can you beat me?`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  if (navigator.share) {
    navigator
      .share({ title: "CALC AI Pro Score", text })
      .catch(() => window.open(whatsappUrl, "_blank"));
  } else {
    window.open(whatsappUrl, "_blank");
  }
}

interface FallingNum {
  id: number;
  lane: number;
  y: number;
  value: number;
  isCorrect: boolean;
}

function makeQuestion(level: number): { question: string; answer: number } {
  const max = Math.min(5 + level * 2, 20);
  const a = Math.floor(Math.random() * max) + 1;
  const b = Math.floor(Math.random() * max) + 1;
  const ops = ["+", "-"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  if (op === "+") return { question: `${a} + ? = ${a + b}`, answer: b };
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  return { question: `${big} - ? = ${big - small}`, answer: small };
}

const LANE_COLORS = ["#A855F7", "#00BFFF", "#39FF14"];
const LANE_COUNT = 3;

export function MathRunnerGame({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    lane: 1,
    score: 0,
    lives: 3,
    level: 1,
    correct: 0,
    question: makeQuestion(1),
    nums: [] as FallingNum[],
    nextId: 0,
    spawnTimer: 0,
    speed: 2,
    phase: "playing" as "playing" | "gameover",
    frameCount: 0,
  });
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLives, setDisplayLives] = useState(3);
  const [phase, setPhase] = useState<"playing" | "gameover">("playing");
  const rafRef = useRef<number>(0);
  const highScore = Number(
    localStorage.getItem("calc_game_mathrunner_highscore") || 0,
  );

  const moveLeft = useCallback(() => {
    stateRef.current.lane = Math.max(0, stateRef.current.lane - 1);
  }, []);
  const moveRight = useCallback(() => {
    stateRef.current.lane = Math.min(LANE_COUNT - 1, stateRef.current.lane + 1);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveLeft, moveRight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function loop() {
      const s = stateRef.current;
      if (s.phase === "gameover") return;
      const ctx = canvas!.getContext("2d");
      if (!ctx) return;

      const W = canvas!.width;
      const H = canvas!.height;
      const laneW = W / LANE_COUNT;
      const runnerY = H - 80;
      const runnerX = s.lane * laneW + laneW / 2;

      // Background
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      // Lane lines
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      for (let i = 1; i < LANE_COUNT; i++) {
        ctx.beginPath();
        ctx.setLineDash([12, 8]);
        ctx.moveTo(i * laneW, 60);
        ctx.lineTo(i * laneW, H);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Question
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 22px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(s.question.question, W / 2, 36);

      // HUD
      ctx.fillStyle = "rgba(255,255,255,0.50)";
      ctx.font = "14px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${s.score}`, 10, 54);
      ctx.textAlign = "right";
      ctx.fillText("❤️".repeat(s.lives), W - 10, 54);

      // Spawn
      s.spawnTimer++;
      const spawnInterval = Math.max(40, 80 - s.level * 4);
      if (s.spawnTimer >= spawnInterval) {
        s.spawnTimer = 0;
        const correctLane = Math.floor(Math.random() * LANE_COUNT);
        // Spawn correct answer in one lane
        s.nums.push({
          id: s.nextId++,
          lane: correctLane,
          y: 60,
          value: s.question.answer,
          isCorrect: true,
        });
        // Spawn decoys in other lanes
        const decoyLanes = [0, 1, 2].filter((l) => l !== correctLane);
        const decoyCount = Math.random() > 0.5 ? 1 : 2;
        for (const dl of decoyLanes.slice(0, decoyCount)) {
          const wrong = s.question.answer + Math.floor(Math.random() * 8) + 1;
          s.nums.push({
            id: s.nextId++,
            lane: dl,
            y: 60,
            value: wrong,
            isCorrect: false,
          });
        }
      }

      // Update and draw falling nums
      s.nums = s.nums.filter((n) => {
        n.y += s.speed;
        const nx = n.lane * laneW + laneW / 2;
        const radius = 24;

        // Collision
        const dist =
          Math.abs(n.y - runnerY) < 30 && Math.abs(nx - runnerX) < laneW / 2;
        if (dist) {
          if (n.isCorrect) {
            s.score += 10;
            s.correct++;
            if (s.correct % 5 === 0) {
              s.level++;
              s.speed = Math.min(s.speed + 0.5, 6);
            }
            s.question = makeQuestion(s.level);
            setDisplayScore(s.score);
            // Remove all nums
            s.nums = [];
            return false;
          }
          s.lives--;
          setDisplayLives(s.lives);
          if (s.lives <= 0) {
            s.phase = "gameover";
            setPhase("gameover");
            if (s.score > highScore)
              localStorage.setItem(
                "calc_game_mathrunner_highscore",
                String(s.score),
              );
          }
          return false;
        }

        if (n.y > H + radius) return false; // Off screen

        // Draw circle
        ctx.beginPath();
        ctx.arc(nx, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${LANE_COLORS[n.lane]}33`;
        ctx.fill();
        ctx.strokeStyle = LANE_COLORS[n.lane];
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(String(n.value), nx, n.y + 5);
        return true;
      });

      // Draw runner (rounded rect)
      const rw = 36;
      const rh = 46;
      const rx = runnerX - rw / 2;
      const ry = runnerY - rh / 2;
      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, rh, 8);
      ctx.fillStyle = LANE_COLORS[s.lane];
      ctx.shadowColor = LANE_COLORS[s.lane];
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#000";
      ctx.font = "bold 20px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("🏃", runnerX, runnerY + 6);

      s.frameCount++;
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [highScore]);

  const finalScore = stateRef.current.score;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#000" }}
      data-ocid="math_runner.modal"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🏃</span>
          <span className="text-white font-black">Math Runner</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)",
          }}
          data-ocid="math_runner.close_button"
        >
          ✕
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          width={360}
          height={480}
          style={{ width: "100%", height: "100%", display: "block" }}
          data-ocid="math_runner.canvas_target"
        />
        {phase === "gameover" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-5"
            style={{ background: "rgba(0,0,0,0.88)" }}
          >
            <span style={{ fontSize: 56 }}>💀</span>
            <h2 className="text-white font-black text-3xl">Game Over!</h2>
            <div
              className="rounded-2xl p-5 text-center"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <p className="text-white/40 text-sm">Score</p>
              <p className="font-black text-5xl" style={{ color: "#FF8C00" }}>
                {finalScore}
              </p>
              <p className="text-white/40 text-sm mt-1">
                Best: {Math.max(finalScore, highScore)}
              </p>
            </div>
            <div className="flex flex-col gap-3 w-64">
              <button
                type="button"
                className="rounded-2xl py-3 font-black text-black active:scale-95"
                style={{ background: "linear-gradient(90deg,#25D366,#128C7E)" }}
                onClick={() => shareScore(finalScore)}
                data-ocid="math_runner.secondary_button"
              >
                📤 Share on WhatsApp
              </button>
              <button
                type="button"
                className="rounded-2xl py-3 font-black active:scale-95"
                style={{
                  background: "linear-gradient(90deg,#FF8C00,#FF3B30)",
                  color: "#fff",
                }}
                onClick={() => {
                  const s = stateRef.current;
                  s.lane = 1;
                  s.score = 0;
                  s.lives = 3;
                  s.level = 1;
                  s.correct = 0;
                  s.question = makeQuestion(1);
                  s.nums = [];
                  s.nextId = 0;
                  s.spawnTimer = 0;
                  s.speed = 2;
                  s.phase = "playing";
                  s.frameCount = 0;
                  setDisplayScore(0);
                  setDisplayLives(3);
                  setPhase("playing");
                  rafRef.current = requestAnimationFrame(() => {});
                }}
                data-ocid="math_runner.primary_button"
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {phase === "playing" && (
        <div className="flex gap-3 p-3">
          <button
            type="button"
            className="flex-1 rounded-2xl py-4 font-black text-white text-xl active:scale-95 transition-all"
            style={{
              background: "rgba(168,85,247,0.25)",
              border: "1px solid rgba(168,85,247,0.40)",
            }}
            onClick={moveLeft}
            data-ocid="math_runner.secondary_button"
          >
            ◀ LEFT
          </button>
          <button
            type="button"
            className="flex-1 rounded-2xl py-4 font-black text-white text-xl active:scale-95 transition-all"
            style={{
              background: "rgba(0,191,255,0.25)",
              border: "1px solid rgba(0,191,255,0.40)",
            }}
            onClick={moveRight}
            data-ocid="math_runner.primary_button"
          >
            RIGHT ▶
          </button>
        </div>
      )}

      {/* Invisible score display for React reactivity */}
      <div className="hidden">
        {displayScore}
        {displayLives}
      </div>
    </div>
  );
}
