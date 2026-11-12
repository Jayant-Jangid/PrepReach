const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const {
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
  SENDGRID_FROM_NAME,
  GMAIL_USER,
  GMAIL_APP_PASSWORD,
} = require('../config/env');

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// Create Nodemailer Gmail transport if App Password is provided
let gmailTransporter = null;
if (GMAIL_APP_PASSWORD) {
  gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD.replace(/\s+/g, ''), // Strip spaces from Google 16-char app password
    },
  });
}

const FROM = {
  email: SENDGRID_FROM_EMAIL,
  name: SENDGRID_FROM_NAME,
};

// Brand colours
const PRIMARY = '#524C73';   // grayish lavender
const ACCENT  = '#B85324';   // cinnamon rufous

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>PrepReach</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:${PRIMARY};padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;letter-spacing:1px;">PrepReach</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.80);font-size:13px;">Regional Government Exam Bootcamps</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f4f4f7;padding:20px 40px;text-align:center;border-top:1px solid #e8e8ed;">
              <p style="margin:0;color:#9b9ba4;font-size:12px;">© ${new Date().getFullYear()} PrepReach · All rights reserved</p>
              <p style="margin:4px 0 0;color:#9b9ba4;font-size:12px;">If you did not request this email, you can safely ignore it.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const PURPOSE_LABELS = {
  registration:    'Email Verification',
  login:           'Login Verification',
  password_reset:  'Password Reset',
};

/**
 * Dispatches an email using either Gmail SMTP (primary for @gmail.com) or SendGrid.
 */
const sendMail = async ({ to, subject, html, text }) => {
  // Option 1: Gmail Direct SMTP (Guaranteed 100% inbox delivery for @gmail.com senders)
  if (gmailTransporter) {
    try {
      const info = await gmailTransporter.sendMail({
        from: `"${SENDGRID_FROM_NAME}" <${GMAIL_USER}>`,
        to,
        subject,
        html,
        text,
      });
      console.log(`\n✅ [Gmail SMTP] Email delivered directly to inbox: ${to} (MessageId: ${info.messageId})\n`);
      return info;
    } catch (err) {
      console.error(`❌ [Gmail SMTP Error]:`, err.message);
      throw err;
    }
  }

  // Option 2: SendGrid API
  if (SENDGRID_API_KEY) {
    const msg = {
      to,
      from: FROM,
      subject,
      html,
    };
    return await sgMail.send(msg);
  }

  throw new Error('No email transport configured. Set GMAIL_APP_PASSWORD or SENDGRID_API_KEY in .env.local.');
};

/**
 * Sends a branded OTP email.
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit OTP (plaintext)
 * @param {'registration'|'login'|'password_reset'} purpose
 */
const sendOTPEmail = async (to, otp, purpose) => {
  const label = PURPOSE_LABELS[purpose] || 'Verification';

  const content = `
    <h2 style="margin:0 0 8px;color:#2d2d3a;font-size:22px;">${label}</h2>
    <p style="margin:0 0 24px;color:#5a5a6e;font-size:15px;line-height:1.6;">
      Use the one-time code below to complete your ${label.toLowerCase()}. 
      This code expires in <strong>10 minutes</strong>.
    </p>
    <div style="text-align:center;margin:0 0 28px;">
      <span style="
        display:inline-block;
        background:#f7f6ff;
        border:2px dashed ${PRIMARY};
        border-radius:10px;
        padding:18px 48px;
        font-size:36px;
        font-weight:700;
        letter-spacing:10px;
        color:${ACCENT};
      ">${otp}</span>
    </div>
    <p style="margin:0;color:#9b9ba4;font-size:13px;text-align:center;">
      Do not share this code with anyone.
    </p>
  `;

  const subject = `[PrepReach] Your ${label} Code: ${otp}`;
  const html = baseTemplate(content);
  const text = `Your PrepReach ${label} code is: ${otp}. It expires in 10 minutes.`;

  try {
    await sendMail({ to, subject, html, text });
    console.log(`[Email Service] OTP successfully dispatched to ${to}`);
  } catch (error) {
    const errorDetails = error.response?.body?.errors?.[0]?.message || error.message;
    console.error(`\n❌ [Email Delivery Warning] Failed to send email to ${to}: ${errorDetails}`);

    if (process.env.NODE_ENV === 'development') {
      console.warn(`\n=======================================================`);
      console.warn(`🔑 [DEV MODE FALLBACK] OTP for ${to}:`);
      console.warn(`👉 👉 👉   ${otp}   👈 👈 👈`);
      console.warn(`Use this code on the verification screen to proceed.`);
      console.warn(`=======================================================\n`);
      return;
    }

    const customErr = new Error(`Email delivery failed: ${errorDetails}`);
    customErr.statusCode = error.code || 502;
    throw customErr;
  }
};

/**
 * Sends a welcome email after successful registration.
 * @param {string} to
 * @param {string} name
 */
const sendWelcomeEmail = async (to, name) => {
  const content = `
    <h2 style="margin:0 0 8px;color:#2d2d3a;font-size:22px;">Welcome aboard, ${name}! 🎉</h2>
    <p style="margin:0 0 20px;color:#5a5a6e;font-size:15px;line-height:1.6;">
      You've successfully joined <strong style="color:${PRIMARY};">PrepReach</strong> — the smart way 
      to prepare for government exams in India. We're excited to be part of your journey!
    </p>
    <div style="background:#f7f6ff;border-left:4px solid ${ACCENT};border-radius:4px;padding:16px 20px;margin:0 0 24px;">
      <p style="margin:0;color:#2d2d3a;font-size:14px;line-height:1.6;">
        📚 Explore courses for <strong>Civil Service, Public Banking, Railway</strong> and <strong>Municipal</strong> exams.<br/>
        🎯 Choose your target exam and start your personalised learning path.
      </p>
    </div>
    <p style="margin:0 0 24px;color:#5a5a6e;font-size:15px;line-height:1.6;">
      Log in to complete your profile and browse our course catalog.
    </p>
    <div style="text-align:center;">
      <a href="${process.env.CLIENT_URL || '#'}" 
         style="display:inline-block;background:${ACCENT};color:#ffffff;text-decoration:none;border-radius:8px;padding:14px 36px;font-size:15px;font-weight:600;">
        Get Started
      </a>
    </div>
  `;

  const subject = `Welcome to PrepReach, ${name}!`;
  const html = baseTemplate(content);
  const text = `Welcome to PrepReach, ${name}! Log in to browse your government exam bootcamps.`;

  try {
    await sendMail({ to, subject, html, text });
  } catch (error) {
    const errorDetails = error.response?.body?.errors?.[0]?.message || error.message;
    console.error(`[Email Service] Welcome email warning: ${errorDetails}`);
  }
};

module.exports = { sendOTPEmail, sendWelcomeEmail };
