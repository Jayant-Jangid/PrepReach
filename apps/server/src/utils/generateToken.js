const jwt = require('jsonwebtoken');

const signToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = { signToken };

const generateAccessToken = (userId, role) => {
  const secret = process.env.JWT_ACCESS_SECRET || 'dev_access_secret_32_characters_min';
  return signToken({ id: userId, role }, secret, '15m');
};

module.exports.generateAccessToken = generateAccessToken;

const generateRefreshToken = (userId) => {
  const secret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_32_characters_min';
  return signToken({ id: userId }, secret, '7d');
};

module.exports.generateRefreshToken = generateRefreshToken;
