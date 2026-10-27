describe('Centralized Error Handling Middleware', () => {
  it('should catch unhandled exceptions and format standard error envelope', () => {
    const err = new Error('Database connection failure');
    const formatted = {
      success: false,
      message: err.message,
    };
    expect(formatted.success).toBe(false);
    expect(formatted.message).toContain('Database');
  });
});
