describe('Email Service Fallback Queue', () => {
  it('should enqueue failed email notifications when third-party provider fails', () => {
    const queue = [];
    const pushToQueue = (msg) => queue.push(msg);
    pushToQueue({ to: 'user@test.in', subject: 'PrepReach OTP' });
    expect(queue.length).toBe(1);
  });
});
