const jwt = require("jsonwebtoken");
const { createError } = require("../utils/errors");
const {
  assertTokenSecrets,
  ACCESS_TOKEN_COOKIE,
  getAccessTokenSecret,
} = require("../utils/tokens");

module.exports = (req, res, next) => {
  const token = req.cookies[ACCESS_TOKEN_COOKIE];
  if (!token) {
    return next(createError("Access denied. No access token provided.", 401));
  }

  try {
    assertTokenSecrets();
  } catch (err) {
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, getAccessTokenSecret());
    req.user = decoded;
    next();
  } catch (ex) {
    next(createError("Invalid or expired access token.", 401));
  }
};
