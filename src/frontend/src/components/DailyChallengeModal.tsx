import { Flame, Star, Trophy, X, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  onClose: () => void;
}

interface Question {
  expression: string;
  answer: number;
  options: number[];
}

interface LeaderEntry {
  score: number;
  date: string;
}

const QUESTION_TIME = 30;
const QUESTIONS_PER_ROUND = 10;
const LS_HIGH = "calc_challenge_high";
const LS_LEADER = "calc_challenge_leader";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion(): Question {
  const ops = ["+", "-", "×", "÷"] as const;
  const op = ops[rand(0, 3)];
  let a: number;
  let b: number;
  let answer: number;

  switch (op) {
    case "+":
      a = rand(1, 99);
      b = rand(1, 99);
      answer = a + b;
      break;
    case "-":
      a = rand(10, 99);
      b = rand(1, a);
      answer = a - b;
      break;
    case "×":
      a = rand(2, 12);
      b = rand(2, 12);
      answer = a * b;
      break;
    case "÷": {
      b = rand(2, 12);
      answer = rand(2, 12);
      a = b * answer;
      break;
    }
  }

  const distractors = new Set<number>();
  distractors.add(answer);
  while (distractors.size < 4) {
    const delta = rand(-10, 10);
    if (delta !== 0) distractors.add(answer + delta);
  }
  const options = [...distractors].sort(() => Math.random() - 0.5);

  return { expression: `${a} ${op} ${b}`, answer, options };
}

function loadLeaderboard(): LeaderEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_LEADER) || "[]");
  } catch {
    return [];
  }
}

function saveToLeaderboard(score: number) {
  const board = loadLeaderboard();
  board.push({ score, date: new Date().toLocaleDateString() });
  board.sort((a, b) => b.score - a.score);
  const top5 = board.slice(0, 5);
  localStorage.setItem(LS_LEADER, JSON.stringify(top5));
  return top5;
}

type GameState = "menu" | "playing" | "gameover";

