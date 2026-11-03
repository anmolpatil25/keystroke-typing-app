const keys = [
  { key: "a", finger: "Left pinky", hand: "LEFT" },
  { key: "s", finger: "Left ring", hand: "LEFT" },
  { key: "d", finger: "Left middle", hand: "LEFT" },
  { key: "f", finger: "Left index", hand: "LEFT" },
  { key: "j", finger: "Right index", hand: "RIGHT" },
  { key: "k", finger: "Right middle", hand: "RIGHT" },
  { key: "l", finger: "Right ring", hand: "RIGHT" },
  { key: ";", finger: "Right pinky", hand: "RIGHT" },
];

function VirtualKeyboard({ nextKey, keyStats = {}, showHeatmap = false }) {
  const getHeatColor = (key) => {
    const stat = keyStats[key];

    if (!stat || stat.total === 0) return "";

    const accuracy = (stat.correct / stat.total) * 100;

    if (accuracy >= 90) return "heat-good";
    if (accuracy >= 75) return "heat-medium";
    return "heat-low";
  };

  return (
    <div className="keyboard-section">
      <div className="section-heading">
        <div>
          <h3>Home row keyboard</h3>
          <p>Place your fingers on the highlighted keys.</p>
        </div>

        {showHeatmap && <span className="keyboard-hint">ACCURACY MAP</span>}
      </div>

      <div className="keyboard">
        {keys.map((item) => {
          const stat = keyStats[item.key];
          const accuracy =
            stat?.total > 0
              ? Math.round((stat.correct / stat.total) * 100)
              : null;

          return (
            <div
              key={item.key}
              className={`key ${
                nextKey === item.key ? "key-active" : ""
              } ${showHeatmap ? getHeatColor(item.key) : ""}`}
              title={`${item.finger}${accuracy !== null ? ` · ${accuracy}% accuracy` : ""}`}
            >
              <span className="key-letter">{item.key.toUpperCase()}</span>
              <span className="key-finger">{item.finger}</span>
              {showHeatmap && accuracy !== null && (
                <span className="key-accuracy">{accuracy}%</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="finger-guide">
        <span>← LEFT HAND</span>
        <span>RIGHT HAND →</span>
      </div>

      <div className="finger-tip">
        <span>💡</span>
        {nextKey
          ? `Use your ${keys.find((item) => item.key === nextKey)?.finger} finger for the next key.`
          : "Start practising to see finger guidance."}
      </div>
    </div>
  );
}

export default VirtualKeyboard;