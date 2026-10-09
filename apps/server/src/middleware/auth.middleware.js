const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');

const protect = (req, res, next) => {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return errorResponse(res, 'Authentication token required. Please sign in.', 401);
  }

  try {
    const secret = process.env.JWT_ACCESS_SECRET || 'dev_access_secret_32_characters_min';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 'Invalid or expired session token', 401);
  }
};

module.exports = { protect };
