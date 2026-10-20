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

const cache = require('../utils/cache');

const getCachedCategories = async (req, res, next) => {
  try {
    const cached = cache.get('all_categories');
    if (cached) return successResponse(res, { categories: cached, fromCache: true });
    const Category = require('../models/Category');
    const categories = await Category.find({ isActive: true }).lean();
    cache.set('all_categories', categories, 600);
    return successResponse(res, { categories, fromCache: false });
  } catch (err) {
    next(err);
  }
};

module.exports.getCachedCategories = getCachedCategories;
