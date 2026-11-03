const achievements = [
  {
    title: "First Steps",
    description: "Complete your first practice session.",
    icon: "🌱",
    unlocked: (history) => history.length >= 1,
  },
  {
    title: "Century Typist",
    description: "Press 100 keys in one session.",
    icon: "💯",
    unlocked: (history) => history.some((s) => s.totalKeys >= 100),
  },
  {
    title: "Accuracy Star",
    description: "Achieve 90% accuracy.",
    icon: "⭐",
    unlocked: (history) => history.some((s) => s.accuracy >= 90),
  },
  {
    title: "Precision Master",
    description: "Achieve 95% accuracy.",
    icon: "🎯",
    unlocked: (history) => history.some((s) => s.accuracy >= 95),
  },
  {
    title: "Speed Starter",
    description: "Reach 20 WPM.",
    icon: "⚡",
    unlocked: (history) => history.some((s) => s.wpm >= 20),
  },
  {
    title: "Dedicated Typist",
    description: "Complete 5 practice sessions.",
    icon: "🏆",
    unlocked: (history) => history.length >= 5,
  },
];

function AchievementBadges({ history, streak }) {
  const unlockedCount = achievements.filter((badge) =>
    badge.unlocked(history)
  ).length;

  return (
    <section className="dashboard-section">
      <div className="page-heading">
        <span className="card-eyebrow">REWARDS AND MILESTONES</span>
        <h2>Your achievements</h2>
        <p>Every session takes you one step closer to mastery.</p>
      </div>

      <div className="achievement-summary">
        <div>
          <strong>{unlockedCount}/{achievements.length}</strong>
          <span>Badges unlocked</span>
        </div>
        <div>
          <strong>🔥 {streak}</strong>
          <span>Current day streak</span>
        </div>
      </div>

      <div className="achievement-grid">
        {achievements.map((badge) => {
          const unlocked = badge.unlocked(history);

          return (
            <div
              key={badge.title}
              className={`achievement-card ${unlocked ? "unlocked" : "locked"}`}
            >
              <div className="achievement-icon">{badge.icon}</div>
              <h3>{badge.title}</h3>
              <p>{badge.description}</p>
              <span className="achievement-status">
                {unlocked ? "✓ UNLOCKED" : "🔒 LOCKED"}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AchievementBadges;