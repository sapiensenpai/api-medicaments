const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const cisFile = path.join(__dirname, '../data/CIS_bdpm.txt');
const compoFile = path.join(__dirname, '../data/CIS_COMPO_bdpm.txt');
const output = path.join(__dirname, '../data/drugs.json');

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

// STEP 3: Save as drugs.json
// fs.writeFileSync(output, JSON.stringify(Object.keys(drugs).map(key => drugs[key]), null, 2));
// console.log(`✅ Saved ${Object.keys(drugs).length} medications to drugs.json`);

// STEP 4: Parse CIS_RCP_bdpm.txt — RCP URLs
const rcpFile = path.join(__dirname, '../data/CIS_RCP_bdpm.txt');
const parseRCPs = async () => {
  if (!fs.existsSync(rcpFile)) return;
  const lines = fs.readFileSync(rcpFile, 'utf8').split('\n');

  for (const line of lines) {
    const [cis, url] = line.split('\t');
    if (!drugs[cis] || !url) continue;

    drugs[cis].rcp_url = url;

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const text = $('body').text();
      drugs[cis].rcp_text = text.trim();
    } catch (err) {
      console.error(`Failed to fetch RCP for ${cis}: ${err.message}`);
    }
  }
};

// STEP 5: Parse CIS_NOTICE_bdpm.txt — notice URLs
const noticeFile = path.join(__dirname, '../data/CIS_NOTICE_bdpm.txt');
const parseNotices = async () => {
  if (!fs.existsSync(noticeFile)) return;
  const lines = fs.readFileSync(noticeFile, 'utf8').split('\n');

  for (const line of lines) {
    const [cis, url] = line.split('\t');
    if (!drugs[cis] || !url) continue;

    drugs[cis].notice_url = url;

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const text = $('body').text();
      drugs[cis].notice_text = text.trim();
    } catch (err) {
      console.error(`Failed to fetch Notice for ${cis}: ${err.message}`);
    }
  }
};

(async () => {
  await parseRCPs();
  await parseNotices();
  fs.writeFileSync(output, JSON.stringify(Object.values(drugs), null, 2));
  console.log(`✅ Saved ${Object.keys(drugs).length} medications to drugs.json (with full RCP & notice text)`);
})();