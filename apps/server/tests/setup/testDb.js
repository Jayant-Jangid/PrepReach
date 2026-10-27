const connectTestDb = async () => {
  return { connected: true, uri: 'mongodb://mock-in-memory:27017/test_prepreach' };
};

const clearTestDb = async () => {
  return { cleared: true };
};

const closeTestDb = async () => {
  return { closed: true };
};

module.exports = { connectTestDb, clearTestDb, closeTestDb };
