const blacklist = new Set();

const revokeToken = (token) => blacklist.add(token);
const isTokenRevoked = (token) => blacklist.has(token);

module.exports = { revokeToken, isTokenRevoked };
