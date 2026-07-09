import { useEffect, useMemo, useState } from "react";
import { read, utils } from "xlsx";
import MainLayout from "../../components/layout/MainLayout";
import "../../styles/hopeedu.css";

const excelFiles = [
  {
    key: "personnel",
    title: "Personnel List For All Teachers In The Basic Education Sector In Benue State",
    fileName: "Personnel_List_All-Teachers_Subeb.xlsx",
    description:
      "Comprehensive teacher personnel records for the basic education sector in Benue State.",
  },
  {
    key: "forecasting",
    title: "Forcasting Of Enrollment And Number Of Teachers",
    fileName: "Forecasting_Of_Enrollment_Subeb.xlsx",
    description:
      "Projected enrollment and teacher workforce forecasts for Benue SUBEB.",
  },
];

const rowsPerPage = 50;

const HEADER_HINTS = [
  "s/n",
  "activity",
  "focus",
  "objective",
  "quantity",
  "expected output",
  "target group",
  "timeline",
  "unit cost",
  "total cost",
  "implementation strategy",
  "resource mapping",
  "funding gap",
  "remarks",
  "name",
  "date of birth",
  "date",
  "lga",
  "location",
  "gps",
  "item description",
  "cost items",
  "pillar",
  "description",
  "percentage",
];

const formatDateValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toLocaleDateString("en-GB");
  }

  if (typeof value === "number") {
    const excelDate = new Date(Date.UTC(1899, 11, 30) + value * 86400000);
    return excelDate.toLocaleDateString("en-GB");
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return "—";
    }

    const isoMatch = trimmedValue.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }

    const parsedDate = new Date(trimmedValue);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleDateString("en-GB");
    }

    return trimmedValue;
  }

  return String(value);
};

const getCellText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toLocaleDateString("en-GB");
  }

  if (typeof value === "number") {
    return String(value);
  }

  return String(value).replace(/\r\n/g, " ").trim();
};

const normalizeText = (value) => String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");

const isHeaderLikeRow = (row) => {
  const cells = row.map((cell) => getCellText(cell)).filter(Boolean);
  if (cells.length < 2) {
    return false;
  }

  const normalizedText = cells.join(" ").toLowerCase();
  const matchedHints = HEADER_HINTS.filter((hint) => normalizedText.includes(hint)).length;
  const hasSerialMarker = cells.some((cell) => /^s\/n$/i.test(cell) || /^serial number$/i.test(cell));
  const hasTableTerm = cells.some((cell) => /activity|focus|objective|quantity|expected|target|timeline|cost|implementation|resource|funding|remarks|name|lga|location|gps|pillar|description|percentage/i.test(cell));

  return matchedHints >= 2 || (hasSerialMarker && hasTableTerm);
};

const extractForecastingNotes = (rows) => {
  const noteLines = [];
  const tableRows = [];
  let isNoteSection = false;

  rows.forEach((row) => {
    const normalizedRow = row.map((value) => String(value || "").trim()).join(" ");
    const secondCell = String(row[1] || "").trim();
    const isNoteHeader = /^note\*/i.test(normalizedRow) || /^column [a-z]/i.test(secondCell);

    if (isNoteHeader || isNoteSection) {
      isNoteSection = true;
      const noteText = row.filter((cell) => String(cell || "").trim()).join(" ");
      if (noteText) {
        noteLines.push(noteText);
      }
      return;
    }

    tableRows.push(row);
  });

  return { tableRows, noteLines };
};

const formatCellValue = (value, columnIndex, headerRow = []) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const headerCell = headerRow[columnIndex];
  const normalizedHeader = String(headerCell || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  if (normalizedHeader === "date_of_birth" || normalizedHeader === "appt_date") {
    return formatDateValue(value);
  }

  return String(value);
};

const parseSheetLayout = (rows, sheetName = "", fileKey = "") => {
  if (!rows || !rows.length) {
    return { titleLines: [], headerRow: [], dataRows: [], displayMode: "table" };
  }

  const cleanedRows = rows.map((row) => (Array.isArray(row) ? row.map((cell) => getCellText(cell)) : [getCellText(row)]));
  const nonEmptyRows = cleanedRows.filter((row) => row.some((cell) => cell.trim()));

  let headerIndex = -1;
  for (let index = 0; index < nonEmptyRows.length; index += 1) {
    if (isHeaderLikeRow(nonEmptyRows[index])) {
      headerIndex = index;
      break;
    }
  }

  if (headerIndex === -1) {
    headerIndex = 0;
  }

  const titleLines = nonEmptyRows
    .slice(0, headerIndex)
    .map((row) => row.filter(Boolean).join(" • "))
    .filter((text) => text && !/click to return|click to move|review the list below|please make/i.test(text));

  const headerRow = nonEmptyRows[headerIndex] || [];
  let bodyRows = nonEmptyRows
    .slice(headerIndex + 1)
    .filter((row) => row.some((cell) => cell.trim()));

  let noteLines = [];
  if (fileKey === "forecasting") {
    const result = extractForecastingNotes(bodyRows);
    bodyRows = result.tableRows;
    noteLines = result.noteLines;
  }

  const dataRows = bodyRows.map((row) => row.map((cell) => getCellText(cell)));

  let displayMode = "table";
  const sheetLabel = `${sheetName} ${fileKey}`.toLowerCase();
  if (fileKey === "beap" && (/total budget summary/i.test(sheetName) || /activity costing/i.test(sheetName) || /unit cost/i.test(sheetName))) {
    displayMode = "summary";
  } else if (fileKey === "beap" && headerRow.some((cell) => /cost items/i.test(cell) && /unit cost/i.test(cell))) {
    displayMode = "summary";
  } else if (fileKey === "forecasting" && titleLines.length > 0) {
    displayMode = "table";
  } else if (sheetLabel.includes("summary") || sheetLabel.includes("costing") || sheetLabel.includes("unit cost")) {
    displayMode = "summary";
  }

  if (displayMode === "summary") {
    return {
      titleLines,
      headerRow: ["Item", "Details"],
      dataRows: dataRows.map((row) => {
        const firstCell = row[0] || "";
        const detailText = row.slice(1).filter(Boolean).join(" • ");
        return [firstCell, detailText];
      }),
      noteLines,
      displayMode,
    };
  }

  return { titleLines, headerRow, dataRows, noteLines, displayMode };
};

