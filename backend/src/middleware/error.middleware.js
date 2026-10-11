function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  return next(error);
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const candidateStatus = Number(error.statusCode || error.status);
  const statusCode = candidateStatus >= 400 && candidateStatus <= 599
    ? candidateStatus
    : 500;
  if (statusCode >= 500) {
    console.error(error);
  }

  return res.status(statusCode).json({
    message: statusCode === 500 ? 'Internal server error.' : error.message,
  });
}

module.exports = { notFound, errorHandler };