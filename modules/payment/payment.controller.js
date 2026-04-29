const {
  createPaymentService,
  getPaymentByIdService,
  getAllPaymentsService,
  updatePaymentService,
  deletePaymentService
} = require('./payment.service');

const createPaymentController = async (req, res, next) => {
  try {
    const paymentData = req.body;
    const newPayment = await createPaymentService(paymentData);
    res.status(201).json(newPayment);
  } catch (error) {
    next(error);
  }
};

const getPaymentByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await getPaymentByIdService(id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

const getAllPaymentsController = async (req, res, next) => {
  try {
    const { page, limit, status, paymentPlan, method, search, sortBy, sortOrder } = req.query;
    const result = await getAllPaymentsService({ page, limit, status, paymentPlan, method, search, sortBy, sortOrder });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updatePaymentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const paymentData = req.body;
    const updatedPayment = await updatePaymentService(id, paymentData);
    if (!updatedPayment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json(updatedPayment);
  } catch (error) {
    next(error);
  }
};

const deletePaymentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPayment = await deletePaymentService(id);
    if (!deletedPayment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentController,
  getPaymentByIdController,
  getAllPaymentsController,
  updatePaymentController,
  deletePaymentController
};