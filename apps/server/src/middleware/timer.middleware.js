const timerMiddleware = (req, res, next) => {
  const startHr = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(startHr);
    const ms = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    res.setHeader('X-Response-Time', `${ms}ms`);
  });
  next();
};

module.exports = timerMiddleware;
