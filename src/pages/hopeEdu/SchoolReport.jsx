import { useEffect, useMemo, useState } from "react";
import { read, utils } from "xlsx";
import MainLayout from "../../components/layout/MainLayout";
import "../../styles/hopeedu.css";

const excelFiles = [
  {
    key: "primary",
    title: "Primary School Enrollment Report",
    fileName: "pri_sch_enrolement.xlsx",
    description: "Primary school enrollment data for Benue State.",
  },
  {
    key: "ube",
    title: "Ube Jss Enrollment Report",
    fileName: "ube_jss_enrolment.xlsx",
    description: "Junior secondary school enrollment data for Benue State.",
  },
];

const rowsPerPage = 50;
const columnsPerPage = 50;

const getCellText = (value) => {
  if (value === null || value === undefined) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toLocaleDateString("en-GB");
  }
  return String(value).replace(/\r\n/g, " ").trim();
};

const trimEmptyTail = (row) => {
  const trimmed = [...row];
  while (trimmed.length && String(trimmed[trimmed.length - 1] || "").trim() === "") {
    trimmed.pop();
  }
  return trimmed;
};

const parseSheetData = (rows) => {
  const cleanedRows = rows.map((row) => (Array.isArray(row) ? row.map((cell) => getCellText(cell)) : [getCellText(row)]));
  const nonEmptyRows = cleanedRows.filter((row) => row.some((cell) => String(cell).trim()));

  if (!nonEmptyRows.length) {
    return { headerRow: [], dataRows: [] };
  }

  const headerRow = trimEmptyTail(nonEmptyRows[0]);
  const dataRows = nonEmptyRows.slice(1).map((row) => {
    const cells = Array.isArray(row) ? row : [row];
    const trimmedRow = trimEmptyTail(cells);
    if (trimmedRow.length >= headerRow.length) {
      return trimmedRow.slice(0, headerRow.length);
    }
    return [...trimmedRow, ...Array(headerRow.length - trimmedRow.length).fill("")];
  });
  return { headerRow, dataRows };
};

const formatCellValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return String(value);
};

