import XLSX from 'xlsx';
import path from 'path';
const workbookPath = path.join(process.cwd(), 'public', 'files', 'Forecasting_Of_Enrollment_Subeb.xlsx');
const workbook = XLSX.readFile(workbookPath, { cellDates: true });
const sheetName = workbook.SheetNames[0];
const ws = workbook.Sheets[sheetName];
const rowsToClear = [30, 31, 32, 33, 34, 35]; // zero-based index for rows 31-36
for (const r of rowsToClear) {
  for (let c = 0; c <= 25; c++) {
    const cellRef = XLSX.utils.encode_cell({ r, c });
    if (ws[cellRef]) {
      delete ws[cellRef];
    }
  }
}
XLSX.writeFile(workbook, workbookPath, { bookType: 'xlsx' });
console.log('Cleared note rows 31-36 in', workbookPath);