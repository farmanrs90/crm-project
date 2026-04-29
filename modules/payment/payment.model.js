const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({ 
    paymentPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentPlan', required: true },
    installmentNumber: { type: Number, required: true, min: 1 },
    amountPaid: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date },
    status: { type: String, enum: ['pending', 'paid', 'overdue', 'cancelled'], default: 'pending' },
    note: { type: String, trim: true },
    method: { type: String, enum: ['cash', 'credit_card', 'bank_transfer', 'other'], required: true },
}, { timestamps: true, versionKey: false });
paymentSchema.index({ paymentPlan: 1, installmentNumber: 1 }, { unique: true });
module.exports = mongoose.model('Payment', paymentSchema);
