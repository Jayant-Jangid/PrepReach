const bouncedEmails = new Set();

const isBlacklisted = (email) => bouncedEmails.has(email.toLowerCase().trim());
const addToBlacklist = (email) => bouncedEmails.add(email.toLowerCase().trim());

module.exports = { isBlacklisted, addToBlacklist };
