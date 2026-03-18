const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  return res.status(statusCode).json({
    error: true,
    message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};

module.exports = errorHandler;
