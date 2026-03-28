import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

interface Props {
  onClose: () => void;
}

export function FlappyBirdGame({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const rafRef = useRef<number>(0);

  const getHighScore = () =>
    Number.parseInt(localStorage.getItem("hs_flappy") || "0");
  const saveHighScore = (s: number) => {
    if (s > getHighScore()) localStorage.setItem("hs_flappy", String(s));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop
  const initState = useCallback((canvas: HTMLCanvasElement) => {
    const W = canvas.width;
    const H = canvas.height;
    return {
      W,
      H,
      bird: { x: W * 0.25, y: H * 0.45, vy: 0, r: 14 },
      pipes: [] as any[],
      score: 0,
      best: getHighScore(),
      phase: "idle" as "idle" | "playing" | "dead",
      frameCount: 0,
      gravity: 0.45,
      jumpVel: -8,
      pipeW: 52,
      pipeGap: H * 0.28,
      pipeSpeed: 2.8,
      bgOffset: 0,
    };
  }, []);

  const spawnPipe = (st: any) => {
    const min = st.H * 0.18;
    const max = st.H * 0.55;
    const topH = min + Math.random() * (max - min);
    st.pipes.push({ x: st.W + 10, topH, passed: false });
  };

  const drawRoundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const drawBird = (ctx: CanvasRenderingContext2D, bird: any) => {
    // Body
    ctx.save();
    const grad = ctx.createRadialGradient(
      bird.x,
      bird.y,
      2,
      bird.x,
      bird.y,
      bird.r,
    );
    grad.addColorStop(0, "#FFD700");
    grad.addColorStop(1, "#FF8C00");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(bird.x + 5, bird.y - 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(bird.x + 6, bird.y - 4, 2, 0, Math.PI * 2);
    ctx.fill();
    // Beak
    ctx.fillStyle = "#FF4500";
    ctx.beginPath();
    ctx.moveTo(bird.x + bird.r - 2, bird.y);
    ctx.lineTo(bird.x + bird.r + 6, bird.y + 3);
    ctx.lineTo(bird.x + bird.r - 2, bird.y + 5);
    ctx.fill();
    // Wing
    ctx.fillStyle = "rgba(255,200,0,0.7)";
    ctx.beginPath();
    ctx.ellipse(bird.x - 2, bird.y + 5, 9, 5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawPipes = (ctx: CanvasRenderingContext2D, st: any) => {
    // biome-ignore lint/complexity/noForEach: game canvas loop
    st.pipes.forEach((p: any) => {
      const grd1 = ctx.createLinearGradient(p.x, 0, p.x + st.pipeW, 0);
      grd1.addColorStop(0, "#1a7a1a");
      grd1.addColorStop(0.5, "#2ecc2e");
      grd1.addColorStop(1, "#145c14");
      ctx.fillStyle = grd1;
      // Top pipe
      drawRoundRect(ctx, p.x, 0, st.pipeW, p.topH - 10, 6);
      ctx.fill();
      // Top cap
      ctx.fillStyle = "#39FF14";
      drawRoundRect(ctx, p.x - 4, p.topH - 22, st.pipeW + 8, 22, 6);
      ctx.fill();
      // Bottom pipe
      const botY = p.topH + st.pipeGap;
      ctx.fillStyle = grd1;
      drawRoundRect(ctx, p.x, botY + 10, st.pipeW, st.H - botY - 10, 6);
      ctx.fill();
      // Bottom cap
      ctx.fillStyle = "#39FF14";
      drawRoundRect(ctx, p.x - 4, botY, st.pipeW + 8, 22, 6);
      ctx.fill();
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop
  // biome-ignore lint/correctness/useExhaustiveDependencies: stable game fn
  const draw = useCallback((canvas: HTMLCanvasElement, st: any) => {
    const ctx = canvas.getContext("2d")!;
    const { W, H } = st;
    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0a0a1a");
    bg.addColorStop(1, "#0a1a0a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    // Stars
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (let i = 0; i < 30; i++) {
      const sx = (i * 73 + st.bgOffset * 0.1) % W;
      const sy = (i * 47) % (H * 0.7);
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }
    // Ground
    const gGrad = ctx.createLinearGradient(0, H - 40, 0, H);
    gGrad.addColorStop(0, "#2d4a1e");
    gGrad.addColorStop(1, "#1a2e10");
    ctx.fillStyle = gGrad;
    ctx.fillRect(0, H - 40, W, 40);
    ctx.fillStyle = "#39FF14";
    ctx.fillRect(0, H - 42, W, 4);

    drawPipes(ctx, st);
    drawBird(ctx, st.bird);

    // HUD
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.roundRect?.(W / 2 - 50, 14, 100, 34, 10);
    ctx.fill();
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 22px monospace";
    ctx.textAlign = "center";
    ctx.fillText(String(st.score), W / 2, 38);

    if (st.phase === "idle") {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🐦 Flappy Bird", W / 2, H / 2 - 30);
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.font = "18px sans-serif";
      ctx.fillText("Tap to Start!", W / 2, H / 2 + 10);
      ctx.fillStyle = "rgba(255,215,0,0.6)";
      ctx.font = "14px sans-serif";
      ctx.fillText(`Best: ${st.best}`, W / 2, H / 2 + 40);
    }

    if (st.phase === "dead") {
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#FF3B30";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Game Over!", W / 2, H / 2 - 50);
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(`Score: ${st.score}`, W / 2, H / 2 - 10);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "16px sans-serif";
      ctx.fillText(`Best: ${st.best}`, W / 2, H / 2 + 20);
      // Restart button
      const bx = W / 2 - 70;
      const by = H / 2 + 40;
      const bw = 140;
      const bh = 44;
      const btnGrad = ctx.createLinearGradient(bx, by, bx, by + bh);
      btnGrad.addColorStop(0, "#7c3aed");
      btnGrad.addColorStop(1, "#4c1d95");
      ctx.fillStyle = btnGrad;
      drawRoundRect(ctx, bx, by, bw, bh, 12);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("▶ Play Again", W / 2, by + 28);
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop
  const update = useCallback((st: any) => {
    if (st.phase !== "playing") return;
    st.frameCount++;
    st.bgOffset++;
    // Bird physics
    st.bird.vy += st.gravity;
    st.bird.y += st.bird.vy;
    // Spawn pipes
    if (st.frameCount % 80 === 0) spawnPipe(st);
    // Move pipes
    st.pipes = st.pipes.filter((p: any) => p.x > -st.pipeW - 10);
    // biome-ignore lint/complexity/noForEach: game canvas loop
    st.pipes.forEach((p: any) => {
      p.x -= st.pipeSpeed;
      if (!p.passed && p.x + st.pipeW < st.bird.x) {
        p.passed = true;
        st.score++;
        saveHighScore(st.score);
        st.best = Math.max(st.best, st.score);
      }
    });
    // Collision: ground / ceiling
    if (st.bird.y + st.bird.r >= st.H - 40 || st.bird.y - st.bird.r <= 0) {
      st.phase = "dead";
      return;
    }
    // Collision: pipes
    // biome-ignore lint/complexity/noForEach: game canvas loop
    st.pipes.forEach((p: any) => {
      if (
        st.bird.x + st.bird.r > p.x + 2 &&
        st.bird.x - st.bird.r < p.x + st.pipeW - 2
      ) {
        if (
          st.bird.y - st.bird.r < p.topH ||
          st.bird.y + st.bird.r > p.topH + st.pipeGap
        ) {
          st.phase = "dead";
          return;
        }
      }
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.getContext("2d")!.scale(dpr, dpr);
    stateRef.current = initState(canvas);
    // Fix logical size after scale
    stateRef.current.W = rect.width;
    stateRef.current.H = rect.height;
    stateRef.current.pipeGap = rect.height * 0.28;
    stateRef.current.bird = {
      x: rect.width * 0.25,
      y: rect.height * 0.45,
      vy: 0,
      r: 14,
    };

    const loop = () => {
      update(stateRef.current);
      draw(canvas, stateRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [initState, update, draw]);

  const handleTap = () => {
    const st = stateRef.current;
    if (!st) return;
    if (st.phase === "idle") {
      st.phase = "playing";
      st.bird.vy = st.jumpVel;
    } else if (st.phase === "playing") {
      st.bird.vy = st.jumpVel;
      if (navigator.vibrate) navigator.vibrate(20);
    } else if (st.phase === "dead") {
      const canvas = canvasRef.current!;
      stateRef.current = initState(canvas);
      const rect = canvas.getBoundingClientRect();
      stateRef.current.W = rect.width;
      stateRef.current.H = rect.height;
      stateRef.current.pipeGap = rect.height * 0.28;
      stateRef.current.bird = {
        x: rect.width * 0.25,
        y: rect.height * 0.45,
        vy: 0,
        r: 14,
      };
      stateRef.current.best = getHighScore();
      stateRef.current.phase = "playing";
    }
  };

  const handleCanvasTap = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const st = stateRef.current;
    if (st?.phase === "dead") {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2 + 40;
      if (x > cx - 70 && x < cx + 70 && y > cy && y < cy + 44) {
        handleTap();
        return;
      }
    }
    handleTap();
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
        <span style={{ color: "#FFD700", fontWeight: 800, fontSize: 18 }}>
          🐦 Flappy Bird
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
        onClick={handleCanvasTap}
        onTouchStart={(e) => {
          e.preventDefault();
          handleTap();
        }}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          cursor: "pointer",
          touchAction: "none",
          display: "block",
        }}
      />
    </div>
  );
}
