const calculateMockScore = (correct, incorrect, marksPerCorrect = 2, negativeMark = 0.5) => {
  const raw = (correct * marksPerCorrect) - (incorrect * negativeMark);
  return Math.max(0, Number(raw.toFixed(2)));
};

module.exports = { calculateMockScore };
