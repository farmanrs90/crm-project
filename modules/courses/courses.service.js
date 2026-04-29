const courses = require('../../modules/courses/courses.model');

const createCourse = async (data) => {
    return await courses.create(data);
};

const getCourses = async () => {
    return await courses.find().populate('category');
};
const getCourseById = async (id) => {
    return await courses.findById(id).populate('category');
};

const updateCourse = async (id, data) => {
    return await courses.findByIdAndUpdate(id, data, { new: true });
}

const deleteCourse = async (id) => {
    return await courses.findByIdAndDelete(id);
}
module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};