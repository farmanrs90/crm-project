const exspress = require('express');
const routerGroup = exspress.Router();
const { groupSchema, groupUpdateSchema } = require('./group.validation');
const validateObjectId = require('../../common/middleware/validateObjectId');
const validate = require('../../common/middleware/validate');
const { checkRole } = require('../../common/middleware/permissions');
const auth = require('../../common/middleware/auth');
const { createGroupController, getAllGroupsController, getGroupByIdController, updateGroupController, deleteGroupController } = require('./group.controller');

// Create group - Admin, Manager
routerGroup.post('/', auth, checkRole('admin', 'manager'), validate(groupSchema), createGroupController);

// Get all groups - Admin, Manager, Teacher, Student
routerGroup.get('/', auth, checkRole('admin', 'manager', 'teacher', 'student'), getAllGroupsController);

// Get single group - Admin, Manager, Teacher, Student
routerGroup.get('/:id', auth, checkRole('admin', 'manager', 'teacher', 'student'), validateObjectId('id'), getGroupByIdController);

// Update group - Admin, Manager
routerGroup.put('/:id', auth, checkRole('admin', 'manager'), validateObjectId('id'), validate(groupUpdateSchema), updateGroupController);

// Delete group - Admin only
routerGroup.delete('/:id', auth, checkRole('admin'), validateObjectId('id'), deleteGroupController);

module.exports = routerGroup;