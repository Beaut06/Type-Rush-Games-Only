
import { useEffect, useRef, useState } from "react";
import "./KeyboardNinja.css";

const LETTERS = "ASDFGHJKLQWERTYUIOPZXCVBNM";
const KEYBOARD_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export default function KeyboardNinja() {
  const [target, setTarget] = useState("A");
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lastHit, setLastHit] = useState("");
  const [bestScore, setBestScore] = useState(() => {
    try {
      return Number(localStorage.getItem("typeRushNinjaBest")) || 0;
    } catch {
      return 0;
    }
  });

  const stateRef = useRef({ running: false, target: "A" });
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const comboRef = useRef(0);
  const hitTimeoutRef = useRef(null);

  function nextLetter() {
    let letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];

    if (LETTERS.length > 1 && letter === stateRef.current.target) {
      const alternatives = LETTERS.replace(letter, "");
      letter = alternatives[Math.floor(Math.random() * alternatives.length)];
    }

    stateRef.current.target = letter;
    setTarget(letter);
  }

  function startGame() {
    scoreRef.current = 0;
    livesRef.current = 3;
    comboRef.current = 0;
    stateRef.current.running = true;
    stateRef.current.target = "";

    setScore(0);
    setLives(3);
    setCombo(0);
    setTimeLeft(60);
    setLastHit("");
    setGameOver(false);
    setRunning(true);
    nextLetter();
  }

  useEffect(() => {
    if (!running) return;

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          stateRef.current.running = false;
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
    function handleKeyDown(event) {
      if (
        !stateRef.current.running ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      ) {
        return;
      }

      if (event.repeat || !/^[a-z]$/i.test(event.key)) return;

      event.preventDefault();

      if (event.key.toUpperCase() === stateRef.current.target) {
        comboRef.current += 1;

        const bonus = comboRef.current % 5 === 0 ? 20 : 0;
        const newScore = scoreRef.current + 10 + bonus;

        scoreRef.current = newScore;
        setScore(newScore);
        setCombo(comboRef.current);
        setLastHit("correct");

        nextLetter();

        try {
          const previousBest =
            Number(localStorage.getItem("typeRushNinjaBest")) || 0;

          if (newScore > previousBest) {
            localStorage.setItem("typeRushNinjaBest", String(newScore));
            setBestScore(newScore);
          }
        } catch {
          // Local storage may be unavailable.
        }
      } else {
        comboRef.current = 0;
        setCombo(0);
        setLastHit("wrong");

        const remainingLives = Math.max(0, livesRef.current - 1);
        livesRef.current = remainingLives;
        setLives(remainingLives);

        if (remainingLives === 0) {
          stateRef.current.running = false;
          setRunning(false);
          setGameOver(true);
        }
      }

      if (hitTimeoutRef.current) {
        window.clearTimeout(hitTimeoutRef.current);
      }

      hitTimeoutRef.current = window.setTimeout(() => {
        setLastHit("");
      }, 250);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      if (hitTimeoutRef.current) {
        window.clearTimeout(hitTimeoutRef.current);
      }
    };
  }, []);

  const progress = (timeLeft / 60) * 100;

  return (
    <main className="ninja-page">
      <div className="ninja-background-art" aria-hidden="true">
        <div className="ninja-glow ninja-glow-left" />
        <div className="ninja-glow ninja-glow-right" />
        <div className="ninja-grid-art" />
        <span className="ninja-floating-word nf-one">FOCUS</span>
        <span className="ninja-floating-word nf-two">SPEED</span>
        <span className="ninja-floating-word nf-three">ACCURACY</span>
      </div>

      <header className="ninja-header">
        <button className="ninja-back" onClick={() => window.history.back()}>
          ← Back
        </button>
        <div className="ninja-brand">⌨ TYPE RUSH</div>
      </header>

      <section className="ninja-intro">
        <div className="ninja-hero-icon">🥷</div>
        <p className="ninja-eyebrow">TYPE RUSH ARCADE</p>
        <h1>Keyboard <span>Ninja</span></h1>
        <p className="ninja-subtitle">
          Strike the correct key. Build your combo. Master your speed!
        </p>
      </section>

      <section className="ninja-stats">
        <div className="ninja-stat">
          <span>Time left</span>
          <strong className={timeLeft <= 10 && running ? "ninja-time-warning" : ""}>
            {timeLeft}s
          </strong>
        </div>

        <div className="ninja-stat">
          <span>Score</span>
          <strong>{score}</strong>
        </div>

        <div className="ninja-stat">
          <span>Lives</span>
          <strong>
            {"❤️".repeat(lives)}
            {"🖤".repeat(3 - lives)}
          </strong>
        </div>

        <div className="ninja-stat">
          <span>Combo</span>
          <strong>🔥 {combo}</strong>
        </div>

        <div className="ninja-stat">
          <span>Best score</span>
          <strong>{bestScore}</strong>
        </div>
      </section>

      <div className="ninja-progress">
        <div
          className={timeLeft <= 10 ? "ninja-progress-danger" : ""}
          style={{ width: `${progress}%` }}
        />
      </div>

      <section className={`ninja-arena ${lastHit ? `ninja-${lastHit}-flash` : ""}`}>
        <div className="ninja-arena-glow" aria-hidden="true" />
        <div className="ninja-flying ninja-flying-left" aria-hidden="true">
          🥷
        </div>
        <div className="ninja-flying ninja-flying-right" aria-hidden="true">
          🥷
        </div>
        <div className="ninja-energy energy-one" aria-hidden="true">✦</div>
        <div className="ninja-energy energy-two" aria-hidden="true">⚡</div>

        {!running ? (
          <div className="ninja-overlay">
            <div className="ninja-card">
              <div className="ninja-icon">{gameOver ? "🏆" : "🥷"}</div>

              <p className="ninja-card-eyebrow">
                {gameOver ? "MISSION REPORT" : "YOUR MISSION AWAITS"}
              </p>

              <h2>{gameOver ? "Challenge Complete!" : "Ready, Ninja?"}</h2>

              <p className="ninja-card-description">
                {gameOver
                  ? `Your score: ${score} · Best score: ${bestScore}`
                  : "You have 60 seconds and 3 lives. Press the matching letter on your physical keyboard!"}
              </p>

              {gameOver && (
                <div className="ninja-result-stats">
                  <div>
                    <span>FINAL SCORE</span>
                    <strong>{score}</strong>
                  </div>
                  <div>
                    <span>BEST SCORE</span>
                    <strong>{bestScore}</strong>
                  </div>
                  <div>
                    <span>BEST COMBO</span>
                    <strong>{combo}</strong>
                  </div>
                </div>
              )}

              <button className="ninja-start" onClick={startGame}>
                ⚔ {gameOver ? "Play Again" : "Start Challenge"}
              </button>

              <p className="ninja-footer-note">
                ✦ Correct key +10 · Every 5 hits +20 bonus
              </p>
            </div>
          </div>
        ) : (
          <div className="ninja-live-game">
            <div className="ninja-live-badge">
              <span className="ninja-live-dot" /> MISSION IN PROGRESS
            </div>

            <p className="ninja-label">PRESS THIS LETTER</p>

            <div className="ninja-target-wrap">
              <div className="ninja-target-ring" />
              <div className="ninja-target">{target}</div>
            </div>

            <p className="ninja-combo-label">
              {combo >= 5
                ? `🔥 ${combo} HIT COMBO — KEEP GOING!`
                : "Hit the highlighted key to score points"}
            </p>

            <div className="ninja-keyboard">
              {KEYBOARD_ROWS.map((row, rowIndex) => (
                <div className="ninja-keyboard-row" key={rowIndex}>
                  {row.split("").map((key) => (
                    <span
                      className={`ninja-key ${
                        key === target ? "ninja-key-active" : ""
                      }`}
                      key={key}
                    >
                      {key}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            <p className="ninja-hint">
              Correct key = +10 points · Every 5 correct keys = +20 bonus
              <br />
              Wrong key = lose 1 life
            </p>
          </div>
        )}
      </section>

      <p className="ninja-bottom-note">
        {running
          ? "Stay sharp. Watch the highlighted letter and strike fast!"
          : "Train your reflexes. Build your combo. Become the Keyboard Ninja."}
      </p>
    </main>
  );
}
