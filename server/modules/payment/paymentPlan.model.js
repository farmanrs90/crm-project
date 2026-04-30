const mongoose = require('mongoose');
const paymentPlanSchema = new mongoose.Schema({
    planType: { type: String, enum: ['full', 'installments'], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    note: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false });
module.exports = mongoose.model('PaymentPlan', paymentPlanSchema);
