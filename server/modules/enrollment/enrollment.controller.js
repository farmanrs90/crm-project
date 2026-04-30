const{createEnrollmentService,getEnrollmentByIdService,getAllEnrollmentsService,updateEnrollmentService,deleteEnrollmentService} = require('./enrollment.service');
const createEnrollmentController = async (req, res, next) => {
    try {
        const enrollment = await createEnrollmentService(req.body);
        res.status(201).json(enrollment);
    } catch (error) {
        next(error);
    }
};
const getEnrollmentByIdController = async (req, res, next) => {
    try {        const enrollment = await getEnrollmentByIdService(req.params.id);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        res.status(200).json(enrollment);
    } catch (error) {
        next(error);
    }
};
const getAllEnrollmentsController = async (req, res, next) => {
    try {
        const enrollments = await getAllEnrollmentsService();
        res.status(200).json(enrollments);
    } catch (error) {
        next(error);
    }
};
const updateEnrollmentController = async (req, res, next) => {
    try {
        const enrollment = await updateEnrollmentService(req.params.id, req.body);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        res.status(200).json(enrollment);
    } catch (error) {
        next(error);
    }
};
const deleteEnrollmentController = async (req, res, next) => {
    try {
        const enrollment = await deleteEnrollmentService(req.params.id);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        res.status(200).json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    createEnrollmentController,
    getEnrollmentByIdController,
    getAllEnrollmentsController,
    updateEnrollmentController,
    deleteEnrollmentController
}
