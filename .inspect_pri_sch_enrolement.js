import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workbookPath = path.join(__dirname, 'public', 'files', 'pri_sch_enrolement_new.xlsx');
const workbook = XLSX.readFile(workbookPath, { cellDates: true });
console.log('Sheets:', workbook.SheetNames.join(', '));
const ws = workbook.Sheets[workbook.SheetNames[0]];
const range = XLSX.utils.decode_range(ws['!ref']);
for (let R = 0; R <= Math.min(range.e.r, 25); R++) {
  const row = [];
  for (let C = 0; C <= Math.min(range.e.c, 25); C++) {
    const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
    row.push(cell ? cell.v : null);
  }
  console.log(`${R + 1}: ${JSON.stringify(row)}`);
}
