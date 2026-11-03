function Timer({ timeLeft }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="stat-card timer-card">
      <div className="stat-top">
        <span className="stat-label">TIME LEFT</span>
        <span className="stat-icon">◷</span>
      </div>

      <div className="stat-value timer-value">
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </div>

      <div className="stat-subtitle">5 minute session</div>
    </div>
  );
}

export default Timer;