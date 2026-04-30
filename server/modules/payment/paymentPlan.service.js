const PaymentPlan = require('./paymentPlan.model');
const createPaymentPlanService = async (paymentPlanData) => {
    return await PaymentPlan.create(paymentPlanData);
};

const getPaymentPlanByIdService = async (id) => {
    return await PaymentPlan.findById(id);
};
const getAllPaymentPlansService = async () => {
    return await PaymentPlan.find();
};

const updatePaymentPlanService = async (id, paymentPlanData) => {
    return await PaymentPlan.findByIdAndUpdate(id, paymentPlanData, { new: true });
};

const deletePaymentPlanService = async (id) => {
    return await PaymentPlan.findByIdAndDelete(id);

};  
module.exports = {
    createPaymentPlanService,
    getPaymentPlanByIdService,
    getAllPaymentPlansService,
    updatePaymentPlanService,
    deletePaymentPlanService
};
