const { createError } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { receiverEmail, amount } = req.body;
  const parsedAmount = Number(amount);

  if (
    typeof receiverEmail !== "string" ||
    !receiverEmail.trim() ||
    !Number.isFinite(parsedAmount) ||
    parsedAmount <= 0
  ) {
    return next(
      createError(
        "Invalid or missing fields: receiverEmail and positive amount are required.",
        400,
      ),
    );
  }

  next();
};
