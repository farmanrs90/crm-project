const mongoose = require('mongoose');
const { Schema } = mongoose;

const teacherSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  subjects: [{ type: String }],
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  hireDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true,versionKey: false });

module.exports = mongoose.model('Teacher', teacherSchema);