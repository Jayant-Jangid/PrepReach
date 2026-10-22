const logAuthFailure = (action, email, ip, reason) => {
  const timestamp = new Date().toISOString();
  console.warn(`[security:audit] Failed ${action} for ${email} from IP ${ip} — Reason: ${reason} at ${timestamp}`);
};

module.exports = { logAuthFailure };

const logAuditAction = (action, details) => {
  const timestamp = new Date().toISOString();
  console.info(`[admin:audit] Action: ${action} Details: ${JSON.stringify(details)} at ${timestamp}`);
};

module.exports.logAuditAction = logAuditAction;
