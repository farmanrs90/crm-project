const Teacher = require('./teacher.model');
const User = require('../user/user.model');
const Course = require('../courses/courses.model');

async function createTeacher(data) {
  if (data.user) {
    const u = await User.findById(data.user);
    if (!u) throw new Error('Linked user not found');
  }
  if (data.courses && data.courses.length) {
    // Optional: validate courses exist (skip for brevity)
  }
  const teacher = await Teacher.create(data);
  return teacher;
}

async function getTeachers({ page = 1, limit = 20 } = {}) {
  const skip = (Math.max(1, page) - 1) * limit;
  const [items, total] = await Promise.all([
    Teacher.find().populate('user courses').skip(skip).limit(limit).lean(),
    Teacher.countDocuments()
  ]);
  return { items, total };
}

async function getTeacherById(id) {
  return Teacher.findById(id).populate('user courses');
}

async function updateTeacher(id, data) {
  return Teacher.findByIdAndUpdate(id, data, { new: true });
}

async function deleteTeacher(id) {
  return Teacher.findByIdAndDelete(id);
}

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
};