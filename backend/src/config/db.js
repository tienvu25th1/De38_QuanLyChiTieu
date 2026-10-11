const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  ...env.database,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error);
});

module.exports = pool;