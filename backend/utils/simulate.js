const { Prisma } = require("@prisma/client");

const TRANSFER_FEE_RATE = new Prisma.Decimal("0.02");

const calculateFee = (amount) => {
  return amount.mul(TRANSFER_FEE_RATE);
};

module.exports = { calculateFee, TRANSFER_FEE_RATE };
