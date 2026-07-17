const { createError } = require("../utils/errors");

const validateAmount = (req, res, next) => {
  const { amount } = req.body;
  const parsedAmount = Number(amount);

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return next(
      createError("Amount must be a positive number greater than 0", 400),
    );
  }

  next();
};

const validateTransfer = (req, res, next) => {
  const { receiverEmail } = req.body;

  if (typeof receiverEmail !== "string" || !receiverEmail.trim()) {
    return next(
      createError("Receiver email is required", 400),
    );
  }

  validateAmount(req, res, next);
};

module.exports = validateTransfer;
module.exports.validateAmount = validateAmount;
