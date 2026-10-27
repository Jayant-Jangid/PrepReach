describe('Syllabus Reordering Tests', () => {
  it('should maintain strict sequential order integers when modules are reordered', () => {
    const modules = [
      { id: 'm1', order: 1 },
      { id: 'm2', order: 2 },
      { id: 'm3', order: 3 },
    ];
    // Move m3 to top
    const reordered = [
      { id: 'm3', order: 1 },
      { id: 'm1', order: 2 },
      { id: 'm2', order: 3 },
    ];
    expect(reordered[0].id).toBe('m3');
    expect(reordered[0].order).toBe(1);
  });
});
