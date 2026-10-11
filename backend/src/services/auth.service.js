const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const env = require('../config/env');

const publicUserColumns = `
  id, username, full_name, email, avatar, role, status, created_at
`;

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function register({ username, full_name, email, password, avatar }) {
  const passwordHash = await bcrypt.hash(password, env.bcryptRounds);

  try {
    const result = await pool.query(
      `INSERT INTO users (username, full_name, email, password_hash, avatar)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${publicUserColumns}`,
      [username.toLowerCase(), full_name, email.toLowerCase(), passwordHash, avatar || null],
    );

    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw httpError(409, 'Username or email already exists.');
    }

    throw error;
  }
}

async function login({ email, password }) {
  const result = await pool.query(
    `SELECT ${publicUserColumns}, password_hash
     FROM users
     WHERE email = $1`,
    [email.toLowerCase()],
  );
  const user = result.rows[0];

  if (!user) {
    throw httpError(401, 'Invalid email or password.');
  }

  if (user.status === 'LOCKED') {
    throw httpError(403, 'This account is locked.');
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw httpError(401, 'Invalid email or password.');
  }

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );

  delete user.password_hash;
  return { user, token };
}

async function findActiveUserById(userId) {
  const result = await pool.query(
    `SELECT ${publicUserColumns}
     FROM users
     WHERE id = $1 AND status = 'ACTIVE'`,
    [userId],
  );

  return result.rows[0] || null;
}

module.exports = { register, login, findActiveUserById, httpError };