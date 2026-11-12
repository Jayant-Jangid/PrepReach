const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Runs an array of express-validator validation chains, then checks the
 * result. Returns a 422 response with structured errors if any fail;
 * otherwise calls next().
 *
 * Usage:
 *   router.post('/route', validate([body('email').isEmail()]), controller)
 *
 * @param {import('express-validator').ValidationChain[]} validations
 */
const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) break; // fail-fast is optional; remove to collect all
    }

    const result = validationResult(req);
    if (result.isEmpty()) return next();

    const errors = result.array().map((err) => ({
      field:   err.path || err.param,
      message: err.msg,
    }));

    return errorResponse(res, 'Validation failed', 422, errors);
  };
};

module.exports = { validate };
