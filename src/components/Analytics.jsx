function Analytics({ history, keyStats }) {
  const recent = history.slice(-7);

  const averageAccuracy = history.length
    ? Math.round(
        history.reduce((sum, item) => sum + item.accuracy, 0) /
          history.length
      )
    : 0;

  const bestWpm = history.length
    ? Math.max(...history.map((item) => item.wpm))
    : 0;

  const maxWpm = Math.max(1, ...recent.map((item) => item.wpm));

  return (
    <section className="dashboard-section">
      <div className="page-heading">
        <span className="card-eyebrow">YOUR PERFORMANCE</span>
        <h2>Progress analytics</h2>
        <p>Understand how your typing improves over time.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">TOTAL SESSIONS</span>
          <div className="stat-value">{history.length}</div>
        </div>
        <div className="stat-card">
          <span className="stat-label">AVERAGE ACCURACY</span>
          <div className="stat-value blue-text">{averageAccuracy}%</div>
        </div>
        <div className="stat-card">
          <span className="stat-label">BEST WPM</span>
          <div className="stat-value">{bestWpm}</div>
        </div>
        <div className="stat-card">
          <span className="stat-label">TOTAL KEY PRESSES</span>
          <div className="stat-value">
            {history.reduce((sum, item) => sum + item.totalKeys, 0)}
          </div>
        </div>
      </div>

      <div className="analytics-card">
        <h3>Typing speed history</h3>
        <p className="muted-text">Your last seven completed sessions · WPM</p>

        {recent.length === 0 ? (
          <div className="empty-state">
            <span>📊</span>
            <p>Complete your first session to see your chart.</p>
          </div>
        ) : (
          <div className="chart">
            {recent.map((item, index) => (
              <div className="chart-column" key={item.id}>
                <span className="chart-value">{item.wpm}</span>
                <div
                  className="chart-bar"
                  style={{
                    height: `${Math.max(5, (item.wpm / maxWpm) * 160)}px`,
                  }}
                />
                <span className="chart-label">
                  {new Date(item.date).toLocaleDateString("en", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="analytics-card">
        <h3>Key accuracy heatmap</h3>
        <p className="muted-text">
          Identify the keys that need more practice.
        </p>

        <div className="heatmap-grid">
          {"asdfjkl;".split("").map((key) => {
            const stat = keyStats[key];
            const accuracy = stat?.total
              ? Math.round((stat.correct / stat.total) * 100)
              : null;

            const heatClass =
              accuracy === null
                ? ""
                : accuracy >= 90
                ? "heat-good"
                : accuracy >= 75
                ? "heat-medium"
                : "heat-low";

            return (
              <div className={`heatmap-key ${heatClass}`} key={key}>
                <strong>{key.toUpperCase()}</strong>
                <span>{accuracy === null ? "—" : `${accuracy}%`}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="analytics-card">
        <h3>Recent sessions</h3>

        {history.length === 0 ? (
          <div className="empty-state">
            Complete a practice session to build your history.
          </div>
        ) : (
          <div className="history-list">
            {[...history].reverse().slice(0, 10).map((item) => (
              <div className="history-row" key={item.id}>
                <div>
                  <strong>{item.mode}</strong>
                  <span>
                    {new Date(item.date).toLocaleString()}
                  </span>
                </div>
                <div className="history-results">
                  <strong>{item.wpm} WPM</strong>
                  <span>{item.accuracy}% accuracy</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Analytics;