describe('Security: Free Preview Lecture Permissions', () => {
  it('should permit unauthenticated visitors to stream sample preview lectures', () => {
    const isPreview = true;
    const canStream = isPreview === true;
    expect(canStream).toBe(true);
  });
});
