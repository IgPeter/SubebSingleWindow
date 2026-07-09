import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workbookPath = path.join(__dirname, 'public', 'files', 'pri_sch_enrolement.xlsx');
const workbook = XLSX.readFile(workbookPath, { cellDates: true });
console.log('Sheets:', workbook.SheetNames);
const ws = workbook.Sheets[workbook.SheetNames[0]];
const range = XLSX.utils.decode_range(ws['!ref']);
const row = [];
for (let C = range.s.c; C <= range.e.c; C++) {
  const cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })];
  row.push(cell ? cell.v : null);
}
console.log('Header:', JSON.stringify(row));
