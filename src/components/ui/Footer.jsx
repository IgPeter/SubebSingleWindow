import React from "react";
import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="subeb-footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>SUBEB</h3>
          <p>
            State Universal Basic Education Board (SUBEB) is committed to
            improving the quality of basic education through effective
            management, transparency, and technology-driven solutions.
          </p>
        </div>

        <div className="footer-column">
          <h4>Our Systems</h4>
          <ul>
            <li>Deployment Letter Generator</li>
            <li>School Data Capture System</li>
            <li>Staff Attendance System</li>
            <li>Information Management System</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Core Focus</h4>
          <ul>
            <li>Teacher Management</li>
            <li>School Administration</li>
            <li>Education Data Management</li>
            <li>Operational Transparency</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {year} State Universal Basic Education Board (SUBEB). All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
