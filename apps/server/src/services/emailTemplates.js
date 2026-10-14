const PRIMARY = '#524C73';
const ACCENT = '#B85324';

const baseWrapper = (content) => `
<!DOCTYPE html>
<html>
<body style="font-family:'Segoe UI',sans-serif;background:#F8F9FA;padding:24px;margin:0;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table width="560" style="background:#ffffff;border-radius:10px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
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
