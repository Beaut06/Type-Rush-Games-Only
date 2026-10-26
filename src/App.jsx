import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import KeyboardNinja from "./pages/KeyboardNinja";
import WordRain from "./pages/WordRain";
import SurvivalMode from "./pages/SurvivalMode";

import "./App.css";

function Home() {
  const games = [
    {
      title: "Keyboard Ninja",
      description: "Test your typing reflexes and strike every word with speed.",
      path: "/keyboard-ninja",
      icon: "⚔️",
      color: "purple",
      tag: "REFLEX CHALLENGE",
    },
    {
      title: "Word Rain",
      description: "Catch falling words before they reach the bottom.",
      path: "/word-rain",
      icon: "🌧️",
      color: "blue",
      tag: "SPEED CHALLENGE",
    },
    {
      title: "One-Minute Survival",
      description: "Type quickly, protect your lives, and survive for 60 seconds.",
      path: "/survival-mode",
      icon: "⏱️",
      color: "orange",
      tag: "SURVIVAL CHALLENGE",
    },
  ];

  return (
    <main className="home-page">
      <header className="site-header">
        <Link to="/" className="brand">
          <span className="brand-icon">⌨</span>
          <span>TYPE<span className="brand-accent">RUSH</span></span>
        </Link>
        <span className="header-label">GAMING ARCADE</span>
      </header>

      <section className="hero">
        <div className="eyebrow">
          <span className="live-dot" />
          THREE GAMES. ONE CHALLENGE.
        </div>

        <h1>
          Ready, Set,
          <br />
          <span className="gradient-text">Type Rush.</span>
        </h1>

        <p className="hero-description">
          Sharpen your typing skills, challenge your reflexes,
          and beat your personal best.
        </p>

        <a className="explore-button" href="#games">
          Explore Games <span>↓</span>
        </a>
      </section>

      <section className="games-section" id="games">
        <div className="section-heading">
          <div>
            <p className="section-kicker">CHOOSE YOUR CHALLENGE</p>
            <h2>Enter the Arcade</h2>
          </div>
          <span className="game-count">03 GAMES</span>
        </div>

        <div className="games-grid">
          {games.map((game, index) => (
            <article
              className={`game-card ${game.color}`}
              key={game.path}
            >
              <div className="card-top">
                <span className="game-number">
                  0{index + 1}
                </span>
                <span className="game-icon">{game.icon}</span>
              </div>

              <p className="game-tag">{game.tag}</p>
              <h3>{game.title}</h3>
              <p className="game-description">{game.description}</p>

              <Link className="play-button" to={game.path}>
                Play Game <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <span>⌨ TYPERUSH ARCADE</span>
        <span>Practice. Improve. Conquer.</span>
      </footer>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/keyboard-ninja" element={<KeyboardNinja />} />
        <Route path="/word-rain" element={<WordRain />} />
        <Route path="/survival-mode" element={<SurvivalMode />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
