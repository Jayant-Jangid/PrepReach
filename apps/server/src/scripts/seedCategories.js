const mongoose = require('mongoose');
const Category = require('../models/Category');

const defaultCategories = [
  { name: 'Civil Service', slug: 'civil_service', icon: 'Landmark', description: 'UPSC and State Administrative Examination prep modules.' },
  { name: 'Public Banking', slug: 'public_banking', icon: 'Building2', description: 'IBPS, SBI PO, and Clerk comprehensive mock tracks.' },
  { name: 'Railway Recruitment', slug: 'railway', icon: 'Train', description: 'RRB NTPC, Group D technical and general studies modules.' },
  { name: 'Municipal & State', slug: 'municipal', icon: 'ShieldCheck', description: 'Municipal corporation and regional state service curricula.' }
];

async function seedCategories() {
  for (const cat of defaultCategories) {
    await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
  }
  console.log('[seed] Default categories seeded successfully.');
}

module.exports = seedCategories;
