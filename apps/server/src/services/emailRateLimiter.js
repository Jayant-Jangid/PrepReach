let sentInCurrentWindow = 0;
const MAX_PER_MINUTE = 60;

setInterval(() => { sentInCurrentWindow = 0; }, 60000);

const canSendEmail = () => {
  if (sentInCurrentWindow >= MAX_PER_MINUTE) return false;
  sentInCurrentWindow++;
  return true;
};

module.exports = { canSendEmail };
