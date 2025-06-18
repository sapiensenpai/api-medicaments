const express = require('express');
const lunr    = require('lunr');
const router  = express.Router();

const data = require('../../data/drugs.json');   // <- stays the same

// Build the index once at start-up
const index = lunr(function () {
  this.ref('cis');
  this.field('name');
  data.forEach(doc => this.add(doc));
});

router.get('/', (req, res) => {
  const { name = '', page = 1, limit = 10 } = req.query;

  // Fuzzy search with wildcard + edit-distance 1
  const term     = `${name}* ${name}~1`.trim();
  const matches  = term ? index.search(term) : [];

  const start    = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const pageDocs = matches
      .slice(start, start + parseInt(limit, 10))
      .map(r => data.find(d => d.cis === r.ref));

  res.json({ total: matches.length, results: pageDocs });
});

module.exports = router;