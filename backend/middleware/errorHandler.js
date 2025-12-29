/**
 * Global error handler middleware
 * Handles all errors in a consistent format
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Async handler wrapper to catch errors in async routes
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Check database connection middleware
 */
export const checkDatabase = (req, res, next) => {
  if (req.app.locals.dbConnected !== true) {
    return res.status(503).json({
      success: false,
      error: 'Database not connected. Please ensure MongoDB is running.'
    });
  }
  next();
};

