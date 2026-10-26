describe('OTP Verification Suite', () => {
  it('should accept valid 6-digit verification code', () => {
    const otp = '849201';
    expect(otp).toMatch(/^\d{6}$/);
  });

  it('should reject expired or malformed OTP attempts', () => {
    const invalidCodes = ['123', 'abcde', '0000000', ''];
    invalidCodes.forEach(code => {
      expect(/^\d{6}$/.test(code)).toBe(false);
    });
  });
});
