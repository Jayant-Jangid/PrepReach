const bcrypt = require('bcryptjs');
const { generateSecureOTP } = require('../../src/utils/cryptoCode');

describe('Unit: Crypto Utilities', () => {
  it('should generate 6-digit numeric OTP string', () => {
    const otp = generateSecureOTP();
    expect(otp.length).toBe(6);
    expect(Number(otp)).toBeGreaterThanOrEqual(100000);
    expect(Number(otp)).toBeLessThan(1000000);
  });

  it('should hash and verify passwords using bcrypt', async () => {
    const password = 'Pass123!Secure';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const match = await bcrypt.compare(password, hash);
    expect(match).toBe(true);
  });
});
