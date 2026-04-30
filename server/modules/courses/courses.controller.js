const course = require('../courses/courses.service');
const createCourse = async (req, res, next) => {
    try {
        const newCourse = await course.createCourse(req.body);
        res.status(201).json(newCourse);
    } catch (error) {
        next(error);
    }
};
const getCourses = async (req, res, next) => {
    try {
        const courses = await course.getCourses();
        res.status(200).json(courses);
    } catch (error) {
        next(error);
    }
};
const getCourseById = async (req, res, next) => {
    try {
        const course = await course.getCourseById(req.params.id);
        res.status(200).json(course);
    } catch (error) {
        next(error);
    }
};
const updateCourse = async (req, res, next) => {
    try {
        const updatedCourse = await course.updateCourse(req.params.id, req.body);
        res.status(200).json(updatedCourse);
    } catch (error) {
        next(error);
    }
};
const deleteCourse = async (req, res, next) => {
    try {
        const deletedCourse = await course.deleteCourse(req.params.id);
        res.status(200).json(deletedCourse);
    } catch (error) {
        next(error);
    }
};
module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};