const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
        unique: true
    },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true, unique: true },
    studentCode: { type: String, required: true, unique: true, trim: true },
    enrollmentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive', 'graduated', 'dropped'], default: 'active' },
}, { timestamps: true, versionKey: false });
module.exports = mongoose.model('Student', studentSchema);