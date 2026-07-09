import XLSX from 'xlsx';
import path from 'path';
const workbookPath = path.join(process.cwd(), 'public', 'files', 'Forecasting_Of_Enrollment_Subeb.xlsx');
const workbook = XLSX.readFile(workbookPath, { cellDates: true });
console.log('Sheets:', workbook.SheetNames);
const wsName = workbook.SheetNames[0];
const ws = workbook.Sheets[wsName];
const range = XLSX.utils.decode_range(ws['!ref']);
for (let R = 0; R <= Math.min(range.e.r, 80); ++R) {
  const row = [];
  for (let C = 0; C <= Math.min(range.e.c, 30); ++C) {
    const cell = ws[XLSX.utils.encode_cell({r:R,c:C})];
    row.push(cell ? cell.v : null);
  }
  console.log(`${R+1}:`, JSON.stringify(row));
}
