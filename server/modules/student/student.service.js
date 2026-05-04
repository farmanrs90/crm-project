const Student = require('./student.model');
const User = require('../user/user.model');
const Lead = require('../leads/leads.model');
const Payment = require('../payment/payment.model');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const generateStudentCode = () => 'S' + crypto.randomBytes(4).toString('hex').toUpperCase();

const SALT_ROUNDS = 10;

const getObjectId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value._id) return String(value._id);
  return '';
};

const ensureStudentUser = async (lead) => {
  const existingUser = await User.findOne({ email: lead.email });
  if (existingUser) {
    return existingUser;
  }

  const hashedPassword = await bcrypt.hash('Student12345', SALT_ROUNDS);
  return await User.create({
    name: `${lead.firstName} ${lead.lastName}`.trim(),
    email: lead.email,
    password: hashedPassword,
    role: 'student'
  });
};

const createStudentFromLead = async (lead) => {
  if (!lead) return null;

  const leadId = getObjectId(lead);
  const leadDoc = lead && lead._id ? lead : await Lead.findById(leadId);
  if (!leadDoc || leadDoc.status !== 'Accepted') {
    return null;
  }

  const existingStudent = await Student.findOne({ lead: leadDoc._id });
  if (existingStudent) {
    return existingStudent;
  }

  const hasPaidPayment = await Payment.exists({ lead: leadDoc._id, status: 'paid' });
  if (!hasPaidPayment) {
    return null;
  }

  const user = await ensureStudentUser(leadDoc);

  let studentCode;
  do {
    studentCode = generateStudentCode();
  } while (await Student.findOne({ studentCode }));

  const student = await Student.create({
    user: user._id,
    lead: leadDoc._id,
    studentCode,
    enrollmentDate: new Date(),
    status: 'active'
  });

  await Payment.updateMany(
    { lead: leadDoc._id, status: 'paid', student: { $exists: false } },
    { student: student._id }
  );

  return student;
};

const syncStudentFromPaidPayment = async (payment) => {
  if (!payment) return null;

  const paymentLeadId = getObjectId(payment.lead);
  if (!paymentLeadId || payment.status !== 'paid') {
    return null;
  }

  const lead = await Lead.findById(paymentLeadId);
  const student = await createStudentFromLead(lead);
  if (student && payment._id) {
    await Payment.findByIdAndUpdate(payment._id, { student: student._id });
  }
  return student;
};

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
  if (updateData.user || updateData.lead || updateData.studentCode) {
    throw new Error('user, lead, and studentCode are immutable after student creation');
  }

  const currentStudent = await Student.findById(studentId);
  if (!currentStudent) return null;

  const allowedStatusFlow = {
    active: ['inactive', 'graduated', 'dropped'],
    inactive: ['active', 'graduated', 'dropped'],
    graduated: [],
    dropped: []
  };

  if (updateData.status && updateData.status !== currentStudent.status) {
    const allowed = allowedStatusFlow[currentStudent.status] || [];
    if (!allowed.includes(updateData.status)) {
      throw new Error(`Student status cannot move from ${currentStudent.status} to ${updateData.status}`);
    }
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
  deleteStudentService,
  createStudentFromLead,
  syncStudentFromPaidPayment
};