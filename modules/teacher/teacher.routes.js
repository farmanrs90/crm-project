const express = require('express');
const router = express.Router();
const auth = require('../../common/middleware/auth');
const validate = require('../../common/middleware/validate');
const validateObjectId = require('../../common/middleware/validateObjectId');
const { createTeacherSchema, updateTeacherSchema } = require('./teacher.validation');
const {
  createTeacherController,
  listTeachersController,
  getTeacherController,
  updateTeacherController,
  deleteTeacherController
} = require('./teacher.controller');

router.post('/', auth, validate(createTeacherSchema), createTeacherController);
router.get('/', auth, listTeachersController);
router.get('/:id', auth, validateObjectId('id'), getTeacherController);
router.put('/:id', auth, validateObjectId('id'), validate(updateTeacherSchema), updateTeacherController);
router.delete('/:id', auth, validateObjectId('id'), deleteTeacherController);

module.exports = router;