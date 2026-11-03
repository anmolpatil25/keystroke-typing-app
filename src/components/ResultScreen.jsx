function ResultScreen({
  totalKeys,
  correctKeys,
  wrongKeys,
  accuracy,
  wpm,
  onRestart,
}) {
  return (
    <div className="result-overlay">
      <div className="result-card">
        <div className="result-icon">✦</div>

        <span className="result-eyebrow">SESSION COMPLETED</span>
        <h2>Great work!</h2>

        <p className="result-description">
          You've completed your typing practice.
          Keep practising to improve your muscle memory.
        </p>

        <div className="result-accuracy">
          <span>{accuracy}%</span>
          <small>Accuracy</small>
        </div>

        <div className="result-grid">
          <div><strong>{totalKeys}</strong><span>Total keys</span></div>
          <div><strong className="green-text">{correctKeys}</strong><span>Correct</span></div>
          <div><strong className="red-text">{wrongKeys}</strong><span>Incorrect</span></div>
          <div><strong>{wpm}</strong><span>WPM</span></div>
        </div>

        <button className="primary-button result-button" onClick={onRestart}>
          Practice Again <span>→</span>
        </button>
      </div>
    </div>
  );
}

export default ResultScreen;