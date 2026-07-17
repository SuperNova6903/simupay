const router = require("express").Router();
const { Prisma, TransactionStatus, TransactionType } = require("@prisma/client");
const prisma = require("../prisma/client");
const auth = require("../middleware/auth");
const { validateAmount } = require("../middleware/validate");
const { asyncHandler, createError } = require("../utils/errors");

const createAccountTransaction = async (tx, userId, amount, type) =>
  tx.transaction.create({
    data: {
      type,
      amount,
      fee: new Prisma.Decimal(0),
      status: TransactionStatus.COMPLETED,
      ...(type === TransactionType.DEPOSIT
        ? { receiverId: userId }
        : { senderId: userId }),
    },
    select: {
      id: true,
      type: true,
      amount: true,
      fee: true,
      status: true,
      createdAt: true,
    },
  });

router.post("/deposit", auth, validateAmount, asyncHandler(async (req, res) => {
  const amount = new Prisma.Decimal(req.body.amount);

  const result = await prisma.$transaction(async (tx) => {
    // A deposit has no balance precondition, so update() is sufficient.
    const updatedUser = await tx.user.update({
      where: { id: req.user.id },
      data: { balance: { increment: amount } },
      select: { balance: true },
    });

    const transaction = await createAccountTransaction(
      tx,
      req.user.id,
      amount,
      TransactionType.DEPOSIT,
    );

    return { transaction, balance: updatedUser.balance };
  });

  res.json({
    message: "Deposit completed successfully",
    transaction: result.transaction,
    newBalance: result.balance,
  });
}));

router.post("/withdraw", auth, validateAmount, asyncHandler(async (req, res) => {
  const amount = new Prisma.Decimal(req.body.amount);

  const result = await prisma.$transaction(async (tx) => {
    // updateMany() keeps the balance check and debit atomic, preventing races.
    const debitResult = await tx.user.updateMany({
      where: { id: req.user.id, balance: { gte: amount } },
      data: { balance: { decrement: amount } },
    });

    if (debitResult.count === 0) {
      throw createError("Insufficient balance", 400);
    }

    const updatedUser = await tx.user.findUnique({
      where: { id: req.user.id },
      select: { balance: true },
    });

    const transaction = await createAccountTransaction(
      tx,
      req.user.id,
      amount,
      TransactionType.WITHDRAWAL,
    );

    return { transaction, balance: updatedUser.balance };
  });

  res.json({
    message: "Withdrawal completed successfully",
    transaction: result.transaction,
    newBalance: result.balance,
  });
}));

module.exports = router;
