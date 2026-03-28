import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

interface Props {
  onClose: () => void;
}

export function SnakeGame({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const CELL = 20;
  const getHighScore = () =>
    Number.parseInt(localStorage.getItem("hs_snake") || "0");
  const saveHighScore = (s: number) => {
    if (s > getHighScore()) localStorage.setItem("hs_snake", String(s));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: game fn
  const initState = useCallback((W: number, H: number) => {
    const cols = Math.floor(W / CELL);
    const rows = Math.floor(H / CELL);
    const cx = Math.floor(cols / 2);
    const cy = Math.floor(rows / 2);
    return {
      cols,
      rows,
      snake: [
        { x: cx, y: cy },
        { x: cx - 1, y: cy },
        { x: cx - 2, y: cy },
      ],
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: { x: 5, y: 5 },
      score: 0,
      best: getHighScore(),
      phase: "idle" as "idle" | "playing" | "dead",
      speed: 150,
    };
  }, []);

  const placeFood = (st: any) => {
    let fx: number;
    let fy: number;
    do {
      fx = Math.floor(Math.random() * st.cols);
      fy = Math.floor(Math.random() * st.rows);
    } while (st.snake.some((s: any) => s.x === fx && s.y === fy));
    st.food = { x: fx, y: fy };
  };

  const draw = useCallback((canvas: HTMLCanvasElement, st: any) => {
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width / (window.devicePixelRatio || 1);
    const H = canvas.height / (window.devicePixelRatio || 1);
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, W, H);
    // Grid lines subtle
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < st.cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, H);
      ctx.stroke();
    }
    for (let y = 0; y < st.rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(W, y * CELL);
      ctx.stroke();
    }
    // Food
    const fg = ctx.createRadialGradient(
      st.food.x * CELL + CELL / 2,
      st.food.y * CELL + CELL / 2,
      1,
      st.food.x * CELL + CELL / 2,
      st.food.y * CELL + CELL / 2,
      CELL / 2,
    );
    fg.addColorStop(0, "#ff6b6b");
    fg.addColorStop(1, "#c0392b");
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.arc(
      st.food.x * CELL + CELL / 2,
      st.food.y * CELL + CELL / 2,
      CELL / 2 - 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath();
    ctx.arc(
      st.food.x * CELL + CELL / 2 - 2,
      st.food.y * CELL + CELL / 2 - 3,
      2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    // Snake
    st.snake.forEach((seg: any, i: number) => {
      const t = i / st.snake.length;
      const r = Math.round(57 + (0 - 57) * t);
      const g = Math.round(255 + (191 - 255) * t);
      const b = Math.round(20 + (255 - 20) * t);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      const pad = i === 0 ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect?.(
        seg.x * CELL + pad,
        seg.y * CELL + pad,
        CELL - pad * 2,
        CELL - pad * 2,
        i === 0 ? 5 : 4,
      );
      ctx.fill();
      if (i === 0) {
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(
          seg.x * CELL + CELL / 2 + 4 * st.dir.x + 4 * st.dir.y * 0.5,
          seg.y * CELL + CELL / 2 + 4 * st.dir.y - 4 * st.dir.x * 0.5,
          2,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          seg.x * CELL + CELL / 2 + 4 * st.dir.x - 4 * st.dir.y * 0.5,
          seg.y * CELL + CELL / 2 + 4 * st.dir.y + 4 * st.dir.x * 0.5,
          2,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    });
    // HUD
    ctx.fillStyle = "rgba(255,215,0,0.9)";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${st.score}`, 10, 22);
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(`Best: ${st.best}`, W - 10, 22);

    if (st.phase === "idle") {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#39FF14";
      ctx.font = "bold 30px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🐍 Snake", W / 2, H / 2 - 30);
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.font = "16px sans-serif";
      ctx.fillText("Tap or press arrow keys", W / 2, H / 2 + 10);
      ctx.fillText("to start!", W / 2, H / 2 + 32);
    }
    if (st.phase === "dead") {
      ctx.fillStyle = "rgba(0,0,0,0.78)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#FF3B30";
      ctx.font = "bold 30px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Game Over!", W / 2, H / 2 - 50);
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(`Score: ${st.score}`, W / 2, H / 2 - 12);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "15px sans-serif";
      ctx.fillText(`Best: ${st.best}`, W / 2, H / 2 + 14);
      const bx = W / 2 - 60;
      const by = H / 2 + 34;
      const bw = 120;
      const bh = 40;
      ctx.fillStyle = "#39FF14";
      ctx.beginPath();
      ctx.roundRect?.(bx, by, bw, bh, 10);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("▶ Restart", W / 2, by + 26);
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: game fn
  const step = useCallback((st: any) => {
    if (st.phase !== "playing") return;
    st.dir = { ...st.nextDir };
    const head = { x: st.snake[0].x + st.dir.x, y: st.snake[0].y + st.dir.y };
    if (
      head.x < 0 ||
      head.x >= st.cols ||
      head.y < 0 ||
      head.y >= st.rows ||
      st.snake.some((s: any) => s.x === head.x && s.y === head.y)
    ) {
      st.phase = "dead";
      saveHighScore(st.score);
      return;
    }
    st.snake.unshift(head);
    if (head.x === st.food.x && head.y === st.food.y) {
      st.score++;
      st.best = Math.max(st.best, st.score);
      st.speed = Math.max(60, st.speed - 3);
      placeFood(st);
    } else {
      st.snake.pop();
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.getContext("2d")!.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;
    const cols = Math.floor(W / CELL);
    const rows = Math.floor(H / CELL);
    stateRef.current = initState(cols * CELL, rows * CELL);
    stateRef.current.cols = cols;
    stateRef.current.rows = rows;
    placeFood(stateRef.current);

    const loop = (ts: number) => {
      const st = stateRef.current;
      if (st.phase === "playing" && ts - lastTimeRef.current > st.speed) {
        lastTimeRef.current = ts;
        step(st);
      }
      draw(canvas, st);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const onKey = (e: KeyboardEvent) => {
      const st = stateRef.current;
      if (!st) return;
      if (st.phase === "idle") {
        st.phase = "playing";
        return;
      }
      const map: any = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };
      const d = map[e.key];
      if (d && !(d.x === -st.dir.x && d.y === -st.dir.y)) {
        st.nextDir = d;
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKey);
    };
  }, [initState, step, draw]);

  const handleCanvasTap = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const st = stateRef.current;
    if (!st) return;
    if (st.phase === "idle") {
      st.phase = "playing";
      return;
    }
    if (st.phase === "dead") {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      if (x > cx - 60 && x < cx + 60 && y > cy + 34 && y < cy + 74) {
        stateRef.current = initState(rect.width, rect.height);
        stateRef.current.cols = Math.floor(rect.width / CELL);
        stateRef.current.rows = Math.floor(rect.height / CELL);
        placeFood(stateRef.current);
        stateRef.current.best = getHighScore();
        stateRef.current.phase = "playing";
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    const st = stateRef.current;
    if (st?.phase === "idle") {
      st.phase = "playing";
    }
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    const st = stateRef.current;
    if (!st || st.phase !== "playing") return;
    if (Math.abs(dx) > Math.abs(dy)) {
      const d = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
      if (!(d.x === -st.dir.x)) st.nextDir = d;
    } else {
      const d = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
      if (!(d.y === -st.dir.y)) st.nextDir = d;
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
        <span style={{ color: "#39FF14", fontWeight: 800, fontSize: 18 }}>
          🐍 Snake
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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          touchAction: "none",
          display: "block",
        }}
      />
    </div>
  );
}
