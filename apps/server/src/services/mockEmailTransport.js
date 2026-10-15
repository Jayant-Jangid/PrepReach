const sentMocks = [];

const mockSend = async (options) => {
  sentMocks.push(options);
  return { messageId: `mock-${Date.now()}` };
};

const getSentMocks = () => sentMocks;
const clearSentMocks = () => { sentMocks.length = 0; };

module.exports = { mockSend, getSentMocks, clearSentMocks };
