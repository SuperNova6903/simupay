const router = require("express").Router();
const prisma = require("../prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const { asyncHandler, createError } = require("../utils/errors");
const {
  clearAuthCookies,
  createAccessToken,
  createRefreshToken,
  assertTokenSecrets,
  getRefreshTokenSecret,
  REFRESH_TOKEN_COOKIE,
  setAuthCookies,
} = require("../utils/tokens");

const invalidRefreshToken = (res, next) => {
  clearAuthCookies(res);
  return next(createError("Invalid or expired refresh token", 401));
};

router.post("/signup", asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !username ||
    !email ||
    !password
  ) {
    throw createError("All fields are required", 400);
  }

  const normalizedUsername = username.trim();
  if (!normalizedUsername) {
    throw createError("Username is required", 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    throw createError("Invalid email", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });
  if (existingUser) {
    throw createError("User already exists", 409);
  }

  if (password.length < 8) {
    throw createError("Password must be at least 8 characters", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    },
    select: { id: true, username: true, email: true },
  });

  res.status(201).json({
    message: "User created successfully",
    user,
  });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email ||
    !password
  ) {
    throw createError("Email and password are required", 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      balance: true,
    },
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError("Invalid credentials", 401);
  }

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { hashedRefreshToken },
  });

  setAuthCookies(res, accessToken, refreshToken);
  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance,
    },
  });
}));

router.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
    if (!refreshToken) {
      return invalidRefreshToken(res, next);
    }

    assertTokenSecrets();

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, getRefreshTokenSecret());
    } catch (err) {
      return invalidRefreshToken(res, next);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, hashedRefreshToken: true },
    });
    if (!user || !user.hashedRefreshToken) {
      return invalidRefreshToken(res, next);
    }

    const matches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!matches) {
      return invalidRefreshToken(res, next);
    }

    const accessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    setAuthCookies(res, accessToken, newRefreshToken);
    res.json({ message: "Access token refreshed" });
  } catch (err) {
    clearAuthCookies(res);
    next(err);
  }
});

router.post("/logout", asyncHandler(async (req, res) => {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];

  try {
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, getRefreshTokenSecret());
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, hashedRefreshToken: true },
      });

      if (
        user?.hashedRefreshToken &&
        await bcrypt.compare(refreshToken, user.hashedRefreshToken)
      ) {
        await prisma.user.update({
          where: { id: user.id },
          data: { hashedRefreshToken: null },
        });
      }
    }
  } finally {
    clearAuthCookies(res);
  }

  res.json({ message: "Logged out successfully" });
}));

router.get("/user", auth, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      username: true,
      email: true,
      balance: true,
    },
  });

  if (!user) {
    throw createError("User not found", 404);
  }

  res.json(user);
}));

module.exports = router;
