
import { useEffect, useRef, useState } from "react";
import "./SurvivalMode.css";

const WORDS = {
  Beginner: [
    "cat", "sun", "book", "fish", "star", "tree", "blue",
    "milk", "rain", "love", "game", "moon", "bird", "cake",
  ],
  Medium: [
    "apple", "dream", "light", "world", "happy", "focus",
    "skill", "brain", "quick", "smart", "typing", "coding",
    "future", "success", "victory",
  ],
  Hard: [
    "keyboard", "challenge", "creative", "practice",
    "computer", "wonderful", "brilliant", "adventure",
    "excellent", "powerful", "knowledge", "lightning",
    "fantastic", "imagination", "determination",
  ],
};

const LEVELS = {
  Beginner: {
    icon: "🌱",
    lives: 5,
    wordSpeed: 1,
    tagline: "Learn at your own pace",
    details: ["Easy short words", "5 lives", "Relaxed challenge"],
  },
  Medium: {
    icon: "⚡",
    lives: 3,
    wordSpeed: 1.25,
    tagline: "Find your rhythm",
    details: ["Balanced words", "3 lives", "Standard challenge"],
  },
  Hard: {
    icon: "🔥",
    lives: 2,
    wordSpeed: 1.6,
    tagline: "Can you survive?",
    details: ["Longer words", "2 lives", "Expert challenge"],
  },
};

