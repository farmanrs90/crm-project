const mongoose = require('mongoose');
const enrollmentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    paymentPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentPlan', required: true },
    enrolledAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'paused', 'completed', 'cancelled'], default: 'active' },
}, { timestamps: true, versionKey: false });
enrollmentSchema.index({ student: 1, group: 1 }, { unique: true });
module.exports = mongoose.model('Enrollment', enrollmentSchema);