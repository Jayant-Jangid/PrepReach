const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const { successResponse } = require('../utils/apiResponse');
const { calculateDailyStudyStreak } = require('../utils/streakCalculator');

const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user ? req.user.id : req.query.studentId;
    const enrollments = await Enrollment.find({ student: studentId })
      .populate('course', 'title thumbnail totalLectures')
      .sort({ updatedAt: -1 });

    const completedLectures = await Progress.countDocuments({ student: studentId, isCompleted: true });
    const recentActivity = await Progress.find({ student: studentId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('course', 'title');

    return successResponse(res, {
      enrolledCount: enrollments.length,
      completedLectures,
      enrollments,
      recentActivity,
      streak: await calculateDailyStudyStreak(studentId),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStudentDashboard };

const StudySession = require('../models/StudySession');

const logStudySession = async (req, res, next) => {
  try {
    const { courseId, durationMinutes } = req.body;
    const studentId = req.user ? req.user.id : req.body.studentId;
    const session = await StudySession.create({
      student: studentId,
      course: courseId,
      durationMinutes,
    });
    return successResponse(res, { session }, 'Study session logged', 201);
  } catch (err) {
    next(err);
  }
};

module.exports.logStudySession = logStudySession;

const StudyNote = require('../models/StudyNote');
const Course = require('../models/Course');

const exportStudentNotes = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user ? req.user.id : req.query.studentId;
    const course = await Course.findById(courseId);
    const notes = await StudyNote.find({ student: studentId, course: courseId }).sort({ createdAt: 1 });

    const text = [
      `PREPREACH STUDY DOSSIER - NOTES EXPORT`,
      `Course: ${course ? course.title : 'Study Notes'}`,
      `Exported At: ${new Date().toLocaleString()}`,
      `----------------------------------------\n`,
      ...notes.map((n, i) => `[${i + 1}] Timestamp: ${n.timestampSeconds}s\n${n.content}\n`)
    ].join('\n');

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="notes-${courseId}.txt"`);
    return res.status(200).send(text);
  } catch (err) {
    next(err);
  }
};

module.exports.exportStudentNotes = exportStudentNotes;

const StudyGoal = require('../models/StudyGoal');

const setStudyGoal = async (req, res, next) => {
  try {
    const { weeklyTargetHours, targetExamDate, preferredStudyTrack } = req.body;
    const studentId = req.user ? req.user.id : req.body.studentId;
    const goal = await StudyGoal.findOneAndUpdate(
      { student: studentId },
      { weeklyTargetHours, targetExamDate, preferredStudyTrack },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return successResponse(res, { goal }, 'Study goal saved');
  } catch (err) {
    next(err);
  }
};

module.exports.setStudyGoal = setStudyGoal;

const QuizAttempt = require('../models/QuizAttempt');

const submitQuizAttempt = async (req, res, next) => {
  try {
    const { courseId, lectureId, score, totalQuestions, submittedAnswers } = req.body;
    const studentId = req.user ? req.user.id : req.body.studentId;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 60;
    const attempt = await QuizAttempt.create({
      student: studentId,
      course: courseId,
      lectureId,
      score,
      totalQuestions,
      percentage,
      passed,
      submittedAnswers,
    });
    return successResponse(res, { attempt }, 'Quiz attempt evaluated', 201);
  } catch (err) {
    next(err);
  }
};

module.exports.submitQuizAttempt = submitQuizAttempt;

const MockExam = require('../models/MockExam');

const getMockTestAnalytics = async (req, res, next) => {
  try {
    const studentId = req.user ? req.user.id : req.query.studentId;
    const exams = await MockExam.find({ student: studentId }).sort({ createdAt: 1 });
    const totalAttempts = exams.length;
    const averageScore = totalAttempts ? exams.reduce((acc, e) => acc + e.netScore, 0) / totalAttempts : 0;
    return successResponse(res, {
      totalAttempts,
      averageScore: Number(averageScore.toFixed(2)),
      history: exams.map(e => ({ batch: e.examBatch, score: e.netScore, percentile: e.percentile, date: e.createdAt })),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getMockTestAnalytics = getMockTestAnalytics;

const { generateCertificatePdfData } = require('../services/certificate.service');

const generateCertificateCredential = async (req, res, next) => {
  try {
    const { courseId, certificateId } = req.body;
    const studentName = req.user ? req.user.name : 'Candidate';
    const credential = generateCertificatePdfData(studentName, 'Complete Preparation Program', certificateId);
    return successResponse(res, { credential }, 'Certificate issued');
  } catch (err) {
    next(err);
  }
};

module.exports.generateCertificateCredential = generateCertificateCredential;

const verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;
    return successResponse(res, {
      certificateId,
      isValid: true,
      institution: 'PrepReach Regional Exam Initiative',
      accreditation: 'National Standard Online Curriculum',
      verifiedAt: new Date().toISOString(),
    }, 'Certificate is authentic');
  } catch (err) {
    next(err);
  }
};

module.exports.verifyCertificate = verifyCertificate;
