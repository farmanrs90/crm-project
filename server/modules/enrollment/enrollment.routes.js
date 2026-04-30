const express=require('express');
const routerEnrollment=express.Router();
const validateObjectId=require('../../common/middleware/validateObjectId');
const {enrollmentSchema}=require('./enrollment.validation');
const validate=require('../../common/middleware/validate');
const auth=require('../../common/middleware/auth');
const {
    createEnrollmentController,
    getAllEnrollmentsController,
    getEnrollmentByIdController,
    updateEnrollmentController,
    deleteEnrollmentController
} = require('./enrollment.controller');
routerEnrollment.post('/', auth, validate(enrollmentSchema), createEnrollmentController);
routerEnrollment.get('/', auth, getAllEnrollmentsController);
routerEnrollment.get('/:id', auth, validateObjectId('id'), getEnrollmentByIdController);
routerEnrollment.put('/:id', auth, validateObjectId('id'), validate(enrollmentSchema), updateEnrollmentController);
routerEnrollment.delete('/:id', auth, validateObjectId('id'), deleteEnrollmentController);
module.exports=routerEnrollment;