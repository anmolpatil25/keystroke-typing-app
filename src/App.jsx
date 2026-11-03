
import { useEffect, useRef, useState } from "react";

import Header from "./components/Header";
import VirtualKeyboard from "./components/VirtualKeyboard";
import TypingArea from "./components/TypingArea";
import Timer from "./components/Timer";
import Statistics from "./components/Statistics";
import ResultScreen from "./components/ResultScreen";
import Analytics from "./components/Analytics";
import AchievementBadges from "./components/AchievementBadges";

const KEYS = "asdfjkl;";
const SESSION_TIME = 300;

const STORAGE = {
  history: "keystroke-history",
  keyStats: "keystroke-key-stats",
  theme: "keystroke-theme",
};

// Load saved data safely
function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

// Get date in local YYYY-MM-DD format
function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Calculate consecutive practice days
function getStreak(history) {
  const dates = new Set(
    history.map((session) =>
      localDateKey(new Date(session.date))
    )
  );

  const current = new Date();
  current.setHours(0, 0, 0, 0);

  if (!dates.has(localDateKey(current))) {
    current.setDate(current.getDate() - 1);
  }

  let streak = 0;

  while (dates.has(localDateKey(current))) {
    streak++;
    current.setDate(current.getDate() - 1);
  }

  return streak;
}

