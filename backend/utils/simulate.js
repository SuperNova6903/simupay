const TRANSFER_FEE_RATE = 0.02;

const calculateFee = (amount) => {
  return amount * TRANSFER_FEE_RATE;
};

module.exports = { calculateFee, TRANSFER_FEE_RATE };
