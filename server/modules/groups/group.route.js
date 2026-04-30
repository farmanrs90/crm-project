const exspress = require('express');
const routerGroup = exspress.Router();
const {groupSchema} = require('./group.validation');
const validateObjectId = require('../../common/middleware/validateObjectId');
const validate = require('../../common/middleware/validate');
const auth = require('../../common/middleware/auth');
const {createGroupController, getAllGroupsController, getGroupByIdController, updateGroupController, deleteGroupController} = require('./group.controller');

routerGroup.post('/', auth, validate(groupSchema), createGroupController);
routerGroup.get('/', auth, getAllGroupsController);
routerGroup.get('/:id', auth, validateObjectId('id'), getGroupByIdController);
routerGroup.put('/:id', auth, validateObjectId('id'), validate(groupSchema), updateGroupController);
routerGroup.delete('/:id', auth, validateObjectId('id'), deleteGroupController);
module.exports = routerGroup;