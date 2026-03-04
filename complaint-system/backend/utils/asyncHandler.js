// Wraps async route handlers to forward errors to the centralized error handler
// Eliminates repetitive try/catch in every controller
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
