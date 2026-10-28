const { successResponse, errorResponse } = require('../src/utils/apiResponse');

describe('API Contract Envelope Consistency', () => {
  it('should maintain standard envelope structure: success, message, data', () => {
    const res = {
      status: (code) => ({
        json: (payload) => payload,
      }),
    };
    const response = successResponse(res, { key: 'value' }, 'OK');
    expect(response).toHaveProperty('success', true);
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('message');
  });
});
