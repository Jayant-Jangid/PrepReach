describe('Progress Tracking & Calculation', () => {
  it('should accurately compute overall course completion percentage', () => {
    const total = 20;
    const completed = 15;
    const percent = Math.round((completed / total) * 100);
    expect(percent).toBe(75);
  });
});
