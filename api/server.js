const express = require('express');
const app = express();

app.get('/health', (_, res) => res.send('OK'));

module.exports = app;