const router = require("express").Router();
const prisma = require("../prisma/client");
const auth = require("../middleware/auth");

router.get("/history", auth, async (req, res) => {
  try {
    const transactions =
      await prisma.transaction.findMany({
        where: {
          OR: [
            {
              senderId: req.user.id,
            },
            {
              receiverId: req.user.id,
            },
          ],
        },

        include: {
          sender: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },

          receiver: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json(transactions);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;