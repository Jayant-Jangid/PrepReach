const PRIMARY = '#524C73';
const ACCENT = '#B85324';

const baseWrapper = (content) => `
<!DOCTYPE html>
<html>
<body style="font-family:'Segoe UI',sans-serif;background:#F8F9FA;padding:24px;margin:0;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table width="100%" style="max-width:560px;margin:0 auto;" style="background:#ffffff;border-radius:10px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <tr><td style="color:${PRIMARY};font-size:24px;font-weight:700;padding-bottom:16px;">PrepReach</td></tr>
      <tr><td>${content}</td></tr>
    </table>
  </td></tr></table>
</body>
</html>
`;

const getOTPTemplate = (otp, purpose = 'Verification') => {
  const content = `
    <h2 style="color:#1A1A2E;">Your Verification Code</h2>
    <p style="color:#524C73;">Enter the 6-digit code below to complete your ${purpose.toLowerCase()}.</p>
    <div style="font-size:32px;font-weight:bold;color:${ACCENT};letter-spacing:6px;padding:16px 0;">${otp}</div>
    <p style="color:#888;font-size:12px;">This code will expire in 10 minutes.</p>
  `;
  return baseWrapper(content);
};

module.exports = { baseWrapper, getOTPTemplate };

const getWelcomeTemplate = (name) => {
  const content = `
    <h2 style="color:#1A1A2E;">Welcome to PrepReach, ${name}!</h2>
    <p style="color:#524C73;">Your account has been successfully verified. Explore our regional government exam bootcamps today.</p>
  `;
  return baseWrapper(content);
};

module.exports.getWelcomeTemplate = getWelcomeTemplate;

const getEnrollmentTemplate = (userName, courseTitle, courseUrl) => {
  const content = `
    <h2 style="color:#1A1A2E;">Enrollment Confirmed!</h2>
    <p>Hi ${userName}, you are now enrolled in <strong>${courseTitle}</strong>.</p>
    <a href="${courseUrl}" style="display:inline-block;background:#B85324;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Go to Course</a>
  `;
  return baseWrapper(content);
};

module.exports.getEnrollmentTemplate = getEnrollmentTemplate;

const getPasswordlessLoginTemplate = (otp) => {
  return getOTPTemplate(otp, 'Login');
};

module.exports.getPasswordlessLoginTemplate = getPasswordlessLoginTemplate;

const getPlainTextFallback = (subject, bodyText) => {
  return `PrepReach — ${subject}

${bodyText}

© ${new Date().getFullYear()} PrepReach. All rights reserved.`;
};

module.exports.getPlainTextFallback = getPlainTextFallback;

const getCourseUpdateTemplate = (courseName, updateDetails) => {
  const content = `
    <h2>New Updates in ${courseName}</h2>
    <p>${updateDetails}</p>
    <p>Check the newly added lectures in your dashboard.</p>
  `;
  return baseWrapper(content);
};

module.exports.getCourseUpdateTemplate = getCourseUpdateTemplate;

const getMilestoneTemplate = (studentName, milestoneName) => {
  const content = `
    <h2>Milestone Achieved! 🎯</h2>
    <p>Congratulations ${studentName}, you completed <strong>${milestoneName}</strong>!</p>
  `;
  return baseWrapper(content);
};

module.exports.getMilestoneTemplate = getMilestoneTemplate;

const getCourseApprovalTemplate = (instructorName, courseTitle) => {
  const content = `
    <h2>Course Approved & Published</h2>
    <p>Hello ${instructorName}, your course <strong>${courseTitle}</strong> is now live on the catalog.</p>
  `;
  return baseWrapper(content);
};

module.exports.getCourseApprovalTemplate = getCourseApprovalTemplate;

const getDeskSignature = () => `
  <div style="margin-top:24px;border-top:1px solid #E8E8ED;padding-top:16px;color:#71717A;font-size:12px;">
    <strong>PrepReach Examination Support Desk</strong><br/>
    Dedicated mentoring for Civil Service, Banking, Railway & Municipal Aspirants.
  </div>
`;

module.exports.getDeskSignature = getDeskSignature;

const getLocalizedHeader = (lang = 'en') => {
  return lang === 'hi' ? 'प्रेपरीच — सरकारी परीक्षा तैयारी' : 'PrepReach — Regional Government Exam Prep';
};

module.exports.getLocalizedHeader = getLocalizedHeader;

const getCertificateTemplate = (name, courseName, certUrl) => {
  const content = `
    <h2>Certificate of Completion 🎓</h2>
    <p>Hi ${name}, you successfully finished <strong>${courseName}</strong>.</p>
    <a href="${certUrl}">Download Official Certificate</a>
  `;
  return baseWrapper(content);
};

module.exports.getCertificateTemplate = getCertificateTemplate;

const getExamAlertTemplate = (examName, dateStr) => {
  const content = `
    <h2>Upcoming Exam Notification 📅</h2>
    <p>Important update: The official schedule for <strong>${examName}</strong> is confirmed for <strong>${dateStr}</strong>.</p>
  `;
  return baseWrapper(content);
};

module.exports.getExamAlertTemplate = getExamAlertTemplate;

const getInvoiceReceiptTemplate = (userName, courseName, amount, invoiceNo) => {
  const content = `
    <h2>Payment Receipt — #${invoiceNo}</h2>
    <p>Hi ${userName}, payment of ₹${amount} for ${courseName} was verified successfully.</p>
  `;
  return baseWrapper(content);
};

module.exports.getInvoiceReceiptTemplate = getInvoiceReceiptTemplate;

const getWeeklyDigestTemplate = (instructorName, stats) => {
  const content = `
    <h2>Weekly Cohort Summary</h2>
    <p>Hello ${instructorName}, your bootcamps reached ${stats.newEnrollments || 0} new candidates this week.</p>
  `;
  return baseWrapper(content);
};

module.exports.getWeeklyDigestTemplate = getWeeklyDigestTemplate;
