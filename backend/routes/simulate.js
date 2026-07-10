const router = require("express").Router();
const prisma = require("../prisma/client");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { calculateFee } = require("../utils/simulate");

router.post("/transfer", auth, validate, async (req, res) => {
  try {
    const { receiverEmail, amount } = req.body;

    const parsedAmount = Number(amount);
    const normalizedReceiverEmail =
      receiverEmail.toLowerCase().trim();

    const fee = calculateFee(parsedAmount);
    const totalCost = parsedAmount + fee;

    const sender = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!sender) {
      return res.status(404).json({
        message: "Sender not found",
      });
    }

    const receiver = await prisma.user.findUnique({
      where: {
        email: normalizedReceiverEmail,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    if (sender.id === receiver.id) {
      return res.status(400).json({
        message: "Cannot transfer to yourself",
      });
    }

    const result = await prisma.$transaction(async (tx) => {

      /*
       * Atomic debit:
       *
       * UPDATE User
       * SET balance = balance - totalCost
       * WHERE id = sender.id
       * AND balance >= totalCost
       */

      const debitResult = await tx.user.updateMany({
        where: {
          id: sender.id,
          balance: {
            gte: totalCost,
          },
        },
        data: {
          balance: {
            decrement: totalCost,
          },
        },
      });

      if (debitResult.count === 0) {
        throw new Error("INSUFFICIENT_FUNDS");
      }

      const updatedReceiver = await tx.user.update({
        where: {
          id: receiver.id,
        },
        data: {
          balance: {
            increment: parsedAmount,
          },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          senderId: sender.id,
          receiverId: receiver.id,
          amount: parsedAmount,
          fee,
          status: "COMPLETED",
        },
      });

      const updatedSender = await tx.user.findUnique({
        where: {
          id: sender.id,
        },
        select: {
          balance: true,
        },
      });

      return {
        transaction,
        updatedSender,
      };
    });

    res.status(200).json({
      message: "Transaction completed successfully",
      transaction: result.transaction,
      newBalance: result.updatedSender.balance,
    });

  } catch (err) {

    if (err.message === "INSUFFICIENT_FUNDS") {
      return res.status(400).json({
        message:
          "Insufficient balance (includes 2% transfer fee)",
      });
    }

    res.status(500).json({
      error: err.message,
    });

  }
});

module.exports = router;