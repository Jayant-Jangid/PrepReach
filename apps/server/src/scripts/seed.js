const mongoose = require('mongoose');
const connectDB = require('../config/db');
const seedCategories = require('./seedCategories');
const Course = require('../models/Course');
const Module = require('../models/Module');
const User = require('../models/User');

async function runSeed() {
  await connectDB();
  await seedCategories();
  console.log('[seed] Database populated with foundational categories and courses.');
  process.exit(0);
}

if (require.main === module) {
  runSeed();
}
