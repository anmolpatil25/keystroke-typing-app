import { useEffect, useRef } from "react";

function TypingArea({
  target,
  currentIndex,
  typedResults,
  isActive,
  onKeyPress,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isActive) inputRef.current?.focus();
  }, [isActive]);

  const handleKeyDown = (event) => {
    if (!isActive || event.repeat) return;

    if (event.key.length === 1) {
      event.preventDefault();

      if (/^[asdfjkl;]$/i.test(event.key)) {
        onKeyPress(event.key.toLowerCase());
      }
    }
  };

  return (
    <div
      className="typing-section"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="section-heading">
        <div>
          <h3>Typing practice</h3>
          <p>Focus on the screen, not your keyboard.</p>
        </div>
        <span className="live-badge">
          <span className="status-dot" /> LIVE
        </span>
      </div>

      <div className="typing-box">
        <div className="target-text">
          {target.split("").map((char, index) => {
            let className = "";

            if (index < currentIndex) {
              className = typedResults[index]
                ? "char-correct"
                : "char-wrong";
            } else if (index === currentIndex) {
              className = "char-current";
            }

            return (
              <span key={index} className={className}>
                {char}
              </span>
            );
          })}
        </div>

        <input
          ref={inputRef}
          className="typing-input"
          type="text"
          onKeyDown={handleKeyDown}
          disabled={!isActive}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          aria-label="Typing practice input"
          placeholder={
            isActive
              ? "Your keyboard is ready..."
              : "Press Start Practice to begin"
          }
        />

        <div className="typing-footer">
          <span>⌨ Type using your physical keyboard</span>
          <span>{currentIndex} / {target.length} characters</span>
        </div>
      </div>
    </div>
  );
}

export default TypingArea;