
import { useEffect, useRef, useState } from "react";
import "./WordRain.css";

const WORDS = [
  "apple", "dream", "light", "world", "happy",
  "focus", "skill", "brain", "quick", "smart",
  "keyboard", "coding", "future", "success", "typing",
  "challenge", "creative", "practice", "computer", "victory",
];

const LEVELS = {
  Beginner: {
    icon: "🌱",
    speed: 0.18,
    randomSpeed: 0.1,
    spawnTime: 1800,
    maxWords: 4,
    lives: 5,
    tagline: "Perfect for getting started!",
    details: ["Slow speed", "5 lives", "Easy words"],
  },
  Medium: {
    icon: "⚡",
    speed: 0.35,
    randomSpeed: 0.15,
    spawnTime: 1300,
    maxWords: 6,
    lives: 3,
    tagline: "The perfect balance!",
    details: ["Normal speed", "3 lives", "Balanced challenge"],
  },
  Hard: {
    icon: "🔥",
    speed: 0.6,
    randomSpeed: 0.25,
    spawnTime: 850,
    maxWords: 8,
    lives: 2,
    tagline: "For true typing champions!",
    details: ["Fast speed", "2 lives", "Difficult words"],
  },
};

function createWord(id, level, difficulty) {
  const settings = LEVELS[difficulty];

  return {
    id,
    text: WORDS[Math.floor(Math.random() * WORDS.length)],
    x: 5 + Math.random() * 85,
    y: -8,
    speed:
      settings.speed +
      Math.random() * settings.randomSpeed +
      level * 0.04,
  };
}

