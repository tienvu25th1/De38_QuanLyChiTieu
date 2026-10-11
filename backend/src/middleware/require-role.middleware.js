function requireRole(requiredRole = 'ADMIN') {
  return function checkRole(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication is required.' });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }

    return next();
  };
}

module.exports = requireRole;