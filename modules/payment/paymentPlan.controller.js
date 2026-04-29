const {
    createPaymentPlanService,
    getPaymentPlanByIdService,
    getAllPaymentPlansService,
    updatePaymentPlanService,
    deletePaymentPlanService
} = require('./paymentPlan.service');
const createPaymentPlanController = async (req, res,next) => {
    try {
        const paymentPlanData = req.body;
        const newPaymentPlan = await createPaymentPlanService(paymentPlanData);
        res.status(201).json(newPaymentPlan);
    } catch (error) {
        next(error);
    }
};
const getPaymentPlanByIdController = async (req, res,next) => {
    try {
        const { id } = req.params;
        const paymentPlan = await getPaymentPlanByIdService(id);
        if (!paymentPlan) {
            return res.status(404).json({ message: 'Payment plan not found' });
        }
        res.json(paymentPlan);
    } catch (error) {
        next(error);
    }
};
const getAllPaymentPlansController = async (req, res,next) => {
    try {
        const paymentPlans = await getAllPaymentPlansService();
        res.json(paymentPlans);
    } catch (error) {
        next(error);
    }
};
const updatePaymentPlanController = async (req, res,next) => {
    try {
        const { id } = req.params;
        const paymentPlanData = req.body;
        const updatedPaymentPlan = await updatePaymentPlanService(id, paymentPlanData);
        if (!updatedPaymentPlan) {
            return res.status(404).json({ message: 'Payment plan not found' });
        }
        res.json(updatedPaymentPlan);
    } catch (error) {
        next(error);
    }
};
const deletePaymentPlanController = async (req, res,next) => {
    try {
        const { id } = req.params;
        const deletedPaymentPlan = await deletePaymentPlanService(id);
        if (!deletedPaymentPlan) {
            return res.status(404).json({ message: 'Payment plan not found' });
        }
        res.json({ message: 'Payment plan deleted successfully' });
    } catch (error) {
        next(error);
    }

};  
module.exports = {
    createPaymentPlanController,
    getPaymentPlanByIdController,
    getAllPaymentPlansController,
    updatePaymentPlanController,
    deletePaymentPlanController
};