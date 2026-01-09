function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <header className="top-bar">
        <h1>Subeb (SSW)</h1>

        {/*You can add navigation or user profile info here*/}

        <div className="left-menu">
          <span className="menu-item">All Apps</span>
          <span className="menu-item">About</span>
        </div>

        <div className="right-menu">
          <span className="menu-icon">☰</span>
        </div>
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
}

export default MainLayout;