export default function WordRain() {
  const [words, setWords] = useState([]);
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [difficulty, setDifficulty] = useState("Medium");
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [bestScore, setBestScore] = useState(() => {
    try {
      return Number(localStorage.getItem("typeRushWordRainBest")) || 0;
    } catch {
      return 0;
    }
  });

  const wordsRef = useRef([]);
  const nextIdRef = useRef(0);
  const inputRef = useRef(null);
  const maxLives = LEVELS[difficulty].lives;

  useEffect(() => {
    wordsRef.current = words;
  }, [words]);

  useEffect(() => {
    if (!running) return;

    const timer = window.setInterval(() => {
      let missed = 0;

      const updated = wordsRef.current
        .map((word) => ({ ...word, y: word.y + word.speed }))
        .filter((word) => {
          if (word.y >= 94) {
            missed++;
            return false;
          }
          return true;
        });

      wordsRef.current = updated;
      setWords(updated);

      if (missed) {
        setLives((current) => Math.max(0, current - missed));
      }
    }, 80);

    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (running && lives <= 0) {
      setRunning(false);
      setGameOver(true);
    }
  }, [running, lives]);

  useEffect(() => {
    if (!running) return;

    const settings = LEVELS[difficulty];

    const timer = window.setInterval(() => {
      const currentLevel = Math.floor(score / 100) + 1;
      setLevel(currentLevel);

      if (wordsRef.current.length < settings.maxWords) {
        const word = createWord(
          nextIdRef.current++,
          currentLevel,
          difficulty
        );

        wordsRef.current = [...wordsRef.current, word];
        setWords(wordsRef.current);
      }
    }, Math.max(450, settings.spawnTime - (level - 1) * 70));

    return () => window.clearInterval(timer);
  }, [running, difficulty, level, score]);

  function startGame() {
    wordsRef.current = [];
    nextIdRef.current = 0;

    setWords([]);
    setTyped("");
    setScore(0);
    setLives(LEVELS[difficulty].lives);
    setLevel(1);
    setGameOver(false);
    setRunning(true);

    window.setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleTyping(event) {
    const value = event.target.value.toLowerCase().trimStart();
    setTyped(value);

    if (!value.trim()) return;

    const match = wordsRef.current.find(
      (word) => word.text === value.trim()
    );

    if (!match) return;

    const remaining = wordsRef.current.filter(
      (word) => word.id !== match.id
    );

    wordsRef.current = remaining;
    setWords(remaining);

    setScore((current) => {
      const nextScore = current + match.text.length * 10;

      setBestScore((best) => {
        if (nextScore <= best) return best;

        try {
          localStorage.setItem(
            "typeRushWordRainBest",
            String(nextScore)
          );
        } catch {
          // Storage may be unavailable.
        }

        return nextScore;
      });

      return nextScore;
    });

    setTyped("");
  }

  return (
    <main className="word-rain-page">
      <div className="wr-sky" aria-hidden="true">
        <div className="wr-cloud wr-cloud-left" />
        <div className="wr-cloud wr-cloud-right" />
        <div className="wr-stars" />
        <span className="wr-floating wr-f1">code</span>
        <span className="wr-floating wr-f2">dream</span>
        <span className="wr-floating wr-f3">focus</span>
        <span className="wr-floating wr-f4">learn</span>
        <span className="wr-floating wr-f5">future</span>
        <span className="wr-floating wr-f6">typing</span>
      </div>

      <header className="wr-header">
        <button
          className="wr-back"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>

        <div className="wr-brand">⌨ TYPE RUSH</div>
      </header>

      <section className="wr-intro">
        <div className="wr-rain-icon">☁️</div>
        <h1>Word <span>Rain</span></h1>
        <h2>{gameOver ? "Challenge Complete!" : "Ready to Play?"}</h2>
        <p>
          {gameOver
            ? `Your final score is ${score}. Ready for another round?`
            : "Choose your difficulty and type the falling words to earn points."}
        </p>
      </section>

      <section className="wr-stats">
        <div className="wr-stat">
          <span>Score</span>
          <strong>{score}</strong>
        </div>
        <div className="wr-stat">
          <span>Lives</span>
          <strong>
            {"❤️".repeat(Math.max(0, lives))}
            {"🖤".repeat(Math.max(0, maxLives - lives))}
          </strong>
        </div>
        <div className="wr-stat">
          <span>Level</span>
          <strong>{level}</strong>
        </div>
        <div className="wr-stat">
          <span>Best score</span>
          <strong>{bestScore}</strong>
        </div>
      </section>

      <section className="wr-arena">
        <div className="wr-rain-streaks" aria-hidden="true" />

        {words.map((word) => (
          <span
            key={word.id}
            className={
              "wr-falling-word" +
              (typed && word.text.startsWith(typed)
                ? " wr-word-match"
                : "")
            }
            style={{
              left: `${word.x}%`,
              top: `${word.y}%`,
            }}
          >
            {word.text}
          </span>
        ))}

        {!running && (
          <div className="wr-overlay">
            <div className="wr-menu">
              <span className="wr-menu-icon">
                {gameOver ? "🏆" : "🌧️"}
              </span>

              <h2>{gameOver ? "Play Again?" : "Ready to Play?"}</h2>

              <p className="wr-description">
                Choose your difficulty and type the falling words to earn points.
              </p>

              <div className="wr-difficulty-grid">
                {Object.entries(LEVELS).map(([name, settings]) => (
                  <button
                    type="button"
                    key={name}
                    className={`wr-difficulty wr-${name.toLowerCase()} ${
                      difficulty === name ? "wr-selected" : ""
                    }`}
                    onClick={() => setDifficulty(name)}
                    aria-pressed={difficulty === name}
                  >
                    {name === "Medium" && (
                      <span className="wr-recommended">
                        ★ Recommended
                      </span>
                    )}

                    <span className="wr-difficulty-icon">
                      {settings.icon}
                    </span>

                    <strong className="wr-difficulty-name">
                      {name}
                    </strong>

                    <span className="wr-tagline">
                      {settings.tagline}
                    </span>

                    <span className="wr-divider" />

                    {settings.details.map((detail) => (
                      <span className="wr-detail" key={detail}>
                        {detail}
                      </span>
                    ))}
                  </button>
                ))}
              </div>

              <button className="wr-start" onClick={startGame}>
                <span>▶</span>
                {gameOver ? "Play Again" : "Start Challenge"}
              </button>

              <p className="wr-footer-note">
                ✦ Better words. Faster you.
              </p>
            </div>
          </div>
        )}
      </section>

         {running && (
  <section className="wr-input-section">
        <label htmlFor="wr-input">Type the falling words here</label>

        <input
          id="wr-input"
          ref={inputRef}
          value={typed}
          onChange={handleTyping}
          disabled={!running}
          placeholder={running ? "Type a word..." : "Start the challenge first"}
          autoComplete="off"
          spellCheck="false"
        />

        <p>Correct words earn points. Missing a word costs one life.</p>
      </section>
      )}
    </main>
  );
}
