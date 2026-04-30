const express = require('express');
const routerPaymentPlan = express.Router();
const validateObjectId = require('../../common/middleware/validateObjectId');
const { paymentPlanSchema } = require('./paymentPlan.validation');
const validate = require('../../common/middleware/validate');
const auth = require('../../common/middleware/auth');
const {
    createPaymentPlanController,
    getPaymentPlanByIdController,
    getAllPaymentPlansController,
    updatePaymentPlanController,
    deletePaymentPlanController
} = require('./paymentPlan.controller');
routerPaymentPlan.post('/', auth, validate(paymentPlanSchema), createPaymentPlanController);
routerPaymentPlan.get('/', auth, getAllPaymentPlansController);
routerPaymentPlan.get('/:id', auth, validateObjectId('planid'), getPaymentPlanByIdController);
routerPaymentPlan.put('/:id', auth, validateObjectId('planid'), validate(paymentPlanSchema), updatePaymentPlanController);
routerPaymentPlan.delete('/:id', auth, validateObjectId('planid'), deletePaymentPlanController);
module.exports = routerPaymentPlan;