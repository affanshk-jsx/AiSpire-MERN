// backend/middleware/errorMiddleware.js
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // If a handler already set a statusCode (like 401/403/404), keep it.
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Helpful server-side log
  console.error('❌ API Error:', {
    statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? 'hidden' : err.stack,
    route: req.originalUrl,
    user: req.user?._id?.toString() || null,
  });

  res.status(statusCode).json({
    message: err.message || 'Server error',
    // Only show stack in dev
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

export { notFound, errorHandler };
