const exspress = require('express');
const routerGroup = exspress.Router();
const {groupSchema} = require('./group.validation');
const validateObjectId = require('../../common/middleware/validateObjectId');
const validate = require('../../common/middleware/validate');
const {createGroupController, getAllGroupsController, getGroupByIdController, updateGroupController, deleteGroupController} = require('./group.controller');

routerGroup.post('/', validate(groupSchema), createGroupController);
routerGroup.get('/', getAllGroupsController);
routerGroup.get('/:id', validateObjectId('id'), getGroupByIdController);
routerGroup.put('/:id', validateObjectId('id'), validate(groupSchema), updateGroupController);
routerGroup.delete('/:id', validateObjectId('id'), deleteGroupController);
module.exports = routerGroup;