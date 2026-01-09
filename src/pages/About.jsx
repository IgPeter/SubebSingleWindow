import "../styles/about.css";

function AboutUs() {
  return (
    <section className="about-subeb">
      <div className="about-container">
        <h2>About SUBEB</h2>

        <p className="about-intro">
          The State Universal Basic Education Board (SUBEB) is the government
          agency responsible for the administration, management, and development
          of basic education across the state. Our mission is to ensure
          accessible, high-quality, and well-managed basic education for every
          child.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h3>🎯 Our Mission</h3>
            <p>
              To provide effective management, coordination, and supervision of
              basic education in the state through transparent systems,
              data-driven decision-making, and continuous improvement of school
              infrastructure, staffing, and learning outcomes.
            </p>
          </div>

          <div className="about-card">
            <h3>👁️ Our Vision</h3>
            <p>
              To build a strong, efficient, and technology-driven basic
              education system that ensures every child has access to quality
              education in a safe and supportive learning environment.
            </p>
          </div>

          <div className="about-card">
            <h3>⚙️ What We Do</h3>
            <ul>
              <li>Manage and deploy teaching staff across public schools</li>
              <li>Oversee school infrastructure and facilities</li>
              <li>Collect and manage educational data statewide</li>
              <li>Monitor staff attendance and performance</li>
              <li>Coordinate education policies and programs</li>
            </ul>
          </div>

          <div className="about-card">
            <h3>💻 Digital Transformation</h3>
            <p>
              SUBEB is building a unified digital ecosystem that includes tools
              for staff deployment, school data capture, attendance monitoring,
              and information management. These systems improve transparency,
              efficiency, and accountability across the education sector.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
