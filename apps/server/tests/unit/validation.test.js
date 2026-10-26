const { normalizeEmail } = require('../../src/utils/normalizeEmail');

describe('Unit: Input Validation Helpers', () => {
  it('should normalize email addresses to lowercase and trimmed string', () => {
    const normalized = normalizeEmail('  Candidate.Prep@Domain.IN  ');
    expect(normalized).toBe('candidate.prep@domain.in');
  });
});