// Generate deterministic text using a seed
function seededText(seed, length = 100) {
  let value = 0;

  for (let i = 0; i < seed.length; i++) {
    value = (value * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return Array.from({ length }, () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return KEYS[value % KEYS.length];
  }).join("");
}

// Generate practice sequences
function generateText(difficulty, daily = false) {
  if (daily) {
    return seededText(localDateKey(new Date()));
  }

  if (difficulty === "Beginner") {
    return Array.from({ length: 100 }, () =>
      ["aaa", "sss", "ddd", "fff", "jjj", "kkk", "lll", ";;;"][
        Math.floor(Math.random() * 8)
      ]
    ).join("");
  }

  if (difficulty === "Intermediate") {
    const patterns = [
      "asdfjkl;",
      "fdsa;lkj",
      "asdf;lkj",
      "jkl;asdf",
      "fjdkasla",
    ];

    return Array.from({ length: 15 }, () =>
      patterns[Math.floor(Math.random() * patterns.length)]
    ).join("");
  }

  return Array.from({ length: 160 }, () =>
    KEYS[Math.floor(Math.random() * KEYS.length)]
  ).join("");
}

function App() {
  // Persistent application data
  const [history, setHistory] = useState(() =>
    loadData(STORAGE.history, [])
  );

  const [keyStats, setKeyStats] = useState(() =>
    loadData(STORAGE.keyStats, {})
  );

  const [theme, setTheme] = useState(() =>
    loadData(STORAGE.theme, "dark")
  );

  // Navigation and practice settings
  const [activeTab, setActiveTab] = useState("Practice");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [dailyMode, setDailyMode] = useState(false);

  // Typing data
  const [target, setTarget] = useState(() =>
    generateText("Intermediate")
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedResults, setTypedResults] = useState([]);

  // Session statistics
  const [timeLeft, setTimeLeft] = useState(SESSION_TIME);
  const [totalKeys, setTotalKeys] = useState(0);
  const [correctKeys, setCorrectKeys] = useState(0);
  const [wrongKeys, setWrongKeys] = useState(0);

  // Session status
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const sessionSaved = useRef(false);

  // Calculate live statistics
  const elapsedSeconds = SESSION_TIME - timeLeft;

  const accuracy =
    totalKeys === 0
      ? 100
      : Math.round((correctKeys / totalKeys) * 100);

  const wpm =
    elapsedSeconds > 0
      ? Math.round((totalKeys / 5) / (elapsedSeconds / 60))
      : 0;

  const streak = getStreak(history);
  const nextKey = target[currentIndex];

  // Save history to LocalStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE.history,
      JSON.stringify(history)
    );
  }, [history]);

  // Save key statistics
  useEffect(() => {
    localStorage.setItem(
      STORAGE.keyStats,
      JSON.stringify(keyStats)
    );
  }, [keyStats]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem(
      STORAGE.theme,
      JSON.stringify(theme)
    );
  }, [theme]);

  // Apply selected theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Three-second countdown
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null);
      setIsActive(true);
      setIsPaused(false);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Five-minute practice timer
  useEffect(() => {
    if (!isActive || isPaused || isFinished) return;

    if (timeLeft <= 0) {
      setIsActive(false);
      setIsFinished(true);

      if (!sessionSaved.current && totalKeys > 0) {
        const finalAccuracy = Math.round(
          (correctKeys / totalKeys) * 100
        );

        const finalWpm = Math.round(
          (totalKeys / 5) / (SESSION_TIME / 60)
        );

        const session = {
          id: `${Date.now()}`,
          date: new Date().toISOString(),
          mode: dailyMode ? "Daily Challenge" : difficulty,
          totalKeys,
          correctKeys,
          wrongKeys,
          accuracy: finalAccuracy,
          wpm: finalWpm,
        };

        setHistory((previous) => [...previous, session]);

        sessionSaved.current = true;
      }

      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    isActive,
    isPaused,
    isFinished,
    timeLeft,
    totalKeys,
    correctKeys,
    wrongKeys,
    dailyMode,
    difficulty,
  ]);

  // Reset practice session
  const resetSession = () => {
    setCurrentIndex(0);
    setTypedResults([]);
    setTimeLeft(SESSION_TIME);

    setTotalKeys(0);
    setCorrectKeys(0);
    setWrongKeys(0);

    setIsActive(false);
    setIsPaused(false);
    setIsFinished(false);
    setCountdown(null);

    sessionSaved.current = false;
  };

  // Start practice with countdown
  const startPractice = () => {
    resetSession();
    setTarget(generateText(difficulty, dailyMode));
    setCountdown(3);
  };

  // Restart practice
  const restartPractice = () => {
    resetSession();
    setTarget(generateText(difficulty, dailyMode));
  };

  // Pause or resume
  const togglePause = () => {
    setIsPaused((previous) => !previous);
  };

  // Process physical keyboard input
  const handleKeyPress = (key) => {
    if (!isActive || isPaused || isFinished) return;

    if (currentIndex >= target.length) return;

    const expectedKey = target[currentIndex];
    const isCorrect = key === expectedKey;

    setTotalKeys((value) => value + 1);

    if (isCorrect) {
      setCorrectKeys((value) => value + 1);
    } else {
      setWrongKeys((value) => value + 1);
    }

    // Update per-key accuracy statistics
    setKeyStats((previous) => {
      const existing = previous[expectedKey] || {
        total: 0,
        correct: 0,
      };

      return {
        ...previous,
        [expectedKey]: {
          total: existing.total + 1,
          correct: existing.correct + (isCorrect ? 1 : 0),
        },
      };
    });

    setTypedResults((previous) => [
      ...previous,
      isCorrect,
    ]);

    setCurrentIndex((previous) => previous + 1);

    // Generate additional text when needed
    if (currentIndex === target.length - 1) {
      setTarget(
        (previous) =>
          previous + generateText(difficulty, dailyMode)
      );
    }
  };

  // Change theme
  const toggleTheme = () => {
    setTheme((previous) =>
      previous === "dark" ? "light" : "dark"
    );
  };

  // Select difficulty
  const selectDifficulty = (value) => {
    setDifficulty(value);
    setDailyMode(false);
    setTarget(generateText(value));
    resetSession();
  };

  // Start daily challenge
  const startDailyChallenge = () => {
    setDailyMode(true);
    setDifficulty("Advanced");
    setTarget(generateText("Advanced", true));
    resetSession();
  };

  return (
    <div className="app">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        streak={streak}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="main-container">

        {/* PRACTICE PAGE */}
        {activeTab === "Practice" && (
          <>
            <section className="hero">
              <div className="hero-label">
                <span className="hero-label-line" />
                BUILD YOUR MUSCLE MEMORY
              </div>

              <h1>
                Type with confidence.
                <br />
                <span>One key at a time.</span>
              </h1>

              <p>
                Train your fingers, improve your accuracy,
                and discover the rhythm of touch typing.
              </p>
            </section>

            {/* Difficulty and daily challenge */}
            <div className="practice-options">
              <div className="difficulty-control">
                <label>DIFFICULTY LEVEL</label>

                <div className="difficulty-buttons">
                  {[
                    "Beginner",
                    "Intermediate",
                    "Advanced",
                  ].map((level) => (
                    <button
                      key={level}
                      className={
                        difficulty === level && !dailyMode
                          ? "difficulty-button selected"
                          : "difficulty-button"
                      }
                      onClick={() => selectDifficulty(level)}
                      disabled={isActive || countdown !== null}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className={`daily-button ${
                  dailyMode ? "selected" : ""
                }`}
                onClick={startDailyChallenge}
                disabled={isActive || countdown !== null}
              >
                📅{" "}
                {dailyMode
                  ? "Daily Challenge Selected"
                  : "Daily Challenge"}
              </button>
            </div>

            {/* Live statistics */}
            <Statistics
              totalKeys={totalKeys}
              accuracy={accuracy}
              correctKeys={correctKeys}
              wrongKeys={wrongKeys}
              wpm={wpm}
            />

            <section className="practice-card">
              <div className="practice-card-header">
                <div>
                  <span className="card-eyebrow">
                    YOUR TRAINING SESSION
                  </span>

                  <h2>
                    {dailyMode
                      ? "Daily Challenge"
                      : `${difficulty} Practice`}
                  </h2>
                </div>

                <Timer timeLeft={timeLeft} />
              </div>

              {/* Virtual keyboard and finger guidance */}
              <VirtualKeyboard
                nextKey={nextKey}
                keyStats={keyStats}
                showHeatmap
              />

              {/* Typing area */}
              <TypingArea
                target={target}
                currentIndex={currentIndex}
                typedResults={typedResults}
                isActive={
                  isActive && !isPaused && !isFinished
                }
                onKeyPress={handleKeyPress}
              />

              {/* Controls */}
              <div className="practice-controls">
                <div className="session-info">
                  <span className="status-dot" />

                  {isFinished
                    ? "Session completed"
                    : isPaused
                    ? "Practice paused"
                    : isActive
                    ? "Session in progress"
                    : countdown !== null
                    ? "Get ready!"
                    : "Ready when you are"}
                </div>

                <div className="button-group">
                  <button
                    className="secondary-button"
                    onClick={restartPractice}
                  >
                    ↻ Restart
                  </button>

                  {isActive && (
                    <button
                      className="secondary-button"
                      onClick={togglePause}
                    >
                      {isPaused ? "▶ Resume" : "Ⅱ Pause"}
                    </button>
                  )}

                  {!isActive &&
                    countdown === null &&
                    !isFinished && (
                      <button
                        className="primary-button"
                        onClick={startPractice}
                      >
                        Start Practice <span>→</span>
                      </button>
                    )}
                </div>
              </div>
            </section>

            {/* Countdown overlay */}
            {countdown !== null && (
              <div className="countdown-overlay">
                <span>
                  {countdown === 0 ? "GO!" : countdown}
                </span>
                <p>Get ready to type</p>
              </div>
            )}
          </>
        )}

        {/* ANALYTICS PAGE */}
        {activeTab === "Analytics" && (
          <Analytics
            history={history}
            keyStats={keyStats}
          />
        )}

        {/* ACHIEVEMENTS PAGE */}
        {activeTab === "Achievements" && (
          <AchievementBadges
            history={history}
            streak={streak}
          />
        )}

        <footer className="app-footer">
          <div>
            KEYSTROKE <span>© 2026</span>
          </div>

          <p>Consistency creates muscle memory.</p>

          <div className="footer-keys">
            A S D F · J K L ;
          </div>
        </footer>
      </main>

      {/* Final results */}
      {isFinished && (
        <ResultScreen
          totalKeys={totalKeys}
          correctKeys={correctKeys}
          wrongKeys={wrongKeys}
          accuracy={accuracy}
          wpm={wpm}
          onRestart={restartPractice}
        />
      )}
    </div>
  );
}

export default App;
