const normalizeEmail = (email) => {
  return typeof email === 'string' ? email.toLowerCase().trim() : '';
};

module.exports = normalizeEmail;