export default function SurvivalMode() {
  const [currentWord, setCurrentWord] = useState("");
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState("Medium");
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [bestScore, setBestScore] = useState(() => {
    try {
      return Number(localStorage.getItem("typeRushSurvivalBest")) || 0;
    } catch {
      return 0;
    }
  });

  const inputRef = useRef(null);
  const wordRef = useRef("");
  const typedRef = useRef("");
  const scoreRef = useRef(0);
  const livesRef = useRef(3);

  const settings = LEVELS[difficulty];
  const progress = (timeLeft / 60) * 100;

  function pickWord(levelName = difficulty) {
    const list = WORDS[levelName];
    const word = list[Math.floor(Math.random() * list.length)];

    wordRef.current = word;
    setCurrentWord(word);
  }

  function startGame() {
    wordRef.current = "";
    typedRef.current = "";
    scoreRef.current = 0;
    livesRef.current = settings.lives;

    setCurrentWord("");
    setTyped("");
    setScore(0);
    setLives(settings.lives);
    setTimeLeft(60);
    setGameOver(false);

    const list = WORDS[difficulty];
    const firstWord = list[Math.floor(Math.random() * list.length)];

    wordRef.current = firstWord;
    setCurrentWord(firstWord);
    setRunning(true);

    window.setTimeout(() => inputRef.current?.focus(), 100);
  }

  useEffect(() => {
    if (!running) return;

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          setRunning(false);
          setGameOver(true);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (running && lives <= 0) {
      setRunning(false);
      setGameOver(true);
    }
  }, [lives, running]);

  function handleTyping(event) {
    const value = event.target.value.toLowerCase().trimStart();

    typedRef.current = value;
    setTyped(value);

    if (value.trim() === wordRef.current) {
      const newScore = scoreRef.current + wordRef.current.length * 10;

      scoreRef.current = newScore;
      setScore(newScore);
      setTyped("");
      typedRef.current = "";
      pickWord();

      setBestScore((previousBest) => {
        if (newScore <= previousBest) return previousBest;

        try {
          localStorage.setItem("typeRushSurvivalBest", String(newScore));
        } catch {
          // Best score storage may be unavailable.
        }

        return newScore;
      });
    }
  }

  function handleInputKeyDown(event) {
    if (
      event.key === " " &&
      typedRef.current.length > 0 &&
      typedRef.current.trim() !== wordRef.current
    ) {
      event.preventDefault();

      const remainingLives = Math.max(0, livesRef.current - 1);
      livesRef.current = remainingLives;

      setLives(remainingLives);
      setTyped("");
      typedRef.current = "";
    }
  }

  return (
    <main className="survival-page">
      <div className="survival-sky" aria-hidden="true">
        <div className="survival-cloud survival-cloud-left" />
        <div className="survival-cloud survival-cloud-right" />
        <div className="survival-stars" />
        <span className="survival-floating sf-one">survive</span>
        <span className="survival-floating sf-two">focus</span>
        <span className="survival-floating sf-three">typing</span>
        <span className="survival-floating sf-four">speed</span>
      </div>

      <header className="survival-header">
        <button
          className="survival-back"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>
        <div className="survival-brand">⌨ TYPE RUSH</div>
      </header>

      <section className="survival-intro">
        <div className="survival-hero-icon">⏱️</div>
        <p className="survival-eyebrow">TYPE RUSH ARCADE</p>
        <h1>One-Minute <span>Survival</span></h1>
        <p className="survival-subtitle">
          Type fast. Stay focused. Beat the clock!
        </p>
      </section>

      <section className="survival-stats">
        <div className="survival-stat">
          <span>Time left</span>
          <strong className={timeLeft <= 10 && running ? "time-warning" : ""}>
            {timeLeft}s
          </strong>
        </div>
        <div className="survival-stat">
          <span>Score</span>
          <strong>{score}</strong>
        </div>
        <div className="survival-stat">
          <span>Lives</span>
          <strong>
            {"❤️".repeat(Math.max(0, lives))}
            {"🖤".repeat(Math.max(0, settings.lives - lives))}
          </strong>
        </div>
        <div className="survival-stat">
          <span>Best score</span>
          <strong>{bestScore}</strong>
        </div>
      </section>

      <div className="survival-progress">
        <div
          className={timeLeft <= 10 ? "progress-danger" : ""}
          style={{ width: `${progress}%` }}
        />
      </div>

      <section className="survival-arena">
        <div className="survival-fire survival-fire-left" aria-hidden="true">🔥</div>
        <div className="survival-fire survival-fire-right" aria-hidden="true">🔥</div>
        <div className="survival-orb" aria-hidden="true">⚡</div>
        <div className="survival-rain" aria-hidden="true" />

        {running ? (
          <div className="survival-live-game">
            <p className="survival-label">TYPE THIS WORD</p>
            <div className="survival-word">{currentWord}</div>

            <input
              ref={inputRef}
              value={typed}
              onChange={handleTyping}
              onKeyDown={handleInputKeyDown}
              disabled={!running}
              placeholder="Type the word here..."
              autoComplete="off"
              spellCheck="false"
            />

            <p className="survival-hint">
              Complete the word to score points. Press Space on an incorrect
              attempt to lose one life.
            </p>
          </div>
        ) : (
          <div className="survival-overlay">
            <div className="survival-menu">
              <span className="survival-menu-icon">
                {gameOver ? "🏆" : "🔥"}
              </span>

              <h2>{gameOver ? "Challenge Complete!" : "Ready to Survive?"}</h2>

              <p className="survival-description">
                {gameOver
                  ? `Final score: ${score} • Best score: ${bestScore}`
                  : "Choose your difficulty and survive for 60 seconds. Type every word before the clock runs out!"}
              </p>

              <div className="survival-difficulty-grid">
                {Object.entries(LEVELS).map(([name, levelSettings]) => (
                  <button
                    key={name}
                    type="button"
                    className={`survival-difficulty survival-${name.toLowerCase()} ${
                      difficulty === name ? "survival-selected" : ""
                    }`}
                    onClick={() => setDifficulty(name)}
                    aria-pressed={difficulty === name}
                  >
                    {name === "Medium" && (
                      <span className="survival-recommended">★ Recommended</span>
                    )}

                    <span className="survival-difficulty-icon">
                      {levelSettings.icon}
                    </span>
                    <strong className="survival-difficulty-name">{name}</strong>
                    <span className="survival-tagline">{levelSettings.tagline}</span>
                    <span className="survival-divider" />

                    {levelSettings.details.map((detail) => (
                      <span className="survival-detail" key={detail}>
                        {detail}
                      </span>
                    ))}
                  </button>
                ))}
              </div>

              <button className="survival-start" onClick={startGame}>
                ▶ {gameOver ? "Play Again" : "Start Challenge"}
              </button>

              <p className="survival-footer-note">
                ✦ 60 seconds. One goal. Survive!
              </p>
            </div>
          </div>
        )}
      </section>

      <p className="survival-bottom-note">
        {running
          ? `${difficulty} mode • ${settings.lives} starting lives`
          : "Choose your level and get ready for the challenge."}
      </p>
    </main>
  );
}
