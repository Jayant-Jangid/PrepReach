const hppMiddleware = (req, res, next) => {
  if (req.query) {
    for (const k in req.query) {
      if (Array.isArray(req.query[k]) && k !== 'tags' && k !== 'category') {
        req.query[k] = req.query[k][req.query[k].length - 1];
      }
    }
  }
  next();
};

module.exports = hppMiddleware;
