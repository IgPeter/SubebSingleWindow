// pages/About.jsx  or wherever AboutUs lives
import React from "react";
import "../styles/about.css"; // we'll define this below

function AboutUs() {
  return (
    <section className="about-subeb">
      <div className="about-container">
        <div className="about-header">
          <h2>About SUBEB</h2>
          <p className="about-intro">
            The State Universal Basic Education Board (SUBEB) is committed to
            delivering accessible, equitable, and high-quality basic education
            to every child in Benue State through effective management,
            transparency, and innovative technology.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
