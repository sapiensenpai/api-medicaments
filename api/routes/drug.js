const express = require('express');
const router  = express.Router();
const data    = require('../../data/drugs.json');

router.get('/:cis', (req, res) => {
  const drug = data.find(d => d.cis === req.params.cis);
  if (!drug) return res.status(404).json({ error: 'Not found' });
  res.json(drug);
});

module.exports = router;