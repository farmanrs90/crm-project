const express = require('express');
const routercourses = express.Router();
const validateObjectId = require('../../common/middleware/validateObjectId');
const coursesController = require('./courses.controller');
const { courseSchema } = require('./courses.validation');
const validate = require('../../common/middleware/validate')
const auth = require('../../common/middleware/auth');
const {createCourse, getCourses, getCourseById, updateCourse, deleteCourse} = coursesController;
routercourses.post('/', auth, validate(courseSchema), createCourse);
routercourses.get('/', auth, getCourses);
routercourses.get('/:id', auth, validateObjectId('id'), getCourseById);
routercourses.put('/:id', auth, validateObjectId('id'), validate(courseSchema), updateCourse);
routercourses.delete('/:id', auth, validateObjectId('id'), deleteCourse);
module.exports = routercourses;