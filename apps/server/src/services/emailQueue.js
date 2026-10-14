const queueEmail = (fn, ...args) => {
  setImmediate(() => {
    fn(...args).catch((err) => {
      console.error('[email:queue:error] Background dispatch failed:', err.message);
    });
  });
};

module.exports = { queueEmail };
