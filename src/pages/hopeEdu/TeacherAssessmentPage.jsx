import { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import MainLayout from "../../components/layout/MainLayout";
import "../../styles/hopeedu.css";

const reportWorkbook = `${import.meta.env.BASE_URL}files/updated_teachers_comprehensive_inform.xlsx`;

function TeacherAssessmentPage() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWorkbook = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(reportWorkbook);
        if (!response.ok) {
          throw new Error("Unable to load the workbook.");
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = read(arrayBuffer, { type: "array", cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });

        setRows(data);
      } catch (err) {
        console.error(err);
        setError("The teacher report could not be loaded right now.");
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkbook();
  }, []);

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

  return (
    <MainLayout>
      <section className="hopeedu-page">
        <div className="hopeedu-hero">
          <div className="hopeedu-badge">HOPE-EDU • Teacher Assessment</div>
          <h1>Benue SUBEB Teacher Comprehensive Report</h1>
          <p>
            Benue Subeb comprehensive teacher report.
          </p>
        </div>

        <div className="hopeedu-report-shell">
          {isLoading && <div className="hopeedu-state">Loading report…</div>}

          {error && !isLoading && <div className="hopeedu-state hopeedu-state-error">{error}</div>}

          {!isLoading && !error && rows.length > 0 && (
            <div className="hopeedu-table-wrap">
              <table className="hopeedu-table">
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={`${rowIndex}-${cellIndex}`}>
                          {formatCellValue(cell, cellIndex, rows[0] || [])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && !error && rows.length === 0 && (
            <div className="hopeedu-state">No data is available in the report yet.</div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default TeacherAssessmentPage;
