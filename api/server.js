const express = require('express');
const http = require('http');

const app = express();

// Health check route
app.get('/health', (req, res) => res.status(200).send('OK'));

const server = http.createServer(app);

module.exports = server;
