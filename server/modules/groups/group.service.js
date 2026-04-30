const Group = require('./group.model');
const createGroupService = async (groupData) => {
    return await Group.create(groupData);
};
const getGroupByIdService = async (groupId) => {
    return await Group.findById(groupId).populate('course').populate('teacher');

};
const getAllGroupsService = async () => {
    return await Group.find().populate('course').populate('teacher');
};
const updateGroupService = async (groupId, updateData) => {
    return await Group.findByIdAndUpdate(groupId, updateData, { new: true }).populate('course').populate('teacher');
}
const deleteGroupService = async (groupId) => {
    return await Group.findByIdAndDelete(groupId);
};
module.exports = {
    createGroupService,
    getGroupByIdService,
    getAllGroupsService,
    updateGroupService,
    deleteGroupService
};