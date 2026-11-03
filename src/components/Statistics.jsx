function Statistics({
  totalKeys,
  accuracy,
  correctKeys,
  wrongKeys,
  wpm,
}) {
  const stats = [
    { label: "KEY PRESSES", value: totalKeys, subtitle: "Total attempts", icon: "⌨" },
    { label: "ACCURACY", value: `${accuracy}%`, subtitle: "Typing precision", icon: "◎" },
    { label: "LIVE WPM", value: wpm, subtitle: "Characters / 5", icon: "⚡" },
    { label: "CORRECT", value: correctKeys, subtitle: `${wrongKeys} incorrect`, icon: "✓" },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div className="stat-card" key={stat.label}>
          <div className="stat-top">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-icon">{stat.icon}</span>
          </div>

          <div className={`stat-value ${index === 1 || index === 2 ? "blue-text" : ""}`}>
            {stat.value}
          </div>

          <div className="stat-subtitle">{stat.subtitle}</div>
        </div>
      ))}
    </div>
  );
}

export default Statistics;