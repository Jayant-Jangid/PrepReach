const nodemailer = require('nodemailer');

let smtpTransporter = null;
const initSMTPTransport = () => {
  smtpTransporter = nodemailer.createTransport({
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  console.log('[email] Nodemailer SMTP connection pool initialized.');
};

module.exports = { initSMTPTransport };

const sgMail = require('@sendgrid/mail');
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendViaSendGrid = async ({ to, from, subject, html, text }) => {
  return sgMail.send({ to, from, subject, html, text });
};

module.exports.sendViaSendGrid = sendViaSendGrid;
