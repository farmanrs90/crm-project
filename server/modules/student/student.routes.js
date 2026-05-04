const express = require('express');
const routerStudent = express.Router();
const validateObjectId = require('../../common/middleware/validateObjectId');
const { studentSchema, studentUpdateSchema } = require('./student.validation');
const validate = require('../../common/middleware/validate');
const { checkRole } = require('../../common/middleware/permissions');
const auth = require('../../common/middleware/auth');
const {
    createStudentController,
    getAllStudentsController,
    getStudentByIdController,
    updateStudentController,
    deleteStudentController
} = require('./student.controller');

// Create student - Admin, Manager (from converted leads)
routerStudent.post('/', auth, checkRole('admin', 'manager'), validate(studentSchema), createStudentController);

// Get all students - Admin, Manager, Teacher, Accountant
routerStudent.get('/', auth, checkRole('admin', 'manager', 'teacher', 'accountant'), getAllStudentsController);

// Get single student - Admin, Manager, Teacher, Accountant, Student (own record)
routerStudent.get('/:id', auth, checkRole('admin', 'manager', 'teacher', 'accountant', 'student'), validateObjectId('id'), getStudentByIdController);

// Update student - Admin, Manager
routerStudent.put('/:id', auth, checkRole('admin', 'manager'), validateObjectId('id'), validate(studentUpdateSchema), updateStudentController);

// Delete student - Admin only
routerStudent.delete('/:id', auth, checkRole('admin'), validateObjectId('id'), deleteStudentController);

module.exports = routerStudent;