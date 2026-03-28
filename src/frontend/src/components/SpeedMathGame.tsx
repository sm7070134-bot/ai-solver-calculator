import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  onClose: () => void;
}

function shareScore(score: number, game: string) {
  const text = `I scored ${score} points in ${game} on CALC AI Pro! 🎮🔢 Can you beat me?`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  if (navigator.share) {
    navigator
      .share({ title: "CALC AI Pro Score", text })
      .catch(() => window.open(whatsappUrl, "_blank"));
  } else {
    window.open(whatsappUrl, "_blank");
  }
}

function generateQuestion(level: number): {
  question: string;
  answer: number;
  choices: number[];
} {
  const maxNum = level < 5 ? 9 : level < 10 ? 19 : 49;
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * (level < 3 ? 2 : 3))];
  const a = Math.floor(Math.random() * maxNum) + 1;
  const b = Math.floor(Math.random() * maxNum) + 1;
  let answer: number;
  let question: string;
  if (op === "+") {
    answer = a + b;
    question = `${a} + ${b}`;
  } else if (op === "-") {
    const [big, small] = a >= b ? [a, b] : [b, a];
    answer = big - small;
    question = `${big} - ${small}`;
  } else {
    answer = a * b;
    question = `${a} × ${b}`;
  }

  const choices = new Set<number>([answer]);
  while (choices.size < 4) {
    const delta = Math.floor(Math.random() * 10) + 1;
    choices.add(answer + (Math.random() > 0.5 ? delta : -delta));
  }
  return {
    question,
    answer,
    choices: [...choices].sort(() => Math.random() - 0.5),
  };
}

export function SpeedMathGame({ onClose }: Props) {
  const [phase, setPhase] = useState<"playing" | "gameover">("playing");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3000);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [qData, setQData] = useState(() => generateQuestion(1));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const highScore = Number(
    localStorage.getItem("calc_game_speedmath_highscore") || 0,
  );

  const nextQuestion = useCallback((lvl: number) => {
    setQData(generateQuestion(lvl));
    setTimeLeft(3000);
  }, []);

  const handleTimeout = useCallback(() => {
    setFlash("wrong");
    setTimeout(() => setFlash(null), 500);
    setStreak(0);
    setLives((l) => {
      const next = l - 1;
      if (next <= 0) setPhase("gameover");
      return next;
    });
    nextQuestion(level);
  }, [level, nextQuestion]);

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 100) {
          handleTimeout();
          return 3000;
        }
        return t - 100;
      });
    }, 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, handleTimeout]);

  useEffect(() => {
    if (phase === "gameover") {
      if (score > highScore)
        localStorage.setItem("calc_game_speedmath_highscore", String(score));
    }
  }, [phase, score, highScore]);

  function handleAnswer(choice: number) {
    if (phase !== "playing") return;
    if (choice === qData.answer) {
      setFlash("correct");
      setTimeout(() => setFlash(null), 300);
      const newStreak = streak + 1;
      const newCorrect = correct + 1;
      const newLevel = Math.floor(newCorrect / 5) + 1;
      setScore((s) => s + 10 + newStreak);
      setStreak(newStreak);
      setCorrect(newCorrect);
      setLevel(newLevel);
      nextQuestion(newLevel);
    } else {
      setFlash("wrong");
      setTimeout(() => setFlash(null), 500);
      setStreak(0);
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) setPhase("gameover");
        return next;
      });
      nextQuestion(level);
    }
  }

  const timerPct = (timeLeft / 3000) * 100;
  const timerColor =
    timerPct > 60 ? "#39FF14" : timerPct > 30 ? "#FFD700" : "#FF3B30";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(0,0,0,0.97)" }}
      data-ocid="speed_math.modal"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <span className="text-white font-black text-lg">Speed Math</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)",
          }}
          data-ocid="speed_math.close_button"
        >
          ✕
        </button>
      </div>

      {phase === "playing" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
          {/* Stats */}
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider">
                Score
              </p>
              <p
                className="text-white font-black text-2xl"
                style={{ color: "#FFD700" }}
              >
                {score}
              </p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider">
                Streak
              </p>
              <p
                className="text-white font-black text-2xl"
                style={{ color: "#39FF14" }}
              >
                {streak}🔥
              </p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider">
                Lives
              </p>
              <p className="text-white font-black text-2xl">
                {Array(lives).fill("❤️").join("")}
              </p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider">
                Lv
              </p>
              <p
                className="text-white font-black text-2xl"
                style={{ color: "#A855F7" }}
              >
                {level}
              </p>
            </div>
          </div>

          {/* Timer bar */}
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: 8, background: "rgba(255,255,255,0.10)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${timerPct}%`,
                background: timerColor,
                boxShadow: `0 0 10px ${timerColor}`,
              }}
            />
          </div>

          {/* Question */}
          <div
            className="rounded-3xl px-10 py-8 text-center transition-all duration-200"
            style={{
              background:
                flash === "correct"
                  ? "rgba(57,255,20,0.15)"
                  : flash === "wrong"
                    ? "rgba(255,59,48,0.15)"
                    : "rgba(255,255,255,0.05)",
              border: `2px solid ${flash === "correct" ? "rgba(57,255,20,0.50)" : flash === "wrong" ? "rgba(255,59,48,0.50)" : "rgba(255,255,255,0.10)"}`,
            }}
          >
            <p
              className="text-white font-black"
              style={{ fontSize: 72, lineHeight: 1 }}
            >
              {qData.question}
            </p>
            <p className="text-white/30 text-sm mt-2">= ?</p>
          </div>

          {/* Choices 2×2 grid */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {qData.choices.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => handleAnswer(choice)}
                className="rounded-2xl py-5 font-black text-2xl text-white transition-all active:scale-90"
                style={{
                  background:
                    flash === "wrong" && choice === qData.answer
                      ? "rgba(57,255,20,0.20)"
                      : "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                data-ocid="speed_math.button"
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "gameover" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 text-center">
          <span style={{ fontSize: 64 }}>💀</span>
          <h2 className="text-white font-black text-3xl">Game Over!</h2>
          <div
            className="rounded-2xl p-6 flex flex-col gap-3"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <p className="text-white/50 text-sm">Your Score</p>
            <p className="font-black text-5xl" style={{ color: "#FFD700" }}>
              {score}
            </p>
            <p className="text-white/50 text-sm">
              Best: {Math.max(score, highScore)}
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              type="button"
              className="rounded-2xl py-4 font-black text-black text-lg active:scale-95 transition-all"
              style={{
                background: "linear-gradient(90deg,#25D366,#128C7E)",
                boxShadow: "0 0 20px rgba(37,211,102,0.40)",
              }}
              onClick={() => shareScore(score, "Speed Math")}
              data-ocid="speed_math.secondary_button"
            >
              📤 Share on WhatsApp
            </button>
            <button
              type="button"
              className="rounded-2xl py-4 font-black text-white text-lg active:scale-95 transition-all"
              style={{
                background: "linear-gradient(90deg,#FFD700,#FF8C00)",
                boxShadow: "0 0 20px rgba(255,215,0,0.40)",
                color: "#000",
              }}
              onClick={() => {
                setScore(0);
                setStreak(0);
                setLives(3);
                setLevel(1);
                setCorrect(0);
                setTimeLeft(3000);
                setQData(generateQuestion(1));
                setPhase("playing");
              }}
              data-ocid="speed_math.primary_button"
            >
              🔄 Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
