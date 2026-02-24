import React from "react";
import "../../styles/sections.css"; // Define styles for this component

function SportingActivity() {
  return (
    <div className="sport-activity">
      {/* Sporting Activities Section */}
      <section className="sporting-activities">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-heading">Sporting Activities</h2>
            <p className="section-intro">
              Track ongoing and past sporting events, inter-school competitions,
              talent showcases and physical education programs across Benue
              State.
            </p>
          </div>

          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <h3>Nothing to show yet</h3>
            <p>No sporting activities have been recorded at this time.</p>

            <button className="add-button">
              <span className="button-icon">+</span>
              Add Sport Activity
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SportingActivity;
