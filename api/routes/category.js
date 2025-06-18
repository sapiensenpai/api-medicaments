const express = require('express');
const router  = express.Router();
const data    = require('../../data/drugs.json');

router.get('/:code', (req, res) => {
  const results = data.filter(d => d.therapeutic_class === req.params.code);
  res.json({ total: results.length, results });
});

module.exports = router;