// components/Layout/MainLayout.jsx
import React, { useState } from "react";
import bglessLogo from "../../assets/images/bgless-subeb-logo.png";

function MainLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="main-layout">
      <header className="subeb-header">
        <div className="header-container">
          {/* Logo / Brand */}
          <div className="brand">
            <a href="/" className="brand-link">
              <div className="logo-icon">
                <img src={bglessLogo} alt="SUBEB Logo" width={42} height={42} />
              </div>
              <div className="logo-text-wrapper">
                <span className="logo-main">SUBEB</span>
                <span className="logo-sub">Single Window</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <a href="#apps" className="nav-item">
              All Apps
            </a>
            <a href="#about" className="nav-item">
              About
            </a>
            {/* Add more links here as needed */}
            {/* Optional user area */}
            {/*<div className="user-area">
              <button className="user-button">
                <span className="user-name">Welcome</span>
                <div className="user-avatar">P</div>
              </button>
            </div>*/}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`bar top ${isMenuOpen ? "active" : ""}`}></span>
            <span className={`bar middle ${isMenuOpen ? "active" : ""}`}></span>
            <span className={`bar bottom ${isMenuOpen ? "active" : ""}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          <nav className="mobile-nav">
            <a
              href="#apps"
              className="mobile-link"
              onClick={() => setIsMenuOpen(false)}
            >
              All Apps
            </a>
            <a
              href="#about"
              className="mobile-link"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            {/* Add more mobile items */}
            <button className="mobile-signin-btn">Sign In / Profile</button>
          </nav>
        </div>
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
}

export default MainLayout;
