const Group = require('./group.model');
const Enrollment = require('../enrollment/enrollment.model');
const Course = require('../courses/courses.model');
const Teacher = require('../teacher/teacher.model');

const createGroupService = async (groupData) => {
    const courseExists = await Course.findById(groupData.course);
    if (!courseExists) throw new Error('Course not found');

    const teacherExists = await Teacher.findById(groupData.teacher);
    if (!teacherExists) throw new Error('Teacher not found');

    return await Group.create(groupData);
};
const getGroupByIdService = async (groupId) => {
    return await Group.findById(groupId).populate('course').populate('teacher');

};
const getAllGroupsService = async () => {
    return await Group.find().populate('course').populate('teacher');
};
const updateGroupService = async (groupId, updateData) => {
    const currentGroup = await Group.findById(groupId);
    if (!currentGroup) return null;

    const enrollmentCount = await Enrollment.countDocuments({ group: groupId, status: { $in: ['active', 'paused'] } });

    if (updateData.course && String(updateData.course) !== String(currentGroup.course) && enrollmentCount > 0) {
        throw new Error('Course cannot be changed while the group has active enrollments');
    }

    if (updateData.teacher && String(updateData.teacher) !== String(currentGroup.teacher) && enrollmentCount > 0) {
        throw new Error('Teacher cannot be changed while the group has active enrollments');
    }

    if (updateData.capacity !== undefined && Number(updateData.capacity) < enrollmentCount) {
        throw new Error('Capacity cannot be set below current active enrollment count');
    }

    if (updateData.course) {
        const courseExists = await Course.findById(updateData.course);
        if (!courseExists) throw new Error('Course not found');
    }

    if (updateData.teacher) {
        const teacherExists = await Teacher.findById(updateData.teacher);
        if (!teacherExists) throw new Error('Teacher not found');
    }

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