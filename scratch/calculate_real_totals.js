import fs from 'fs';

const file = fs.readFileSync('parse_expenses.mjs', 'utf8');
const textMatch = file.match(/const text = `([\s\S]+?)`;/);
const rawText = textMatch[1];
const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

let sumOrdinary = 0;
let sumTotalToPay = 0;

for (const line of lines) {
  const tokens = line.split(/\s+/);
  if (tokens.length < 5) continue;
  
  // Let's find the coefficient token
  // It is a token like '0,36', '3,52', '1,42', etc. (usually the one right before the ordinary expense)
  let coefIdx = -1;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].match(/^\d+,\d{2}$/)) {
      const val = parseFloat(tokens[i].replace(',', '.'));
      if (val > 0.1 && val < 10) {
        coefIdx = i;
        break;
      }
    }
  }

  if (coefIdx !== -1) {
    const ordVal = tokens[coefIdx + 1];
    const totVal = tokens[tokens.length - 1];
    sumOrdinary += parseFloat(ordVal.replace(/\./g, '').replace(',', '.'));
    sumTotalToPay += parseFloat(totVal.replace(/\./g, '').replace(',', '.'));
  }
}

console.log('Sum Ordinary:', sumOrdinary);
console.log('Sum Total to Pay:', sumTotalToPay);
