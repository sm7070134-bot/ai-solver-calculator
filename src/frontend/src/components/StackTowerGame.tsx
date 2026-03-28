import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

interface Props {
  onClose: () => void;
}

export function StackTowerGame({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const rafRef = useRef<number>(0);

  const getHighScore = () =>
    Number.parseInt(localStorage.getItem("hs_stack") || "0");
  const saveHighScore = (s: number) => {
    if (s > getHighScore()) localStorage.setItem("hs_stack", String(s));
  };

  const BLOCK_H = 28;
  const COLORS = [
    "#00BFFF",
    "#A855F7",
    "#39FF14",
    "#FFD700",
    "#FF8C00",
    "#FF6B9D",
    "#00E5FF",
    "#B388FF",
  ];

  // biome-ignore lint/correctness/useExhaustiveDependencies: stable game fn
  const initState = useCallback((W: number, H: number) => {
    return {
      W,
      H,
      phase: "idle" as "idle" | "playing" | "dead",
      score: 0,
      best: getHighScore(),
      tower: [{ x: W / 2 - 70, w: 140, y: H - 60, color: "#888" }],
      moving: { x: 0, w: 140, dir: 1, speed: 3, color: COLORS[0] },
      colorIdx: 1,
      cameraY: 0,
    };
  }, []);

  const draw = useCallback((canvas: HTMLCanvasElement, st: any) => {
    const ctx = canvas.getContext("2d")!;
    const { W, H } = st;
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#060612");
    bg.addColorStop(1, "#0a0a20");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const offsetY = st.cameraY;

    // Draw tower blocks
    // biome-ignore lint/complexity/noForEach: game canvas
    st.tower.forEach((b: any) => {
      const gy = b.y - offsetY;
      if (gy > H + BLOCK_H || gy < -BLOCK_H) return;
      const grad = ctx.createLinearGradient(b.x, gy, b.x + b.w, gy + BLOCK_H);
      grad.addColorStop(0, b.color);
      grad.addColorStop(1, `${b.color}88`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect?.(b.x, gy, b.w, BLOCK_H - 2, 6);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Top shine
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.beginPath();
      ctx.roundRect?.(b.x + 4, gy + 3, b.w - 8, 6, 3);
      ctx.fill();
    });

    // Moving block
    if (st.phase === "playing") {
      const my = st.tower[st.tower.length - 1].y - BLOCK_H - offsetY;
      const grad = ctx.createLinearGradient(
        st.moving.x,
        my,
        st.moving.x + st.moving.w,
        my + BLOCK_H,
      );
      grad.addColorStop(0, st.moving.color);
      grad.addColorStop(1, `${st.moving.color}aa`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect?.(st.moving.x, my, st.moving.w, BLOCK_H - 2, 6);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Glow
      ctx.shadowColor = st.moving.color;
      ctx.shadowBlur = 18;
      ctx.strokeStyle = st.moving.color;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // HUD
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.roundRect?.(W / 2 - 55, 12, 110, 34, 10);
    ctx.fill();
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.fillText(String(st.score), W / 2, 36);

    if (st.phase === "idle") {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#A855F7";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🗼 Stack Tower", W / 2, H / 2 - 30);
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.font = "17px sans-serif";
      ctx.fillText("Tap to stack!", W / 2, H / 2 + 10);
      ctx.fillStyle = "rgba(255,215,0,0.6)";
      ctx.font = "14px sans-serif";
      ctx.fillText(`Best: ${st.best}`, W / 2, H / 2 + 40);
    }
    if (st.phase === "dead") {
      ctx.fillStyle = "rgba(0,0,0,0.78)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#FF3B30";
      ctx.font = "bold 30px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Game Over!", W / 2, H / 2 - 50);
      ctx.fillStyle = "#A855F7";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(`Score: ${st.score}`, W / 2, H / 2 - 10);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "15px sans-serif";
      ctx.fillText(`Best: ${st.best}`, W / 2, H / 2 + 16);
      const bx = W / 2 - 65;
      const by = H / 2 + 38;
      const bw = 130;
      const bh = 42;
      ctx.fillStyle = "#A855F7";
      ctx.beginPath();
      ctx.roundRect?.(bx, by, bw, bh, 12);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("▶ Play Again", W / 2, by + 27);
    }
  }, []);

  const update = useCallback((st: any) => {
    if (st.phase !== "playing") return;
    const m = st.moving;
    m.x += m.speed * m.dir;
    if (m.x + m.w > st.W) {
      m.x = st.W - m.w;
      m.dir = -1;
    }
    if (m.x < 0) {
      m.x = 0;
      m.dir = 1;
    }
  }, []);

  const handleStack = () => {
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
    if (st.phase !== "playing") return;
    const top = st.tower[st.tower.length - 1];
    const m = st.moving;
    // Overlap
    const left = Math.max(top.x, m.x);
    const right = Math.min(top.x + top.w, m.x + m.w);
    const overlap = right - left;
    if (overlap <= 0) {
      st.phase = "dead";
      saveHighScore(st.score);
      return;
    }
    const newBlock = {
      x: left,
      w: overlap,
      y: top.y - BLOCK_H,
      color: m.color,
    };
    st.tower.push(newBlock);
    st.score++;
    saveHighScore(st.score);
    st.best = Math.max(st.best, st.score);
    // Camera pan
    if (st.score > 5) st.cameraY = (st.tower.length - 8) * BLOCK_H;
    if (st.cameraY < 0) st.cameraY = 0;
    // Vibration
    if (navigator.vibrate)
      navigator.vibrate(overlap < top.w * 0.6 ? [30, 10, 30] : 15);
    // Next moving block
    st.colorIdx = (st.colorIdx + 1) % COLORS.length;
    const newSpeed = Math.min(8, 3 + st.score * 0.12);
    st.moving = {
      x: m.dir > 0 ? 0 : st.W - newBlock.w,
      w: newBlock.w,
      dir: m.dir > 0 ? 1 : -1,
      speed: newSpeed,
      color: COLORS[st.colorIdx],
    };
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
        <span style={{ color: "#A855F7", fontWeight: 800, fontSize: 18 }}>
          🗼 Stack Tower
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
        onClick={handleStack}
        onTouchStart={(e) => {
          e.preventDefault();
          handleStack();
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
