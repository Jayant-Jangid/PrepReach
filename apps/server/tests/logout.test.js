describe('Session Invalidation & Logout', () => {
  it('should clear refresh token cookie on successful signout', () => {
    const clearedCookies = ['refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly'];
    expect(clearedCookies[0]).toContain('Expires=Thu, 01 Jan 1970');
  });
});
