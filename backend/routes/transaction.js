const router = require("express").Router();
const prisma = require("../prisma/client");
const auth = require("../middleware/auth");
const { asyncHandler } = require("../utils/errors");

router.get("/history", auth, asyncHandler(async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { senderId: req.user.id },
        { receiverId: req.user.id },
      ],
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
      sender: { select: { id: true, email: true } },
      receiver: { select: { id: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(transactions);
}));

module.exports = router;
