const cleanXSS = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

const xssMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const k in req.body) {
      if (typeof req.body[k] === 'string') {
        req.body[k] = cleanXSS(req.body[k]);
      }
    }
  }
  next();
};

module.exports = xssMiddleware;
