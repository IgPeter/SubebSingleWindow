// components/Ui/MainUi.jsx
import React from "react";
import dletterImg from "../../assets/images/dletter.png";
import cdImage from "../../assets/images/cd_subeb.png";
import AboutUs from "../../pages/About"; // keep or move to route later
import bglessLogo from "../../assets/images/bgless-subeb-logo.png";
import slideImage1 from "../../assets/images/subeb_act_hero.png";
import slideImage2 from "../../assets/images/subeb_efficient_teacher_deployment.png";
import screeningAppImage from "../../assets/images/screeningappimage.png";
import employmentLetterAppImage from "../../assets/images/employmentletterappimage.png";
import bsimsAppImage from "../../assets/images/bsimsimage.png";

const apps = [
  {
    id: 1,
    name: "Screening Application",
    description:
      "Screen staffs faster and efficiently for employment. This apps ensures the eligibility of staffs",
    image: screeningAppImage,
    link: "https://screening.benuesubeb.org",
  },
  {
    id: 2,
    name: "Employment Letter Generator",
    description:
      "Generate and print employment letters for teachers with precision and efficiency.",
    image: employmentLetterAppImage,
    link: "https://bselg.benuesubeb.org",
  },
  {
    id: 3,
    name: "Deployment Letter Generator",
    description:
      "Generate and print deployment letters for teachers with precision and efficiency.",
    image: dletterImg,
    link: "https://bsdlg.benuesubeb.org",
  },
  {
    id: 4,
    name: "Data Capture Tool",
    description:
      "Capture school, staff, and facility data digitally for seamless management and insights.",
    image: cdImage,
    link: "https://bsdc.benuesubeb.org",
  },
  ,
  /*{
    id: 3,
    name: "Staff Attendance",
    description:
      "Monitor staff attendance across schools in real-time to ensure accountability and productivity.",
    image: comingSoonImg,
    link: "https://your-attendance-link.co",
  }*/ {
    id: 5,
    name: "SCHOOL DATA APPLICATION",
    description:
      "Centralize and manage all SUBEB operations information for enhanced decision-making and transparency.",
    image: bsimsAppImage,
    link: "https://bsims.benuesubeb.org",
  },
  // Easily add more:
  // { id: 5, name: "...", description: "...", image: ..., link: "..." },
];

function MainUi() {
  return (
    <div className="main-ui-wrapper">
      {/* Hero Section – matches header energy */}
      <section className="hero">
        <div className="hero-slider">
          <input type="radio" name="slide" id="slide1" defaultChecked />
          <div
            className="slide"
            style={{ backgroundImage: `url(${slideImage1})` }}
          ></div>

          <input type="radio" name="slide" id="slide2" />
          <div
            className="slide"
            style={{ backgroundImage: `url(${slideImage2})` }}
          ></div>

          {/* Uncomment when you add slideImage3 */}
          {/* <input type="radio" name="slide" id="slide3" /> */}
          {/* <div className="slide" style={{ backgroundImage: `url(${slideImage3})` }}></div> */}
        </div>

        {/* Overlay wrapper – centers everything */}
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">WELOME TO BBEMIS</h1>

            <div className="hero-main-row">
              <p className="hero-subtitle">
                Benue State Basic Education Management Information System
              </p>
            </div>
          </div>
          <div className="hero-logo-wrapper">
            <img src={bglessLogo} alt="SUBEB Logo" className="hero-logo" />
          </div>
        </div>

        <div className="slider-dots">
          <label htmlFor="slide1" className="dot"></label>
          <label htmlFor="slide2" className="dot"></label>
          {/* <label htmlFor="slide3" className="dot"></label> */}
        </div>
      </section>

      {/* Ecosystem Section – main showcase */}
      <section id="apps" className="ecosystem">
        <div className="section-container">
          <h2 className="section-heading">SUBEB Digital Ecosystem</h2>
          <p className="section-intro">
            A growing suite of integrated applications designed to streamline
            administration, enhance transparency, improve data accuracy, and
            empower educators and administrators.
          </p>

          <div className="apps-grid">
            {apps.map((app) => (
              <div key={app.id} className="app-card">
                <div className="app-image-wrapper">
                  <img src={app.image} alt={app.name} className="app-image" />
                </div>
                <div className="app-content">
                  <h3 className="app-title">{app.name}</h3>
                  <p className="app-description">{app.description}</p>
                  <a
                    href={app.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-button"
                  >
                    Launch Application
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Footer-like section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <AboutUs />
        </div>
      </section>
    </div>
  );
}

export default MainUi;
