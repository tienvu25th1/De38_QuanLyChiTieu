const app = require('./app');
const pool = require('./config/db');
const env = require('./config/env');

async function start() {
  await pool.query('SELECT 1');

  const server = app.listen(env.port, () => {
    console.log(`API listening on port ${env.port}`);
  });

  async function shutdown() {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  }

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

start().catch(async (error) => {
  console.error('Unable to start API:', error.message);
  await pool.end();
  process.exit(1);
});