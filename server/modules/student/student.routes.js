const express = require('express');
const routerStudent = express.Router();
const validateObjectId = require('../../common/middleware/validateObjectId');
const { studentSchema,studentUpdateSchema } = require('./student.validation');
const validate = require('../../common/middleware/validate');
const auth = require('../../common/middleware/auth');
const{
    createStudentController,
    getAllStudentsController,
    getStudentByIdController,
    updateStudentController,
    deleteStudentController
}=require('./student.controller');

routerStudent.post('/', auth, validate(studentSchema), createStudentController);
routerStudent.get('/', auth, getAllStudentsController);
routerStudent.get('/:id', auth, validateObjectId('id'), getStudentByIdController);
routerStudent.put('/:id', auth, validateObjectId('id'), validate(studentUpdateSchema), updateStudentController);
routerStudent.delete('/:id', auth, validateObjectId('id'), deleteStudentController);
module.exports=routerStudent;