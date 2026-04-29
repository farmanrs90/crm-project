const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
    enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
    lessonDate: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late', 'excused'], default: 'present', required: true },
    note: { type: String, trim: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, { timestamps: true, versionKey: false });
attendanceSchema.index({ enrollment: 1, lessonDate: 1 }, { unique: true });
module.exports = mongoose.model('Attendance', attendanceSchema);
