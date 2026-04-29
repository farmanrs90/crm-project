const Student = require('./student.model');
const User = require('../user/user.model');
const Lead = require('../leads/leads.model');
const crypto = require('crypto');

const generateStudentCode = () => 'S' + crypto.randomBytes(4).toString('hex').toUpperCase();

const createStudentService = async (studentData) => {
  const userExists = await User.findById(studentData.user);
  if (!userExists) throw new Error('Associated user not found');

  const leadExists = await Lead.findById(studentData.lead);
  if (!leadExists) throw new Error('Associated lead not found');

  const byUser = await Student.findOne({ user: studentData.user });
  if (byUser) throw new Error('A student with this user already exists');

  const byLead = await Student.findOne({ lead: studentData.lead });
  if (byLead) throw new Error('A student with this lead already exists');

  if (!studentData.studentCode) {
    let code;
    do {
      code = generateStudentCode();
    } while (await Student.findOne({ studentCode: code }));
    studentData.studentCode = code;
  } else {
    const conflict = await Student.findOne({ studentCode: studentData.studentCode });
    if (conflict) throw new Error('studentCode already in use');
  }

  return await Student.create(studentData);
};

const getStudentByIdService = async (studentId) => {
  return await Student.findById(studentId).populate('user lead');
};

const getAllStudentsService = async () => {
  return await Student.find().populate('user lead');
};

const updateStudentService = async (studentId, updateData) => {
  if (updateData.user) {
    const userExists = await User.findById(updateData.user);
    if (!userExists) throw new Error('Associated user not found');
    const conflict = await Student.findOne({ user: updateData.user, _id: { $ne: studentId } });
    if (conflict) throw new Error('Another student already linked to this user');
  }

  if (updateData.lead) {
    const leadExists = await Lead.findById(updateData.lead);
    if (!leadExists) throw new Error('Associated lead not found');
    const conflict = await Student.findOne({ lead: updateData.lead, _id: { $ne: studentId } });
    if (conflict) throw new Error('Another student already linked to this lead');
  }

  if (updateData.studentCode) {
    const conflict = await Student.findOne({ studentCode: updateData.studentCode, _id: { $ne: studentId } });
    if (conflict) throw new Error('studentCode already in use');
  }

  return await Student.findByIdAndUpdate(studentId, updateData, { new: true }).populate('user lead');
};

const deleteStudentService = async (studentId) => {
  return await Student.findByIdAndDelete(studentId);
};

module.exports = {
  createStudentService,
  getStudentByIdService,
  getAllStudentsService,
  updateStudentService,
  deleteStudentService
};