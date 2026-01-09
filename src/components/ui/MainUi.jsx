import React, { useState } from "react";
import dletterImg from "../../assets/images/dletter.png";
import cdImage from "../../assets/images/cd_subeb.png";
import comingSoonImg from "../../assets/images/coming_soon.png";
import AboutUs from "../../pages/About";

const apps = [
  {
    id: 1,
    name: "Deployment Letter Generator",
    description: "Generate and print deployment letters for teachers.",
    image: dletterImg,
    link: "https://your-deployment-app-link.com",
  },
  {
    id: 2,
    name: "Data Capture Tool",
    description: "Capture school, staff and facility data digitally.",
    image: cdImage,
    link: "https://your-data-capture-link.com",
  },
  {
    id: 3,
    name: "Staff Attendance",
    description: "Monitor staff attendance across schools.",
    image: comingSoonImg,
    link: "https://your-attendance-link.co",
  },
  {
    id: 4,
    name: "Subeb Information Management System",
    description: "Manage all information related to SUBEB operations.",
    image: comingSoonImg,
    link: "https://your-sims-link.com",
  },
];

function MainUi() {
  const [selectedApp, setSelectedApp] = useState(apps[0]);

  return (
    <div className="container">
      <div className="left-sidebar">
        <div className="first-content">
          <h2>State Universal Basic Education Board (SUBEB)</h2>
          <p>Digital ecosystem for managing schools, staff and operations.</p>
        </div>

        {/* app list section */}
        <div className="app-list-section">
          <h3 className="app-list-title">All Applications</h3>
          <div>
            {apps.map((app) => (
              <div
                key={app.id}
                className={`app-item ${
                  selectedApp.id === app.id ? "active" : ""
                }`}
                onClick={() => setSelectedApp(app)}
              >
                <h3>{app.name}</h3>
                <img
                  src={app.image}
                  alt={app.name}
                  width={"100%"}
                  height={"100%"}
                />
                <p>{app.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side bar and content display section */}
      <div className="content">
        <h1>{selectedApp.name}</h1>

        <img
          src={selectedApp.image}
          alt={selectedApp.name}
          width={"100%"}
          height={350}
        />

        <p className="app-description">{selectedApp.description}</p>

        <a
          href={selectedApp.link}
          target="_blank"
          rel="noopener noreferrer"
          className="open-button"
        >
          Open App
        </a>

        <AboutUs />
      </div>
      {/* End of sidebar container */}
    </div>
  );
}

export default MainUi;
