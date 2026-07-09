import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workbookPath = path.join(__dirname, 'public', 'files', 'pri_sch_enrolement.xlsx');
const workbook = XLSX.readFile(workbookPath, { cellDates: true });
const ws = workbook.Sheets[workbook.SheetNames[0]];
const sheetJson = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false, dateNF: 'yyyy-mm-dd' });
console.log('headerRow', JSON.stringify(sheetJson[0]));
for (let i = 0; i < Math.min(5, sheetJson.length); i++) {
  console.log(i + 1, JSON.stringify(sheetJson[i]));
}
const getCellText = (value) => {
  if (value === null || value === undefined) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toLocaleDateString('en-GB');
  return String(value).replace(/\r\n/g, ' ').trim();
};
const trimmed = sheetJson.map((row) => Array.isArray(row) ? row.map(getCellText) : [getCellText(row)]);
console.log('trimmed header', JSON.stringify(trimmed[0]));
for (let i = 0; i < Math.min(5, trimmed.length); i++) {
  console.log('trim', i + 1, JSON.stringify(trimmed[i]));
}
