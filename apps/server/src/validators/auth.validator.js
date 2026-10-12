const validateRegistration = (data) => {
  const errors = [];
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('A valid email address is required');
  }
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  return { isValid: errors.length === 0, errors };
};

module.exports = { validateRegistration };
