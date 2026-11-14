function errorHandler(error, req, res, next) {
  // Mongoose reports missing or invalid model fields as validation errors.
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ error: error.message });
  }

  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorHandler;
