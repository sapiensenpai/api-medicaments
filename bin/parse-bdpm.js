const fs = require('fs');
const path = require('path');

const cisFile = path.join(__dirname, '../data/CIS_bdpm.txt');
const compoFile = path.join(__dirname, '../data/CIS_COMPO_bdpm.txt');
const output = path.join(__dirname, '../data/drug.json');

const drugs = {};

// STEP 1: Parse CIS_bdpm.txt — basic info
fs.readFileSync(cisFile, 'utf8')
  .split('\n')
  .forEach(line => {
    const [cis, name, pharmaForm, adminRoute, status] = line.split('\t');
    if (!cis) return;
    drugs[cis] = {
      cis,
      name,
      pharmaForm,
      adminRoute,
      status,
      components: []
    };
  });

// STEP 2: Parse CIS_COMPO_bdpm.txt — active substances
fs.readFileSync(compoFile, 'utf8')
  .split('\n')
  .forEach(line => {
    const [cis, codeSub, labelSub, dosage, refDosage, nature] = line.split('\t');
    if (!drugs[cis]) return;
    drugs[cis].components.push({ codeSub, labelSub, dosage, refDosage, nature });
  });

// STEP 3: Save as drug.json
fs.writeFileSync(output, JSON.stringify(Object.values(drugs), null, 2));
console.log(`✅ Saved ${Object.keys(drugs).length} medications to drug.json`);