const Category = require('../models/Category');
const { successResponse } = require('../utils/apiResponse');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    return successResponse(res, { categories });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories };
