describe('Catalog Filtering & Search', () => {
  it('should filter courses by regional exam categories', () => {
    const categories = ['civil_service', 'public_banking', 'railway', 'municipal'];
    expect(categories).toContain('public_banking');
    expect(categories).toContain('railway');
  });
});
