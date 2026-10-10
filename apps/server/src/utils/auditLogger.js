const logAuthFailure = (action, email, ip, reason) => {
  const timestamp = new Date().toISOString();
  console.warn(`[security:audit] Failed ${action} for ${email} from IP ${ip} — Reason: ${reason} at ${timestamp}`);
};

module.exports = { logAuthFailure };
