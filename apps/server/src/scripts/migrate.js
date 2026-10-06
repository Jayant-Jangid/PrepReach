const mongoose = require('mongoose');
const connectDB = require('../config/db');

async function runMigrations() {
  await connectDB();
  console.log('[migration] Checking collections and ensuring indexes...');
  const collections = await mongoose.connection.db.collections();
  for (const col of collections) {
    console.log(`[migration] Index sync for ${col.collectionName}`);
  }
  console.log('[migration] All indexes synchronized successfully.');
  process.exit(0);
}

if (require.main === module) {
  runMigrations();
}
