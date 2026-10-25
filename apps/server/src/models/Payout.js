const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    grossAmount: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending',
    },
    payoutMethod: {
      type: String,
      enum: ['bank_transfer', 'upi'],
      default: 'bank_transfer',
    },
    transactionRef: { type: String, default: '' },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payout', payoutSchema);