function TeacherAssessmentPage() {
  const [selectedFileKey, setSelectedFileKey] = useState(excelFiles[0].key);
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const [loadedSheets, setLoadedSheets] = useState({});
  const [sheetHtmlMap, setSheetHtmlMap] = useState({});
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const selectedFile = excelFiles.find((file) => file.key === selectedFileKey) || excelFiles[0];

  useEffect(() => {
    let active = true;
    const loadWorkbook = async () => {
      try {
        setIsLoading(true);
        setError("");
        setLoadedSheets({});
        setSheetHtmlMap({});
        setSheetNames([]);
        setSelectedSheet("");

        const response = await fetch(`${import.meta.env.BASE_URL}files/${selectedFile.fileName}`);
        if (!response.ok) {
          throw new Error("Unable to load the workbook.");
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = read(arrayBuffer, { type: "array", cellDates: true });

        const parsedSheets = {};
        const parsedHtml = {};
        workbook.SheetNames.forEach((name) => {
          parsedSheets[name] = utils.sheet_to_json(workbook.Sheets[name], {
            header: 1,
            defval: "",
            raw: false,
            dateNF: "yyyy-mm-dd",
          });

          const htmlOptions = {
            editable: false,
            id: `sheet-${name.replace(/[^a-z0-9]/gi, "_")}`,
          };

          if (selectedFile.key === "forecasting") {
            htmlOptions.range = { s: { r: 0, c: 0 }, e: { r: 28, c: 25 } };
          }

          parsedHtml[name] = utils.sheet_to_html(workbook.Sheets[name], htmlOptions);
        });

        if (!active) {
          return;
        }

        setLoadedSheets(parsedSheets);
        setSheetHtmlMap(parsedHtml);
        setSheetNames(workbook.SheetNames);
        setSelectedSheet(workbook.SheetNames[0] || "");
      } catch (err) {
        console.error(err);
        if (active) {
          setError("The selected workbook could not be loaded right now.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadWorkbook();
    setCurrentPage(1);

    return () => {
      active = false;
    };
  }, [selectedFileKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSheet]);

  const currentRows = selectedSheet ? loadedSheets[selectedSheet] || [] : [];
  const sheetPreviewHtml = selectedSheet ? sheetHtmlMap[selectedSheet] || "" : "";
  const { titleLines, headerRow, dataRows, noteLines, displayMode } = useMemo(
    () => parseSheetLayout(currentRows, selectedSheet, selectedFile.key),
    [currentRows, selectedSheet, selectedFile.key]
  );

  const totalRows = dataRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const currentPageSafe = Math.min(Math.max(currentPage, 1), pageCount);
  const pageRows = dataRows.slice((currentPageSafe - 1) * rowsPerPage, currentPageSafe * rowsPerPage);
  const startRowIndex = totalRows === 0 ? 0 : (currentPageSafe - 1) * rowsPerPage + 1;
  const endRowIndex = startRowIndex + pageRows.length - 1;
  const isMultipleSheets = sheetNames.length > 1;
  const showHtmlPreview = selectedFile.key === "forecasting" ? Boolean(sheetPreviewHtml) : Boolean(sheetPreviewHtml) && totalRows <= 50;

  return (
    <MainLayout>
      <section className="hopeedu-page">
        <div className="hopeedu-hero">
          <div className="hopeedu-badge">HOPE-EDU • Teacher Assessment</div>
          <h1>Benue SUBEB Teacher Comprehensive Report</h1>
          <p className="hopeedu-hero-subtitle">Click to display teachers assessment report.</p>
        </div>

        <div className="hopeedu-report-shell">
          <div className="hopeedu-folder-card">
            <button
              type="button"
              className="hopeedu-folder-header"
              onClick={() => setIsFolderOpen((current) => !current)}
              aria-expanded={isFolderOpen}
            >
              <div className="hopeedu-folder-header-left">
                <div>
                  <p className="hopeedu-folder-description">
                    Select one of the available teacher assessment reports below.
                  </p>
                </div>
              </div>
              <span className="hopeedu-folder-toggle">{isFolderOpen ? "Hide" : "Show"}</span>
            </button>

            {isFolderOpen && (
              <div className="hopeedu-folder-list">
                {excelFiles.map((file) => (
                  <button
                    key={file.key}
                    type="button"
                    className={`hopeedu-folder-row ${file.key === selectedFileKey ? "active" : ""}`}
                    onClick={() => setSelectedFileKey(file.key)}
                    aria-pressed={file.key === selectedFileKey}
                  >
                    <div>
                      <div>
                        <div className="hopeedu-folder-row-title">{file.title}</div>
                        <p className="hopeedu-folder-row-note">{file.description}</p>
                      </div>
                    </div>
                    <span className="hopeedu-folder-row-action">{file.key === selectedFileKey ? "Selected" : "Open"}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {!isLoading && !error && selectedFile && (
            <div className="hopeedu-file-meta">
              <p className="hopeedu-file-meta-secondary">Current report: {selectedFile.fileName}</p>
            </div>
          )}

          {isLoading && <div className="hopeedu-state">Loading report…</div>}

          {error && !isLoading && <div className="hopeedu-state hopeedu-state-error">{error}</div>}

          {!isLoading && !error && selectedSheet && (
            <div className="hopeedu-file-panel">
              <div className="hopeedu-file-header">
                <div>
                  <h2 className="hopeedu-file-title">{selectedFile.title}</h2>
                  <p className="hopeedu-file-meta-secondary">
                    Sheet: {selectedSheet} • {totalRows.toLocaleString()} rows
                  </p>
                </div>
                <div className="hopeedu-action-group">
                  <a
                    className="hopeedu-action-button hopeedu-download-button"
                    href={`${import.meta.env.BASE_URL}files/${selectedFile.fileName}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download Report
                  </a>
                </div>
              </div>

              {isMultipleSheets && (
                <div className="hopeedu-sheet-tabs">
                  {sheetNames.map((name) => (
                    <button
                      key={name}
                      type="button"
                      className={`hopeedu-sheet-tab ${name === selectedSheet ? "active" : ""}`}
                      onClick={() => setSelectedSheet(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}

              {titleLines.length > 0 && (
                <div className="hopeedu-table-title">{titleLines.join(" • ")}</div>
              )}

              {showHtmlPreview ? (
                <>
                  <div className="hopeedu-sheet-preview-shell">
                    <div
                      className="hopeedu-sheet-html-wrap"
                      dangerouslySetInnerHTML={{ __html: sheetPreviewHtml }}
                    />
                  </div>
                  {noteLines && noteLines.length > 0 && (
                    <div className="hopeedu-sheet-notes">
                      <h3>Worksheet notes</h3>
                      {noteLines.map((note, noteIndex) => (
                        <p key={`note-${noteIndex}`}>{note}</p>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {sheetPreviewHtml && !showHtmlPreview && (
                    <div className="hopeedu-state">
                      Spreadsheet preview suppressed for large sheet. Use the Download button to view the full workbook layout.
                    </div>
                  )}
                  <div className="hopeedu-table-footer">
                    <div className="hopeedu-table-summary">
                      Showing {startRowIndex}-{endRowIndex} of {totalRows.toLocaleString()} rows
                    </div>
                    <div className="hopeedu-pagination-bar">
                      <button
                        type="button"
                        className="hopeedu-pagination-button"
                        disabled={currentPageSafe === 1}
                        onClick={() => setCurrentPage(currentPageSafe - 1)}
                      >
                        Previous
                      </button>
                      <span className="hopeedu-pagination-info">
                        Page {currentPageSafe} of {pageCount}
                      </span>
                      <button
                        type="button"
                        className="hopeedu-pagination-button"
                        disabled={currentPageSafe === pageCount}
                        onClick={() => setCurrentPage(currentPageSafe + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  <div className="hopeedu-table-wrap">
                    <table className="hopeedu-table">
                      <thead>
                        <tr>
                          {headerRow.map((cell, cellIndex) => (
                            <th key={`header-${cellIndex}`}>{String(cell)}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pageRows.map((row, rowIndex) => (
                          <tr key={`${selectedSheet}-${currentPageSafe}-${rowIndex}`}>
                            {row.map((cell, cellIndex) => (
                              <td key={`${rowIndex}-${cellIndex}`}>
                                {displayMode === "summary" ? String(cell || "—") : formatCellValue(cell, cellIndex, headerRow)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {noteLines && noteLines.length > 0 && (
                    <div className="hopeedu-sheet-notes">
                      <h3 className="hopeedu-sheet-notes-title">Worksheet notes</h3>
                      {noteLines.map((note, noteIndex) => (
                        <p key={`note-${noteIndex}`}>{note}</p>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {!isLoading && !error && selectedSheet && totalRows === 0 && (
            <div className="hopeedu-state">No spreadsheet rows are available in this sheet.</div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default TeacherAssessmentPage;
