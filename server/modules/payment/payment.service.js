const Payment = require('./payment.model');

const createPaymentService = async (paymentData) => {
  return await Payment.create(paymentData);
};

const getPaymentByIdService = async (paymentId) => {
  return await Payment.findById(paymentId).populate('paymentPlan');
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
    Payment.find(query).populate('paymentPlan').sort(sort).skip(skip).limit(l)
  ]);

  const pages = Math.max(1, Math.ceil(total / l));
  return { data, total, page: p, pages, limit: l };
};

const updatePaymentService = async (paymentId, paymentData) => {
  return await Payment.findByIdAndUpdate(paymentId, paymentData, { new: true }).populate('paymentPlan');
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