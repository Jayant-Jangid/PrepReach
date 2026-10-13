const devAuthBypass = (req, res, next) => {
  if (process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true') {
    req.user = { id: 'dev-admin-id', role: 'admin', email: 'dev@prepreach.local' };
  }
  next();
};

module.exports = devAuthBypass;
