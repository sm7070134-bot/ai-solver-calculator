import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

interface Props {
  onClose: () => void;
}

export function EndlessRunnerGame({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const rafRef = useRef<number>(0);

  const getHighScore = () =>
    Number.parseInt(localStorage.getItem("hs_runner") || "0");
  const saveHighScore = (s: number) => {
    if (s > getHighScore()) localStorage.setItem("hs_runner", String(s));
  };

  const GROUND_H = 60;
  const CHAR_W = 20;
  const CHAR_H = 40;

  // biome-ignore lint/correctness/useExhaustiveDependencies: game fn
  const initState = useCallback((W: number, H: number) => {
    const gY = H - GROUND_H;
    return {
      W,
      H,
      gY,
      phase: "idle" as "idle" | "playing" | "dead",
      score: 0,
      best: getHighScore(),
      frameCount: 0,
      speed: 4,
      char: {
        x: 60,
        y: gY - CHAR_H,
        vy: 0,
        onGround: true,
        jumping: false,
        frame: 0,
      },
      obstacles: [] as any[],
      bgOffset: 0,
      clouds: [
        { x: 80, y: 40, w: 60 },
        { x: 220, y: 25, w: 80 },
        { x: 320, y: 50, w: 50 },
      ],
    };
  }, []);

  const drawStickman = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number,
    jumping: boolean,
  ) => {
    ctx.strokeStyle = "#00BFFF";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    // Head
    ctx.beginPath();
    ctx.arc(x + CHAR_W / 2, y + 8, 7, 0, Math.PI * 2);
    ctx.stroke();
    // Body
    ctx.beginPath();
    ctx.moveTo(x + CHAR_W / 2, y + 15);
    ctx.lineTo(x + CHAR_W / 2, y + 28);
    ctx.stroke();
    // Arms
    const armSwing = jumping ? -15 : Math.sin(frame * 0.3) * 8;
    ctx.beginPath();
    ctx.moveTo(x + CHAR_W / 2, y + 18);
    ctx.lineTo(x + CHAR_W / 2 - 10 + armSwing / 2, y + 26);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + CHAR_W / 2, y + 18);
    ctx.lineTo(x + CHAR_W / 2 + 10 - armSwing / 2, y + 26);
    ctx.stroke();
    // Legs
    if (jumping) {
      ctx.beginPath();
      ctx.moveTo(x + CHAR_W / 2, y + 28);
      ctx.lineTo(x + CHAR_W / 2 - 10, y + 38);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + CHAR_W / 2, y + 28);
      ctx.lineTo(x + CHAR_W / 2 + 10, y + 38);
      ctx.stroke();
    } else {
      const ls = Math.sin(frame * 0.3) * 10;
      ctx.beginPath();
      ctx.moveTo(x + CHAR_W / 2, y + 28);
      ctx.lineTo(x + CHAR_W / 2 - 8 + ls, y + CHAR_H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + CHAR_W / 2, y + 28);
      ctx.lineTo(x + CHAR_W / 2 + 8 - ls, y + CHAR_H);
      ctx.stroke();
    }
    // Glow
    ctx.shadowColor = "#00BFFF";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(x + CHAR_W / 2, y + 8, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: game fn
  const draw = useCallback((canvas: HTMLCanvasElement, st: any) => {
    const ctx = canvas.getContext("2d")!;
    const { W, H, gY } = st;
    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, gY);
    sky.addColorStop(0, "#050510");
    sky.addColorStop(1, "#0a0a25");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, gY);
    // Clouds
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    // biome-ignore lint/complexity/noForEach: game canvas
    st.clouds.forEach((c: any) => {
      ctx.beginPath();
      ctx.ellipse(
        (((c.x - st.bgOffset * 0.3) % (W + 100)) + (W + 100)) % (W + 100),
        c.y,
        c.w / 2,
        14,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    });
    // Ground
    const gGrad = ctx.createLinearGradient(0, gY, 0, H);
    gGrad.addColorStop(0, "#1a1a2e");
    gGrad.addColorStop(1, "#0d0d1a");
    ctx.fillStyle = gGrad;
    ctx.fillRect(0, gY, W, H - gY);
    ctx.strokeStyle = "#00BFFF";
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 10]);
    ctx.lineDashOffset = -st.bgOffset % 30;
    ctx.beginPath();
    ctx.moveTo(0, gY);
    ctx.lineTo(W, gY);
    ctx.stroke();
    ctx.setLineDash([]);
    // Obstacles
    // biome-ignore lint/complexity/noForEach: game canvas
    st.obstacles.forEach((o: any) => {
      const grad = ctx.createLinearGradient(o.x, o.y, o.x + o.w, o.y + o.h);
      grad.addColorStop(0, "#FF3B30");
      grad.addColorStop(1, "#c0392b");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect?.(o.x, o.y, o.w, o.h, 4);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,100,80,0.6)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    // Character
    drawStickman(ctx, st.char.x, st.char.y, st.char.frame, st.char.jumping);
    // HUD
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${Math.floor(st.score)}`, 10, 24);
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(`Best: ${st.best}`, W - 10, 24);

    if (st.phase === "idle") {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#00BFFF";
      ctx.font = "bold 26px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🏃 Endless Runner", W / 2, H / 2 - 28);
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.font = "16px sans-serif";
      ctx.fillText("Tap to jump!", W / 2, H / 2 + 10);
    }
    if (st.phase === "dead") {
      ctx.fillStyle = "rgba(0,0,0,0.78)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#FF3B30";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Game Over!", W / 2, H / 2 - 48);
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(`Score: ${Math.floor(st.score)}`, W / 2, H / 2 - 8);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "14px sans-serif";
      ctx.fillText(`Best: ${st.best}`, W / 2, H / 2 + 16);
      const bx = W / 2 - 60;
      const by = H / 2 + 36;
      const bw = 120;
      const bh = 40;
      ctx.fillStyle = "#00BFFF";
      ctx.beginPath();
      ctx.roundRect?.(bx, by, bw, bh, 10);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("▶ Restart", W / 2, by + 26);
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: game fn
  const update = useCallback((st: any) => {
    if (st.phase !== "playing") return;
    st.frameCount++;
    st.bgOffset += st.speed;
    st.score += 0.05;
    st.speed = Math.min(12, 4 + st.score * 0.008);
    // Jump physics
    if (!st.char.onGround) {
      st.char.vy += 0.7;
      st.char.y += st.char.vy;
      if (st.char.y >= st.gY - CHAR_H) {
        st.char.y = st.gY - CHAR_H;
        st.char.vy = 0;
        st.char.onGround = true;
        st.char.jumping = false;
      }
    } else {
      st.char.frame++;
    }
    // Spawn obstacles
    if (st.frameCount % Math.max(50, 90 - Math.floor(st.score)) === 0) {
      const h = 30 + Math.random() * 25;
      st.obstacles.push({
        x: st.W + 20,
        y: st.gY - h,
        w: 20 + Math.random() * 10,
        h,
      });
    }
    // Move obstacles
    st.obstacles = st.obstacles.filter((o: any) => o.x > -50);
    for (const o of st.obstacles) {
      o.x -= st.speed;
    }
    // Collision
    const c = st.char;
    for (const o of st.obstacles) {
      if (
        c.x + CHAR_W - 4 > o.x + 2 &&
        c.x + 4 < o.x + o.w - 2 &&
        c.y + CHAR_H - 4 > o.y + 2
      ) {
        st.phase = "dead";
        saveHighScore(Math.floor(st.score));
        st.best = Math.max(st.best, Math.floor(st.score));
        return;
      }
    }
  }, []);

  const handleJump = () => {
    const st = stateRef.current;
    if (!st) return;
    if (st.phase === "idle") {
      st.phase = "playing";
      return;
    }
    if (st.phase === "dead") {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      stateRef.current = initState(rect.width, rect.height);
      stateRef.current.phase = "playing";
      return;
    }
    if (st.char.onGround) {
      st.char.vy = -14;
      st.char.onGround = false;
      st.char.jumping = true;
      if (navigator.vibrate) navigator.vibrate(15);
    }
  };

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
          🏃 Endless Runner
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
        onClick={handleJump}
        onTouchStart={(e) => {
          e.preventDefault();
          handleJump();
        }}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          touchAction: "none",
          cursor: "pointer",
          display: "block",
        }}
      />
    </div>
  );
}
