import MainLayout from "../../components/layout/MainLayout";
import "../../styles/hopeedu.css";

export default function Budgetting() {
  return (
    <MainLayout>
      <section className="hopeedu-page">
        <div className="hopeedu-hero">
          <div className="hopeedu-badge">HOPE-EDU • Budget Planning</div>
          <h1>Benue SUBEB Budget Planning Report</h1>
        </div>

        <div className="hopeedu-budget-panel">
          <div className="hopeedu-budget-header-row">
            <div className="hopeedu-budget-copy">
              <h2 className="hopeedu-budget-title">Download Benue SUBEB Beap 2025 Report</h2>
              <p className="hopeedu-budget-description">
                Basic Education Action Plan - It is the strategic planning, budgeting, and accountability framework utilized by the Universal Basic Education Commission (UBEC) and state boards to access matching grants. Designed to promote needs-based planning.
              </p>
            </div>

            <a
              className="hopeedu-budget-download"
              href={`${import.meta.env.BASE_URL}files/BENUE SUBEB_BEAP_2025.xlsx`}
              download="BENUE_SUBEB_BEAP_2025.xlsx"
              aria-label="Download BENUE SUBEB BEAP 2025"
            >
              ⬇
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
