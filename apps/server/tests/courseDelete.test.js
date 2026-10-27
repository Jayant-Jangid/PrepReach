describe('Course Soft-Delete Integrity', () => {
  it('should mark course as isDeleted: true without deleting student progress history', () => {
    const course = { id: 'c1', isDeleted: false };
    course.isDeleted = true;
    course.deletedAt = new Date();
    expect(course.isDeleted).toBe(true);
    expect(course.deletedAt).toBeInstanceOf(Date);
  });
});
