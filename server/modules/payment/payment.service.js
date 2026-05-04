const Payment = require('./payment.model');
const { syncStudentFromPaidPayment } = require('../student/student.service');

const createPaymentService = async (paymentData) => {
  const payment = await Payment.create(paymentData);
  await syncStudentFromPaidPayment(payment);
  return payment;
};

const getPaymentByIdService = async (paymentId) => {
  return await Payment.findById(paymentId).populate('paymentPlan lead');
};

const getAllPaymentsService = async (opts = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    paymentPlan,
    method,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = opts;

  const query = {};
  if (status) query.status = status;
  if (paymentPlan) query.paymentPlan = paymentPlan;
  if (method) query.method = method;
  if (search) query.$or = [
    { note: { $regex: search, $options: 'i' } }
  ];

  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (p - 1) * l;
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [total, data] = await Promise.all([
    Payment.countDocuments(query),
    Payment.find(query).populate('paymentPlan lead').sort(sort).skip(skip).limit(l)
  ]);

  const pages = Math.max(1, Math.ceil(total / l));
  return { data, total, page: p, pages, limit: l };
};

const updatePaymentService = async (paymentId, paymentData) => {
  const existingPayment = await Payment.findById(paymentId);
  if (!existingPayment) {
    return null;
  }

  if (existingPayment.status === 'paid' && paymentData.status && paymentData.status !== 'paid') {
    throw new Error('Paid payments cannot be moved back to another status');
  }

  const updatedPayment = await Payment.findByIdAndUpdate(paymentId, paymentData, { new: true }).populate('paymentPlan lead');
  if (updatedPayment) {
    await syncStudentFromPaidPayment(updatedPayment);
  }
  return updatedPayment;
};

const deletePaymentService = async (paymentId) => {
  return await Payment.findByIdAndDelete(paymentId);
};

module.exports = {
  createPaymentService,
  getPaymentByIdService,
  getAllPaymentsService,
  updatePaymentService,
  deletePaymentService
};