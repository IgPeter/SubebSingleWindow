import React from "react";
import "../../styles/sections.css"; // Define styles for this component

function NewsActivity() {
  return (
    <div className="news-activity">
      {/* News and Events Section */}
      {/* News & Events Section */}
      <section className="news-events">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-heading">News & Events</h2>
            <p className="section-intro">
              Stay updated with the latest announcements, workshops, school
              visits, policy updates, award ceremonies and important dates in
              basic education.
            </p>
          </div>

          <div className="empty-state">
            <div className="empty-icon">📰</div>
            <h3>No news or events yet</h3>
            <p>There are currently no upcoming or recent events to display.</p>

            <button className="add-button">
              <span className="button-icon">+</span>
              Add News / Event
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NewsActivity;
