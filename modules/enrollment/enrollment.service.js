const Enrollment = require('./enrollment.model');
const createEnrollmentService = async (enrollmentData) => {
    return await Enrollment.create(enrollmentData);
};
const getEnrollmentByIdService = async (enrollmentId) => {
    return await Enrollment.findById(enrollmentId).populate('student group paymentPlan');
};
const getAllEnrollmentsService = async () => {
    return await Enrollment.find().populate('student group paymentPlan');
};
const updateEnrollmentService = async (enrollmentId, updateData) => {
    return await Enrollment.findByIdAndUpdate(enrollmentId, updateData, { new: true }).populate('student group paymentPlan');
};
const deleteEnrollmentService = async (enrollmentId) => {
    return await Enrollment.findByIdAndDelete(enrollmentId);
};
module.exports = {
    createEnrollmentService,
    getEnrollmentByIdService,
    getAllEnrollmentsService,
    updateEnrollmentService,
    deleteEnrollmentService
}