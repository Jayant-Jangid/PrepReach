const notifyAdminException = async (err, req) => {
  console.error(`[alert:admin] Unhandled error: ${err.message} at ${req?.originalUrl || 'BACKGROUND'}`);
};

module.exports = { notifyAdminException };
