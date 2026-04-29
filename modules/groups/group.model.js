const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true,trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    capacity: { type: Number, min:1,default: 15 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true,versionKey: false });
module.exports = mongoose.model('Group', groupSchema);


