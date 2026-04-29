const express = require('express');
const routerPaymentPlan = express.Router();
const validateObjectId = require('../../common/middleware/validateObjectId');
const { paymentPlanSchema } = require('./paymentPlan.validation');
const validate = require('../../common/middleware/validate');
const {
    createPaymentPlanController,
    getPaymentPlanByIdController,
    getAllPaymentPlansController,
    updatePaymentPlanController,
    deletePaymentPlanController
} = require('./paymentPlan.controller');
routerPaymentPlan.post('/', validate(paymentPlanSchema), createPaymentPlanController);
routerPaymentPlan.get('/', getAllPaymentPlansController);
routerPaymentPlan.get('/:planid', validateObjectId('planid'), getPaymentPlanByIdController);
routerPaymentPlan.put('/:planid', validateObjectId('planid'), validate(paymentPlanSchema), updatePaymentPlanController);
routerPaymentPlan.delete('/:planid', validateObjectId('planid'), deletePaymentPlanController);
module.exports = routerPaymentPlan;