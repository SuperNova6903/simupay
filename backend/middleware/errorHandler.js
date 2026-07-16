const { createError } = require("../utils/errors");

const notFound = (req, res, next) => {
  next(createError("Route not found", 404));
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status ||
    (err.code === "P2002" ? 409 : err.code === "P2025" ? 404 : 500);
  let message = statusCode >= 500 ? "Internal server error" : err.message;

  if (err.code === "P2002") {
    message = "Resource already exists";
  } else if (err.code === "P2025") {
    message = "Resource not found";
  } else if (err.type === "entity.parse.failed") {
    message = "Invalid JSON body";
  }

  res.status(statusCode).json({ message });
};

module.exports = { errorHandler, notFound };
