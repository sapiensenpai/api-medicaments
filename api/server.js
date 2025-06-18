#!/usr/bin/env node

const Server = require('../api/server');
const logger = require('bunyan').createLogger({ name: 'medicaments-api' });

const server = new Server({
  port: process.env.PORT || 3004,
  medicamentsPath: './data/medicaments.json',
  logger: logger
});

server.app.get('/health', (req, res) => res.status(200).send('OK'));

server.start((err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`Server is running on port ${server.getPort()}`);
});
