const express = require('express');
const routerPayment = express.Router();
const validateObjectId = require('../../common/middleware/validateObjectId');
const { paymentSchema, paymentUpdateSchema } = require('./payment.validation');
const validate = require('../../common/middleware/validate');
const { checkRole } = require('../../common/middleware/permissions');
const auth = require('../../common/middleware/auth');
const {
    createPaymentController,
    getPaymentByIdController,
    getAllPaymentsController,
    updatePaymentController,
    deletePaymentController
} = require('./payment.controller');

// Create payment - Admin, Accountant, Manager
routerPayment.post('/', auth, checkRole('admin', 'accountant', 'manager'), validate(paymentSchema), createPaymentController);

// Get single payment - Admin, Accountant, Manager, Teacher
routerPayment.get('/:id', auth, checkRole('admin', 'accountant', 'manager', 'teacher'), validateObjectId('id'), getPaymentByIdController);

// Get all payments - Admin, Accountant, Manager
routerPayment.get('/', auth, checkRole('admin', 'accountant', 'manager'), getAllPaymentsController);

// Update payment - Admin, Accountant
routerPayment.put('/:id', auth, checkRole('admin', 'accountant'), validateObjectId('id'), validate(paymentUpdateSchema), updatePaymentController);

// Delete payment - Admin only
routerPayment.delete('/:id', auth, checkRole('admin'), validateObjectId('id'), deletePaymentController);

module.exports = routerPayment;