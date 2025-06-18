const express = require('express');
const router = express.Router();

const search = require('./search');
const drug = require('./drug');
const category = require('./category');

router.use('/search', search);
router.use('/drug', drug);
router.use('/category', category);

module.exports = router;