const jwt = require('jsonwebtoken');
const { signToken } = require('../../src/utils/generateToken');

describe('Unit: JWT Generator', () => {
  it('should generate valid signed token with decoded payload', () => {
    const secret = 'super_secret_for_unit_tests';
    const token = signToken({ role: 'admin', id: '123' }, secret, '1h');
    const decoded = jwt.verify(token, secret);
    expect(decoded.role).toBe('admin');
    expect(decoded.id).toBe('123');
  });
});