export default function SchoolReport() {
  const [selectedFileKey, setSelectedFileKey] = useState(excelFiles[0].key);
  const [loadedSheets, setLoadedSheets] = useState({});
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [sheetPreviewHtml, setSheetPreviewHtml] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [columnPage, setColumnPage] = useState(1);

  const selectedFile = excelFiles.find((file) => file.key === selectedFileKey) || excelFiles[0];

  useEffect(() => {
    let active = true;
    const loadWorkbook = async () => {
      try {
        setIsLoading(true);
        setError("");
        setLoadedSheets({});
        setSheetNames([]);
        setSelectedSheet("");
        setSheetPreviewHtml("");
        setCurrentPage(1);
        setColumnPage(1);

        const response = await fetch(`${import.meta.env.BASE_URL}files/${selectedFile.fileName}`);
        if (!response.ok) {
          throw new Error("Unable to load workbook.");
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = read(arrayBuffer, { type: "array", cellDates: true });
        const parsedSheets = {};

        workbook.SheetNames.forEach((name) => {
          parsedSheets[name] = utils.sheet_to_json(workbook.Sheets[name], {
            header: 1,
            defval: "",
            raw: false,
            dateNF: "yyyy-mm-dd",
          });
        });

        if (!active) return;

        setLoadedSheets(parsedSheets);
        setSheetNames(workbook.SheetNames);
        setSelectedSheet(workbook.SheetNames[0] || "");
      } catch (err) {
        console.error(err);
        if (active) setError("The selected report could not be loaded.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadWorkbook();

    return () => {
      active = false;
    };
  }, [selectedFileKey]);

  useEffect(() => {
    setCurrentPage(1);
    setColumnPage(1);
  }, [selectedSheet, selectedFileKey]);

  const currentRows = selectedSheet ? loadedSheets[selectedSheet] || [] : [];
  const { headerRow, dataRows } = useMemo(() => parseSheetData(currentRows), [currentRows]);
  const totalRows = dataRows.length;
  const totalColumns = headerRow.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const columnPageCount = Math.max(1, Math.ceil(totalColumns / columnsPerPage));
  const currentPageSafe = Math.min(Math.max(currentPage, 1), pageCount);
  const currentColumnPageSafe = Math.min(Math.max(columnPage, 1), columnPageCount);
  const visibleColumns = headerRow.slice((currentColumnPageSafe - 1) * columnsPerPage, currentColumnPageSafe * columnsPerPage);
  const visibleRowData = dataRows.map((row) => row.slice((currentColumnPageSafe - 1) * columnsPerPage, currentColumnPageSafe * columnsPerPage));
  const pageRows = visibleRowData.slice((currentPageSafe - 1) * rowsPerPage, currentPageSafe * rowsPerPage);
  const startRowIndex = totalRows === 0 ? 0 : (currentPageSafe - 1) * rowsPerPage + 1;
  const endRowIndex = startRowIndex + pageRows.length - 1;

  return (
    <MainLayout>
      <section className="hopeedu-page">
        <div className="hopeedu-hero">
          <div className="hopeedu-badge">HOPE-EDU • School Report</div>
          <h1>Benue SUBEB School Report</h1>
        </div>

        <div className="hopeedu-report-shell">
          <div className="hopeedu-report-list">
            {excelFiles.map((file) => (
              <button
                key={file.key}
                type="button"
                className={`hopeedu-report-card ${file.key === selectedFileKey ? "active" : ""}`}
                onClick={() => setSelectedFileKey(file.key)}
              >
                <div>
                  <div className="hopeedu-report-card-title">{file.title}</div>
                  <p className="hopeedu-report-card-note">{file.description}</p>
                </div>
                <span>{file.key === selectedFileKey ? "Selected" : "Open"}</span>
              </button>
            ))}
          </div>

          {isLoading && <div className="hopeedu-state">Loading report…</div>}
          {error && <div className="hopeedu-state hopeedu-state-error">{error}</div>}

          {!isLoading && !error && selectedSheet && (
            <div className="hopeedu-file-panel">
              <div className="hopeedu-file-header">
                <div>
                  <h2 className="hopeedu-file-title">{selectedFile.title}</h2>
                  <p className="hopeedu-file-meta-secondary">Sheet: {selectedSheet}</p>
                </div>
              </div>

              {sheetNames.length > 1 && (
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

              <div className="hopeedu-table-grid-info">
                <span>{totalRows.toLocaleString()} rows</span>
                <span>{totalColumns} columns</span>
              </div>

              <div className="hopeedu-table-wrap">
                <table className="hopeedu-table">
                  <thead>
                    <tr>
                      {visibleColumns.map((cell, cellIndex) => (
                        <th key={`header-${cellIndex}`}>{cell || ""}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row, rowIndex) => (
                      <tr key={`${selectedSheet}-${currentPageSafe}-${rowIndex}`}>
                        {visibleColumns.map((_, cellIndex) => (
                          <td key={`${rowIndex}-${cellIndex}`}>{formatCellValue(row[cellIndex] ?? "")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="hopeedu-column-pagination">
                <p className="hopeedu-column-note">
                  Showing columns {Math.min((currentColumnPageSafe - 1) * columnsPerPage + 1, totalColumns)}-{Math.min(currentColumnPageSafe * columnsPerPage, totalColumns)} of {totalColumns}
                </p>
                <div className="hopeedu-column-controls">
                  <button
                    type="button"
                    className="hopeedu-column-button"
                    disabled={currentColumnPageSafe === 1}
                    onClick={() => setColumnPage((current) => Math.max(current - 1, 1))}
                  >
                    Previous columns
                  </button>
                  <button
                    type="button"
                    className="hopeedu-column-button"
                    disabled={currentColumnPageSafe === columnPageCount}
                    onClick={() => setColumnPage((current) => Math.min(current + 1, columnPageCount))}
                  >
                    Next columns
                  </button>
                </div>
              </div>

              <div className="hopeedu-table-footer">
                <div className="hopeedu-table-summary">
                  Showing {startRowIndex}-{endRowIndex} of {totalRows.toLocaleString()} rows
                </div>
                <div className="hopeedu-pagination-bar">
                  <button
                    type="button"
                    className="hopeedu-pagination-button"
                    disabled={currentPageSafe === 1}
                    onClick={() => setCurrentPage((current) => Math.max(current - 1, 1))}
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
                    onClick={() => setCurrentPage((current) => Math.min(current + 1, pageCount))}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !error && selectedSheet && dataRows.length === 0 && (
            <div className="hopeedu-state">No data available in this sheet.</div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
