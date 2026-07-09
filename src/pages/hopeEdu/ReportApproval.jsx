import { useRef, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import "../../styles/hopeedu.css";

const pdfFileName = "ADOPTION-ON-CONSOLIDATED-WORKPLAN.pdf";
const pdfUrl = `${import.meta.env.BASE_URL}files/${pdfFileName}`;

function ReportApproval() {
  const [showViewer, setShowViewer] = useState(false);
  const [viewerError, setViewerError] = useState(false);
  const pdfFrameRef = useRef(null);

  const handleViewClick = () => {
    setViewerError(false);
    setShowViewer(true);
  };

  const handleDownload = () => {
    const anchor = document.createElement("a");
    anchor.href = pdfUrl;
    anchor.download = pdfFileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handlePrint = () => {
    if (pdfFrameRef.current?.contentWindow?.print) {
      pdfFrameRef.current.contentWindow.focus();
      pdfFrameRef.current.contentWindow.print();
      return;
    }

    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <MainLayout>
      <section className="hopeedu-page">
        <div className="hopeedu-hero">
          <div className="hopeedu-badge">Report Approval</div>
          <h1>Adoption Workplan Preview</h1>
          <p>
            View, print, or download the approved adoption workplan document. The PDF viewer loads the file directly inside the HOPE-EDU interface for a smooth review experience.
          </p>
        </div>

        <div className="hopeedu-report-shell">
          <div className="hopeedu-action-bar">
            <div>
              <p className="hopeedu-file-meta">Approved adoption workplan</p>
              <p className="hopeedu-file-meta-secondary">{pdfFileName}</p>
            </div>

            <div className="hopeedu-action-group">
              <button type="button" className="hopeedu-action-button hopeedu-view-button" onClick={handleViewClick}>
                View PDF
              </button>
              <button type="button" className="hopeedu-action-button" onClick={handlePrint}>
                Print
              </button>
              <button type="button" className="hopeedu-action-button hopeedu-download-button" onClick={handleDownload}>
                Download
              </button>
            </div>
          </div>

          {showViewer ? (
            <div className="hopeedu-pdf-panel">
              <iframe
                ref={pdfFrameRef}
                src={pdfUrl}
                title="Adoption Workplan PDF"
                className="hopeedu-pdf-preview"
                onError={() => setViewerError(true)}
              />

              {viewerError && (
                <div className="hopeedu-state hopeedu-state-error">
                  We could not load the PDF preview. Please use Download or open the document in a new tab.
                </div>
              )}
            </div>
          ) : (
            <div className="hopeedu-state">Click �View PDF� to preview the adoption workplan in the page.</div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default ReportApproval;
