import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

interface Props {
  onClose: () => void;
}

export function BrickBreakerGame({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const _touchXRef = useRef<number | null>(null);

  const getHighScore = () =>
    Number.parseInt(localStorage.getItem("hs_brick") || "0");
  const saveHighScore = (s: number) => {
    if (s > getHighScore()) localStorage.setItem("hs_brick", String(s));
  };

  const BRICK_ROWS = 5;
  const BRICK_COLS = 7;
  const BRICK_GAP = 5;
  const PADDLE_H = 12;
  const BALL_R = 8;
  const COLORS = [
    "#FF3B30",
    "#FF8C00",
    "#FFD700",
    "#39FF14",
    "#00BFFF",
    "#A855F7",
    "#FF6B9D",
  ];

  const makeBricks = (W: number) => {
    const bw = (W - BRICK_GAP * (BRICK_COLS + 1)) / BRICK_COLS;
    const bh = 20;
    const bricks: {
      x: number;
      y: number;
      w: number;
      h: number;
      alive: boolean;
      color: string;
    }[] = [];
    for (let r = 0; r < BRICK_ROWS; r++)
      for (let c = 0; c < BRICK_COLS; c++)
        bricks.push({
          x: BRICK_GAP + c * (bw + BRICK_GAP),
          y: 60 + r * (bh + BRICK_GAP),
          w: bw,
          h: bh,
          alive: true,
          color: COLORS[r % COLORS.length],
        });
    return bricks;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: game fn
  const initState = useCallback((W: number, H: number) => {
    return {
      W,
      H,
      phase: "idle" as "idle" | "playing" | "dead" | "win",
      score: 0,
      best: getHighScore(),
      paddle: { x: W / 2 - 50, w: 100, y: H - 40, targetX: W / 2 - 50 },
      ball: { x: W / 2, y: H - 70, vx: 3.5, vy: -4 },
      bricks: makeBricks(W),
    };
  }, []);

  const draw = useCallback((canvas: HTMLCanvasElement, st: any) => {
    const ctx = canvas.getContext("2d")!;
    const { W, H } = st;
    ctx.fillStyle = "#040410";
    ctx.fillRect(0, 0, W, H);
    // Bricks
    // biome-ignore lint/complexity/noForEach: game canvas
    st.bricks.forEach((b: any) => {
      if (!b.alive) return;
      const grad = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
      grad.addColorStop(0, `${b.color}ee`);
      grad.addColorStop(1, `${b.color}88`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect?.(b.x, b.y, b.w, b.h, 4);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.beginPath();
      ctx.roundRect?.(b.x + 3, b.y + 2, b.w - 6, 5, 2);
      ctx.fill();
    });
    // Paddle
    const pg = ctx.createLinearGradient(
      st.paddle.x,
      st.paddle.y,
      st.paddle.x + st.paddle.w,
      st.paddle.y + PADDLE_H,
    );
    pg.addColorStop(0, "#00BFFF");
    pg.addColorStop(1, "#0070c0");
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.roundRect?.(st.paddle.x, st.paddle.y, st.paddle.w, PADDLE_H, 6);
    ctx.fill();
    ctx.shadowColor = "#00BFFF";
    ctx.shadowBlur = 14;
    ctx.strokeStyle = "rgba(0,191,255,0.8)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.shadowBlur = 0;
    // Ball
    const bg = ctx.createRadialGradient(
      st.ball.x - 2,
      st.ball.y - 2,
      1,
      st.ball.x,
      st.ball.y,
      BALL_R,
    );
    bg.addColorStop(0, "#fff");
    bg.addColorStop(1, "#00BFFF");
    ctx.fillStyle = bg;
    ctx.shadowColor = "#00BFFF";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(st.ball.x, st.ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // HUD
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${st.score}`, 10, 22);
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(`Best: ${st.best}`, W - 10, 22);

    if (st.phase === "idle") {
      ctx.fillStyle = "rgba(0,0,0,0.72)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#00BFFF";
      ctx.font = "bold 26px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🧱 Brick Breaker", W / 2, H / 2 - 28);
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.font = "16px sans-serif";
      ctx.fillText("Tap to start!", W / 2, H / 2 + 10);
    }
    if (st.phase === "dead" || st.phase === "win") {
      ctx.fillStyle = "rgba(0,0,0,0.78)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = st.phase === "win" ? "#39FF14" : "#FF3B30";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        st.phase === "win" ? "You Win! 🎉" : "Game Over!",
        W / 2,
        H / 2 - 48,
      );
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`Score: ${st.score}`, W / 2, H / 2 - 8);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "14px sans-serif";
      ctx.fillText(`Best: ${st.best}`, W / 2, H / 2 + 16);
      const bx = W / 2 - 60;
      const by = H / 2 + 36;
      ctx.fillStyle = "#00BFFF";
      ctx.beginPath();
      ctx.roundRect?.(bx, by, 120, 40, 10);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("▶ Play Again", W / 2, by + 26);
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: game fn
  const update = useCallback((st: any) => {
    if (st.phase !== "playing") return;
    // Paddle smooth follow
    st.paddle.x += (st.paddle.targetX - st.paddle.x) * 0.25;
    if (st.paddle.x < 0) st.paddle.x = 0;
    if (st.paddle.x + st.paddle.w > st.W) st.paddle.x = st.W - st.paddle.w;
    // Ball move
    st.ball.x += st.ball.vx;
    st.ball.y += st.ball.vy;
    // Wall bounce
    if (st.ball.x - BALL_R < 0) {
      st.ball.x = BALL_R;
      st.ball.vx *= -1;
    }
    if (st.ball.x + BALL_R > st.W) {
      st.ball.x = st.W - BALL_R;
      st.ball.vx *= -1;
    }
    if (st.ball.y - BALL_R < 0) {
      st.ball.y = BALL_R;
      st.ball.vy *= -1;
    }
    // Ball off bottom
    if (st.ball.y + BALL_R > st.H) {
      st.phase = "dead";
      saveHighScore(st.score);
      return;
    }
    // Paddle collision
    if (
      st.ball.y + BALL_R >= st.paddle.y &&
      st.ball.y + BALL_R <= st.paddle.y + PADDLE_H + 4 &&
      st.ball.x >= st.paddle.x - 4 &&
      st.ball.x <= st.paddle.x + st.paddle.w + 4 &&
      st.ball.vy > 0
    ) {
      const rel =
        (st.ball.x - (st.paddle.x + st.paddle.w / 2)) / (st.paddle.w / 2);
      st.ball.vx = rel * 6;
      st.ball.vy = -Math.abs(st.ball.vy);
      if (navigator.vibrate) navigator.vibrate(10);
    }
    // Brick collision
    let allDead = true;
    for (const b of st.bricks) {
      if (!b.alive) continue;
      allDead = false;
      if (
        st.ball.x + BALL_R > b.x &&
        st.ball.x - BALL_R < b.x + b.w &&
        st.ball.y + BALL_R > b.y &&
        st.ball.y - BALL_R < b.y + b.h
      ) {
        b.alive = false;
        st.score += 10;
        st.best = Math.max(st.best, st.score);
        const fromLeft = st.ball.x < b.x || st.ball.x > b.x + b.w;
        if (fromLeft) st.ball.vx *= -1;
        else st.ball.vy *= -1;
        break;
      }
    }
    if (allDead) {
      st.phase = "win";
      saveHighScore(st.score);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.getContext("2d")!.scale(dpr, dpr);
    stateRef.current = initState(rect.width, rect.height);

    const loop = () => {
      update(stateRef.current);
      draw(canvas, stateRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [initState, update, draw]);

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const st = stateRef.current;
    if (!st) return;
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const tx = e.touches[0].clientX - rect.left;
    st.paddle.targetX = tx - st.paddle.w / 2;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    const st = stateRef.current;
    if (!st || st.phase !== "playing") return;
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    st.paddle.targetX = e.clientX - rect.left - st.paddle.w / 2;
  };
  const handleClick = (e: React.MouseEvent) => {
    const st = stateRef.current;
    if (!st) return;
    if (st.phase === "idle") {
      st.phase = "playing";
      return;
    }
    if (st.phase === "dead" || st.phase === "win") {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (
        x > rect.width / 2 - 60 &&
        x < rect.width / 2 + 60 &&
        y > rect.height / 2 + 36 &&
        y < rect.height / 2 + 76
      ) {
        stateRef.current = initState(rect.width, rect.height);
        stateRef.current.phase = "playing";
      }
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "#000",
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
          🧱 Brick Breaker
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
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: game canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchStart={(e) => {
          const st = stateRef.current;
          if (st?.phase === "idle") {
            e.preventDefault();
            st.phase = "playing";
          }
        }}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          touchAction: "none",
          cursor: "none",
          display: "block",
        }}
      />
    </div>
  );
}
