const enforceJsonContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.headers['content-length'] !== '0') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        success: false,
        message: 'Unsupported Media Type. Content-Type must be application/json',
      });
    }
  }
  next();
};

module.exports = enforceJsonContentType;
