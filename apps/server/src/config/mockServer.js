module.exports = {
  mockEnabled: process.env.MOCK_SERVER === 'true',
  mockDelayMs: 300,
  mockUsers: [
    { email: 'student@example.com', name: 'Demo Student', role: 'student', isVerified: true },
    { email: 'instructor@example.com', name: 'Demo Instructor', role: 'instructor', isVerified: true },
  ],
};
