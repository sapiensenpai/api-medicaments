const express = require('express');
const app = express();

const routes = require('./routes');
app.use('/', routes);

app.get('/health', (_, res) => res.send('OK'));

module.exports = app;