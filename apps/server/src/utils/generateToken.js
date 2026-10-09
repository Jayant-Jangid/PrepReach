const jwt = require('jsonwebtoken');

const signToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = { signToken };
