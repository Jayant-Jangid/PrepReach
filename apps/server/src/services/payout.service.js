const calculateInstructorEarnings = (grossAmount, platformFeePercent = 20) => {
  const platformFee = Math.round(grossAmount * (platformFeePercent / 100));
  const netEarnings = grossAmount - platformFee;
  return { grossAmount, platformFee, netEarnings, commissionPercent: platformFeePercent };
};

module.exports = { calculateInstructorEarnings };
