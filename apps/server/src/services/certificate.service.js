const crypto = require('crypto');
const { calculateCourseProgress } = require('../utils/progressCalculator');

const checkCertificateEligibility = async (studentId, courseId) => {
  const progressPercent = await calculateCourseProgress(studentId, courseId);
  if (progressPercent >= 100) {
    const certificateId = crypto.randomUUID();
    return {
      isEligible: true,
      certificateId,
      issuedAt: new Date().toISOString(),
    };
  }
  return {
    isEligible: false,
    progressPercent,
    message: '100% course completion required for verified certificate',
  };
};

module.exports = { checkCertificateEligibility };

const generateCertificatePdfData = (studentName, courseTitle, certificateId) => {
  return {
    issuer: 'PrepReach Central Academy',
    studentName,
    courseTitle,
    certificateId,
    issueDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
    verificationUrl: `https://prepreach.in/verify/${certificateId}`,
    status: 'VERIFIED_CREDENTIAL',
  };
};

module.exports.generateCertificatePdfData = generateCertificatePdfData;
