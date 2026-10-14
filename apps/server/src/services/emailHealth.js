const verifyEmailService = async () => {
  if (!process.env.SENDGRID_API_KEY && !process.env.SMTP_PASS) {
    console.warn('[email:health] Neither SendGrid nor SMTP configured. Emails running in local mock mode.');
    return false;
  }
  console.log('[email:health] Outbound email service ready.');
  return true;
};

module.exports = { verifyEmailService };
