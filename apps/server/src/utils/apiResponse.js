/**
 * Sends a successful JSON response.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {string} message
 * @param {number} statusCode
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends an error JSON response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} statusCode
 * @param {Array|null} errors
 */
const errorResponse = (res, message = 'An error occurred', statusCode = 400, errors = null) => {
  const payload = {
    success: false,
    message,
  };
  if (errors !== null) {
    payload.errors = errors;
  }
  return res.status(statusCode).json(payload);
};

module.exports = { successResponse, errorResponse };
