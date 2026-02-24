import React from "react";
import "../../styles/footer.css";
import subebLogo from "../../assets/images/bgless-subeb-logo.png"; // Replace with actual logo path

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="subeb-footer">
      <div className="footer-gradient"></div>

      <div className="footer-main">
        <div className="footer-container">
          {/* Left – Brand & Mission (heaviest visual weight) */}
          <div className="footer-column brand">
            <div className="footer-logo">
              <span className="logo-symbol">
                <img src={subebLogo} alt="SUBEB Logo" width={42} height={42} />
              </span>
              <div className="logo-text">
                <span className="logo-main">SUBEB</span>
                <span className="logo-state">Benue State</span>
              </div>
            </div>

            <p className="footer-tagline">
              Transforming basic education through transparency, innovation and
              technology
            </p>

            <p className="footer-mission">
              Committed to delivering equitable, high-quality basic education to
              every child in Benue State through effective leadership and
              digital excellence.
            </p>

            {/*<div className="social-icons">
              <a href="#" className="social-link" aria-label="Twitter">
                𝕏
              </a>
              <a href="#" className="social-link" aria-label="Facebook">
                f
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                📷
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                ▶
              </a>
            </div>*/}
          </div>

          {/* Middle – Systems */}
          <div className="footer-column">
            <h4>Our Digital Platforms</h4>
            <ul className="footer-links">
              <li>
                <a href="#">Deployment Letter Generator</a>
              </li>
              <li>
                <a href="#">School Data Capture System</a>
              </li>
              <li>
                <a href="#">Staff Attendance Monitoring</a>
              </li>
              <li>
                <a href="#">Information Management System</a>
              </li>
              <li>
                <a href="#" className="coming-soon">
                  Learning Management Portal (Coming Soon)
                </a>
              </li>
            </ul>
          </div>

          {/* Right – Quick Links + Contact */}
          <div className="footer-column">
            <h4>Quick Access</h4>
            <ul className="footer-links">
              <li>
                <a href="#">About SUBEB</a>
              </li>
              <li>
                <a href="#">Leadership & Governance</a>
              </li>
              <li>
                <a href="#">Policies & Regulations</a>
              </li>
              <li>
                <a href="#">News & Announcements</a>
              </li>
              <li>
                <a href="#">Contact & Support</a>
              </li>
            </ul>

            <div className="contact-block">
              <h5>Benue SUBEB</h5>
              <p>
                No. 1 SUBEB Road, Off Gboko Road
                <br />
                Makurdi, Benue State
              </p>
              <p>
                <a href="mailto:info@subeb.benuestate.gov.ng">
                  info@subeb.benuestate.gov.ng
                </a>
                <br />
                <a href="tel:+2348030000000">+234 803 000 0000</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container bottom-inner">
          <p className="copyright">
            © {year} State Universal Basic Education Board (SUBEB) – Benue State
            Government
          </p>

          <div className="footer-legal-links">
            <a href="#">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#">Terms of Use</a>
            <span className="separator">•</span>
            <a href="#">Accessibility Statement</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
