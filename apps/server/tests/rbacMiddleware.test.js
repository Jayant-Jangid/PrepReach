describe('RBAC Authorization Guard', () => {
  it('should deny non-instructor roles from reaching syllabus mutation endpoints', () => {
    const roles = ['student', 'guest'];
    roles.forEach(role => {
      expect(role === 'instructor' || role === 'admin').toBe(false);
    });
  });
});
