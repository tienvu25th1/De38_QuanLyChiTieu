const jwt = require('jsonwebtoken');
const env = require('../config/env');
const authService = require('../services/auth.service');

async function authenticate(req, res, next) {
  const authorization = req.get('authorization');
  const match = authorization && authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({ message: 'Authentication token is required.' });
  }

  let payload;
  try {
    payload = jwt.verify(match[1], env.jwtSecret);
  } catch {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }

  try {
    const user = await authService.findActiveUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Account is unavailable.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = authenticate;