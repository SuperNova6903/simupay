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
      // Re-fetch inside transaction to avoid stale balances
      const currentSender = await tx.user.findUnique({
        where: {
          id: sender.id,
        },
      });

      const currentReceiver = await tx.user.findUnique({
        where: {
          id: receiver.id,
        },
      });

      if (!currentSender || !currentReceiver) {
        throw new Error("USER_NOT_FOUND");
      }

      const senderBalance = Number(currentSender.balance);
      const receiverBalance = Number(currentReceiver.balance);

      if (senderBalance < totalCost) {
        throw new Error("INSUFFICIENT_FUNDS");
      }

      const updatedSender = await tx.user.update({
        where: {
          id: sender.id,
        },
        data: {
          balance: senderBalance - totalCost,
        },
      });

      await tx.user.update({
        where: {
          id: receiver.id,
        },
        data: {
          balance: receiverBalance + parsedAmount,
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          senderId: sender.id,
          receiverId: receiver.id,
          amount: parsedAmount,
          fee: fee,
          status: "COMPLETED",
        },
      });

      return {
        updatedSender,
        transaction,
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
        message: "Insufficient balance (includes 2% transfer fee)",
      });
    }

    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        message: "User not found during transaction",
      });
    }

    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;