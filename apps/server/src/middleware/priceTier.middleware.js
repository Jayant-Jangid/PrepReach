const { errorResponse } = require('../utils/apiResponse');

const validatePriceTier = (req, res, next) => {
  const price = Number(req.body.price);
  if (req.body.price !== undefined && (isNaN(price) || price < 0 || price > 50000)) {
    return errorResponse(res, 'Price must be between 0 and 50,000 INR', 400);
  }
  next();
};

module.exports = validatePriceTier;
