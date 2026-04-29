const {
    createGroupService,
    getGroupByIdService,
    getAllGroupsService,
    updateGroupService,
    deleteGroupService
} = require('./group.service');

const createGroupController = async (req, res,next) => {
    try {
        const group = await createGroupService(req.body);
        res.status(201).json(group);
    } catch (error) {
        next(error);
    }
};

const getGroupByIdController = async (req, res,next) => {
    try {
        const group = await getGroupByIdService(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        next(error);
    }
};

const getAllGroupsController = async (req, res,next) => {
    try {
        const groups = await getAllGroupsService();
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
};

const updateGroupController = async (req, res,next) => {
    try {
        const group = await updateGroupService(req.params.id, req.body);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        next(error);
    }
};

const deleteGroupController = async (req, res,next) => {
    try {
        const group = await deleteGroupService(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createGroupController,
    getGroupByIdController,
    getAllGroupsController,
    updateGroupController,
    deleteGroupController
};