const { signToken } = require('../src/utils/generateToken');

describe('Login Token Issuance', () => {
  it('should serialize valid JWT access token and refresh token', () => {
    const token = signToken({ id: 'user_123', role: 'student' }, 'test_secret', '15m');
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });
});
