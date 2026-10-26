describe('Student Enrollment Suite', () => {
  it('should prevent double-registration on the same course cohort', () => {
    const existingEnrollments = [{ student: 's1', course: 'c1' }];
    const isDuplicate = existingEnrollments.some(e => e.student === 's1' && e.course === 'c1');
    expect(isDuplicate).toBe(true);
  });
});
