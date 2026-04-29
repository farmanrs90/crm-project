const express=require('express');
const routerEnrollment=express.Router();
const validateObjectId=require('../../common/middleware/validateObjectId');
const {enrollmentSchema}=require('./enrollment.validation');
const validate=require('../../common/middleware/validate');
const {
    createEnrollmentController,
    getAllEnrollmentsController,
    getEnrollmentByIdController,
    updateEnrollmentController,
    deleteEnrollmentController
} = require('./enrollment.controller');
routerEnrollment.post('/', validate(enrollmentSchema), createEnrollmentController);
routerEnrollment.get('/', getAllEnrollmentsController);
routerEnrollment.get('/:id', validateObjectId('id'), getEnrollmentByIdController);
routerEnrollment.put('/:id', validateObjectId('id'), validate(enrollmentSchema), updateEnrollmentController);
routerEnrollment.delete('/:id', validateObjectId('id'), deleteEnrollmentController);
module.exports=routerEnrollment;