const crypto = require('crypto');

const generateSecureOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

module.exports = { generateSecureOTP };