export function DailyChallengeModal({ onClose }: Props) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [timeAtStart, setTimeAtStart] = useState(QUESTION_TIME);
  const [selected, setSelected] = useState<number | null>(null);
  const [_correct, setCorrect] = useState<boolean | null>(null);
  const [leaderboard, setLeaderboard] =
    useState<LeaderEntry[]>(loadLeaderboard);
  const [highScore, setHighScore] = useState(() =>
    Number(localStorage.getItem(LS_HIGH) || 0),
  );
  const [breakdown, setBreakdown] = useState<
    { correct: boolean; bonus: boolean; qnum: number }[]
  >([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startGame = useCallback(() => {
    const qs = Array.from({ length: QUESTIONS_PER_ROUND }, generateQuestion);
    setQuestions(qs);
    setCurrent(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setSelected(null);
    setCorrect(null);
    setBreakdown([]);
    setTimeLeft(QUESTION_TIME);
    setTimeAtStart(Date.now());
    setGameState("playing");
  }, []);

  const nextQuestion = useCallback(
    (idx: number, wasCorrect: boolean, hasBonus: boolean) => {
      setBreakdown((prev) => [
        ...prev,
        { correct: wasCorrect, bonus: hasBonus, qnum: idx + 1 },
      ]);
      setSelected(null);
      setCorrect(null);
      if (idx + 1 >= QUESTIONS_PER_ROUND) {
        clearTimer();
        setGameState("gameover");
      } else {
        setCurrent(idx + 1);
        setTimeLeft(QUESTION_TIME);
        setTimeAtStart(Date.now());
      }
    },
    [clearTimer],
  );

  const handleAnswer = useCallback(
    (opt: number) => {
      if (selected !== null) return;
      clearTimer();
      const q = questions[current];
      const elapsed = (Date.now() - timeAtStart) / 1000;
      const isCorrect = opt === q.answer;
      const bonus = isCorrect && elapsed < 5;
      setSelected(opt);
      setCorrect(isCorrect);

      if (isCorrect) {
        setScore((s) => s + 10 + (bonus ? 5 : 0));
        setStreak((s) => {
          const ns = s + 1;
          setMaxStreak((m) => Math.max(m, ns));
          return ns;
        });
      } else {
        setScore((s) => Math.max(0, s - 2));
        setStreak(0);
      }

      setTimeout(() => nextQuestion(current, isCorrect, bonus), 900);
    },
    [selected, questions, current, timeAtStart, clearTimer, nextQuestion],
  );

  // Timer
  useEffect(() => {
    if (gameState !== "playing" || selected !== null) return;
    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          nextQuestion(current, false, false);
          return QUESTION_TIME;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
  }, [gameState, current, selected, clearTimer, nextQuestion]);

  // Gameover: save scores
  useEffect(() => {
    if (gameState !== "gameover") return;
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(LS_HIGH, String(score));
    }
    setLeaderboard(saveToLeaderboard(score));
  }, [gameState, score, highScore]);

  const optColors = ["#00BFFF", "#39FF14", "#A855F7", "#FF8C00"];
  const optLabels = ["A", "B", "C", "D"];

  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const timerColor =
    timeLeft > 15 ? "#39FF14" : timeLeft > 8 ? "#FF8C00" : "#FF3B30";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)" }}
      role="presentation"
      onClick={gameState === "menu" ? onClose : undefined}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="challenge.modal"
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 flex flex-col gap-4 fade-in"
        style={{
          background: "rgba(10,10,10,0.98)",
          border: "1px solid rgba(255,101,132,0.3)",
          boxShadow:
            "0 0 60px rgba(255,101,132,0.12), 0 32px 80px rgba(0,0,0,0.9)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={20} style={{ color: "#FF6584" }} />
            <h2 className="text-white font-black text-xl tracking-tight">
              Daily Challenge
            </h2>
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onClick={onClose}
            data-ocid="challenge.close_button"
          >
            <X size={16} />
          </button>
        </div>

        {/* MENU */}
        {gameState === "menu" && (
          <div className="flex flex-col gap-5">
            <div
              className="rounded-2xl p-4 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,101,132,0.15), rgba(168,85,247,0.10))",
                border: "1px solid rgba(255,101,132,0.2)",
              }}
            >
              <p className="text-5xl mb-2">🎮</p>
              <p className="text-white font-bold text-lg">Math Challenge</p>
              <p className="text-white/50 text-sm mt-1">
                10 questions • 30s each • Beat your score!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-2xl p-3 text-center"
                style={{
                  background: "rgba(255,215,0,0.08)",
                  border: "1px solid rgba(255,215,0,0.2)",
                }}
              >
                <p className="text-yellow-400 text-2xl font-black">
                  {highScore}
                </p>
                <p className="text-white/40 text-xs">High Score</p>
              </div>
              <div
                className="rounded-2xl p-3 text-center"
                style={{
                  background: "rgba(255,101,132,0.08)",
                  border: "1px solid rgba(255,101,132,0.2)",
                }}
              >
                <p className="text-pink-400 text-2xl font-black">
                  {leaderboard.length}
                </p>
                <p className="text-white/40 text-xs">Games Played</p>
              </div>
            </div>

            {leaderboard.length > 0 && (
              <div>
                <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">
                  🏆 Top 5 Scores
                </p>
                {leaderboard.map((e, i) => (
                  <div
                    key={`${e.score}-${e.date}-${i}`}
                    className="flex items-center justify-between py-1.5"
                    style={{
                      borderBottom:
                        i < leaderboard.length - 1
                          ? "1px solid rgba(255,255,255,0.06)"
                          : "none",
                    }}
                    data-ocid={`challenge.item.${i + 1}`}
                  >
                    <span
                      className="text-sm font-bold"
                      style={{
                        color:
                          i === 0
                            ? "#FFD700"
                            : i === 1
                              ? "#C0C0C0"
                              : i === 2
                                ? "#CD7F32"
                                : "rgba(255,255,255,0.5)",
                      }}
                    >
                      #{i + 1}
                    </span>
                    <span className="text-white font-semibold">
                      {e.score} pts
                    </span>
                    <span className="text-white/30 text-xs">{e.date}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95 hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #FF6584, #A855F7)",
                boxShadow: "0 8px 32px rgba(255,101,132,0.4)",
                color: "white",
              }}
              onClick={startGame}
              data-ocid="challenge.primary_button"
            >
              🚀 Start Game
            </button>
          </div>
        )}

        {/* PLAYING */}
        {gameState === "playing" && questions[current] && (
          <div className="flex flex-col gap-4">
            {/* Stats row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame size={14} style={{ color: "#FF8C00" }} />
                <span className="text-orange-400 font-bold text-sm">
                  {streak} streak
                </span>
              </div>
              <span className="font-black text-xl" style={{ color: "#FFD700" }}>
                {score} pts
              </span>
              <span className="text-white/50 text-sm">
                {current + 1}/{QUESTIONS_PER_ROUND}
              </span>
            </div>

            {/* Timer bar */}
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${timerPct}%`,
                  background: timerColor,
                  boxShadow: `0 0 8px ${timerColor}`,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/40 text-xs">Time</span>
              <span
                className="font-black text-lg"
                style={{ color: timerColor }}
              >
                {timeLeft}s
              </span>
            </div>

            {/* Question */}
            <div
              className="rounded-2xl p-6 text-center"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <p className="text-white/40 text-xs uppercase tracking-widest mb-2">
                What is
              </p>
              <p className="text-white font-black text-4xl">
                {questions[current].expression} = ?
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              {questions[current].options.map((opt, i) => {
                const isSelected = selected === opt;
                const isAnswer = opt === questions[current].answer;
                let bg = "rgba(255,255,255,0.06)";
                let border = "rgba(255,255,255,0.12)";
                if (selected !== null) {
                  if (isAnswer) {
                    bg = "rgba(57,255,20,0.15)";
                    border = "#39FF14";
                  } else if (isSelected && !isAnswer) {
                    bg = "rgba(255,59,48,0.15)";
                    border = "#FF3B30";
                  }
                }
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={selected !== null}
                    className="py-4 rounded-2xl font-black text-xl transition-all active:scale-95"
                    style={{
                      background: bg,
                      border: `1px solid ${border}`,
                      color: optColors[i],
                      opacity:
                        selected !== null && !isAnswer && !isSelected ? 0.4 : 1,
                    }}
                    data-ocid={"challenge.button"}
                  >
                    <span className="text-white/40 text-xs mr-1">
                      {optLabels[i]}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* GAME OVER */}
        {gameState === "gameover" && (
          <div className="flex flex-col gap-4">
            <div
              className="rounded-2xl p-5 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,101,132,0.10))",
                border: "1px solid rgba(255,215,0,0.25)",
              }}
            >
              <Trophy
                size={40}
                style={{ color: "#FFD700", margin: "0 auto 8px" }}
              />
              <p className="text-white/50 text-sm">Final Score</p>
              <p
                className="font-black text-5xl my-1"
                style={{ color: "#FFD700" }}
              >
                {score}
              </p>
              {score >= highScore && (
                <p className="text-pink-400 text-sm font-bold">
                  🎉 New High Score!
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div
                className="rounded-xl p-3 text-center"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <p className="text-green-400 font-black text-xl">
                  {breakdown.filter((b) => b.correct).length}
                </p>
                <p className="text-white/40 text-xs">Correct</p>
              </div>
              <div
                className="rounded-xl p-3 text-center"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <p className="text-orange-400 font-black text-xl">
                  {maxStreak}
                </p>
                <p className="text-white/40 text-xs">Max Streak</p>
              </div>
              <div
                className="rounded-xl p-3 text-center"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <p className="text-purple-400 font-black text-xl">
                  {breakdown.filter((b) => b.bonus).length}
                </p>
                <p className="text-white/40 text-xs">Speed Bonus</p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="flex gap-1 flex-wrap">
              {breakdown.map((b) => (
                <div
                  key={b.qnum}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                  style={{
                    background: b.correct
                      ? "rgba(57,255,20,0.2)"
                      : "rgba(255,59,48,0.2)",
                    border: `1px solid ${b.correct ? "#39FF14" : "#FF3B30"}`,
                  }}
                >
                  {b.correct ? (
                    <Star size={10} style={{ color: "#39FF14" }} />
                  ) : (
                    "✗"
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 py-3 rounded-2xl font-bold transition-all active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.7)",
                }}
                onClick={onClose}
                data-ocid="challenge.cancel_button"
              >
                Exit
              </button>
              <button
                type="button"
                className="flex-1 py-3 rounded-2xl font-black transition-all active:scale-95 hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg, #FF6584, #A855F7)",
                  boxShadow: "0 6px 24px rgba(255,101,132,0.35)",
                  color: "white",
                }}
                onClick={startGame}
                data-ocid="challenge.primary_button"
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
