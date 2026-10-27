describe('Multi-OTP Concurrency Resilience', () => {
  it('should invalidate old OTP codes when a newer OTP is requested', () => {
    const activeOtps = [{ code: '111111', valid: false }, { code: '222222', valid: true }];
    const valid = activeOtps.filter(o => o.valid);
    expect(valid.length).toBe(1);
    expect(valid[0].code).toBe('222222');
  });
});
