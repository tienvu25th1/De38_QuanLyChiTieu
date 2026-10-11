const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const port = Number(process.env.PORT || 3000);
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS || 12);
const jwtSecret = process.env.JWT_SECRET;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

if (!Number.isInteger(bcryptRounds) || bcryptRounds < 10 || bcryptRounds > 15) {
  throw new Error('BCRYPT_ROUNDS must be an integer between 10 and 15.');
}

if (!jwtSecret || jwtSecret.startsWith('replace_') || jwtSecret.length < 32) {
  throw new Error('Set a random JWT_SECRET with at least 32 characters in backend/.env.');
}

const database = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.POSTGRES_PORT || process.env.DB_PORT || 5434),
  database: process.env.POSTGRES_DB || process.env.DB_NAME || 'quanlychitieu',
  user: process.env.POSTGRES_USER || process.env.DB_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD,
};

if (!Number.isInteger(database.port) || database.port < 1 || database.port > 65535) {
  throw new Error('DB_PORT/POSTGRES_PORT must be an integer between 1 and 65535.');
}

if (!database.password || database.password.startsWith('replace_')) {
  throw new Error('Set DB_PASSWORD or POSTGRES_PASSWORD in an .env file.');
}

module.exports = {
  port,
  bcryptRounds,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  database,
};