const express = require('express');
const routerPayment = express.Router();
const validateObjectId = require('../../common/middleware/validateObjectId');
const { paymentSchema } = require('./payment.validation');
const validate = require('../../common/middleware/validate');
const auth   = require('../../common/middleware/auth');
const {
    createPaymentController,
    getPaymentByIdController,
    getAllPaymentsController,
    updatePaymentController,
    deletePaymentController
} = require('./payment.controller');
routerPayment.post('/', auth, validate(paymentSchema), createPaymentController);
routerPayment.get('/:id', auth, validateObjectId('id'), getPaymentByIdController);
routerPayment.get('/', auth, getAllPaymentsController);
routerPayment.put('/:id', auth, validateObjectId('id'), validate(paymentSchema), updatePaymentController);
routerPayment.delete('/:id', auth, validateObjectId('id'), deletePaymentController);
module.exports = routerPayment;