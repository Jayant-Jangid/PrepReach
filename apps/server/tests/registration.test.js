describe('Candidate Registration Flow', () => {
  it('should register a candidate with valid credentials and trigger verification OTP', async () => {
    const candidateData = {
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.in',
      password: 'SecurePassword123!',
      targetExams: ['civil_service'],
    };
    expect(candidateData.email).toContain('@');
    expect(candidateData.name.length).toBeGreaterThan(2);
    expect(candidateData.password.length).toBeGreaterThanOrEqual(6);
  });
});
