const { read, utils } = require('xlsx');
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../public/files/Forecasting_Of_Enrollment_Subeb.xlsx');
const data = fs.readFileSync(file);
const wb = read(data, { type: 'buffer', cellDates: true });
const ws = wb.Sheets[wb.SheetNames[0]];
const aoa = utils.sheet_to_json(ws, { header: 1, defval: '' });
console.log('sheet:', wb.SheetNames[0]);
console.log('rows:', aoa.length, 'cols:', aoa[0]?.length);
for (let i = 0; i < Math.min(60, aoa.length); i += 1) {
  const row = aoa[i] || [];
  console.log(
    `${i + 1} | ${row.map((c) => String(c).replace(/\s+/g, ' ').trim()).join(' | ')}`
  );
}
console.log('merges:', JSON.stringify(ws['!merges'] || [], null, 2));
