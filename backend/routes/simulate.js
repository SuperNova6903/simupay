const router = require("express").Router();
const { Prisma, TransactionStatus, TransactionType } = require("@prisma/client");
const prisma = require("../prisma/client");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { asyncHandler, createError } = require("../utils/errors");
const { calculateFee } = require("../utils/simulate");

router.post("/transfer", auth, validate, asyncHandler(async (req, res) => {
  const { receiverEmail, amount } = req.body;
  const parsedAmount = new Prisma.Decimal(amount);
  const normalizedReceiverEmail = receiverEmail.toLowerCase().trim();
  const fee = calculateFee(parsedAmount);
  const totalCost = parsedAmount.plus(fee);

  const sender = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true },
  });
  if (!sender) {
    throw createError("Sender not found", 404);
  }

  const receiver = await prisma.user.findUnique({
    where: { email: normalizedReceiverEmail },
    select: { id: true },
  });
  if (!receiver) {
    throw createError("Receiver not found", 404);
  }
  if (sender.id === receiver.id) {
    throw createError("Cannot transfer to yourself", 400);
  }

  const result = await prisma.$transaction(async (tx) => {
    const debitResult = await tx.user.updateMany({
      where: { id: sender.id, balance: { gte: totalCost } },
      data: { balance: { decrement: totalCost } },
    });
    if (debitResult.count === 0) {
      throw createError("Insufficient balance (includes 2% transfer fee)", 400);
    }

    await tx.user.update({
      where: { id: receiver.id },
      data: { balance: { increment: parsedAmount } },
    });

    const transaction = await tx.transaction.create({
      data: {
        type: TransactionType.TRANSFER,
        senderId: sender.id,
        receiverId: receiver.id,
        amount: parsedAmount,
        fee,
        status: TransactionStatus.COMPLETED,
      },
      select: {
        id: true,
        type: true,
        senderId: true,
        receiverId: true,
        amount: true,
        fee: true,
        status: true,
        createdAt: true,
      },
    });

    const updatedSender = await tx.user.findUnique({
      where: { id: sender.id },
      select: { balance: true },
    });

    return { transaction, updatedSender };
  });

  res.json({
    message: "Transaction completed successfully",
    transaction: result.transaction,
    newBalance: result.updatedSender.balance,
  });
}));

module.exports = router;
