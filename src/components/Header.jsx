function Header({ theme, toggleTheme, streak, activeTab, setActiveTab }) {
  const tabs = ["Practice", "Analytics", "Achievements"];

  return (
    <header className="header">
      <a className="brand" href="#" onClick={(e) => e.preventDefault()}>
        <span className="brand-icon">K</span>
        <span>key<span className="brand-accent">stroke</span></span>
      </a>

      <nav className="nav-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "nav-link active" : "nav-link"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <span className="streak-pill">🔥 {streak} day streak</span>
        <button className="theme-button" onClick={toggleTheme}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}

export default Header;