const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const isProduction = process.env.NODE_ENV === "production";
const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";
const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

const accessTokenCookieOptions = {
  ...baseCookieOptions,
  maxAge: 15 * 60 * 1000,
};

const refreshTokenCookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const getAccessTokenSecret = () =>
  process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;

const getRefreshTokenSecret = () =>
  process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;

const assertTokenSecrets = () => {
  if (!getAccessTokenSecret() || !getRefreshTokenSecret()) {
    throw new Error(
      "ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be configured",
    );
  }
};

const createAccessToken = (user) => {
  assertTokenSecrets();
  return jwt.sign(
    { id: user.id, email: user.email },
    getAccessTokenSecret(),
    { expiresIn: ACCESS_TOKEN_TTL },
  );
};

const createRefreshToken = (user) => {
  assertTokenSecrets();
  return jwt.sign(
    {
      id: user.id,
      jti: crypto.randomBytes(32).toString("hex"),
    },
    getRefreshTokenSecret(),
    { expiresIn: REFRESH_TOKEN_TTL },
  );
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, accessTokenCookieOptions);
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshTokenCookieOptions);
};

const clearAuthCookies = (res) => {
  res.clearCookie(ACCESS_TOKEN_COOKIE, baseCookieOptions);
  res.clearCookie(REFRESH_TOKEN_COOKIE, baseCookieOptions);
};

module.exports = {
  assertTokenSecrets,
  ACCESS_TOKEN_COOKIE,
  clearAuthCookies,
  createAccessToken,
  createRefreshToken,
  getAccessTokenSecret,
  getRefreshTokenSecret,
  REFRESH_TOKEN_COOKIE,
  setAuthCookies,
};
