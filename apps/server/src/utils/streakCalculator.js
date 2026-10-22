const StudySession = require('../models/StudySession');

const calculateDailyStudyStreak = async (studentId) => {
  const sessions = await StudySession.find({ student: studentId })
    .sort({ sessionDate: -1 })
    .select('sessionDate');

  if (!sessions.length) return { currentStreak: 0, totalActiveDays: 0 };

  const activeDays = new Set(
    sessions.map(s => new Date(s.sessionDate).toISOString().split('T')[0])
  );

  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    if (activeDays.has(ds)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return { currentStreak: streak, totalActiveDays: activeDays.size };
};

module.exports = { calculateDailyStudyStreak };
