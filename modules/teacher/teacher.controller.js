const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
} = require('./teacher.service');

const createTeacherController = async (req, res, next) => {
  try {
    const t = await createTeacher(req.body);
    res.status(201).json(t);
  } catch (err) {
    next(err);
  }
};

const listTeachersController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const data = await getTeachers({ page, limit });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getTeacherController = async (req, res, next) => {
  try {
    const t = await getTeacherById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Teacher not found' });
    res.json(t);
  } catch (err) {
    next(err);
  }
};

const updateTeacherController = async (req, res, next) => {
  try {
    const t = await updateTeacher(req.params.id, req.body);
    res.json(t);
  } catch (err) {
    next(err);
  }
};

const deleteTeacherController = async (req, res, next) => {
  try {
    await deleteTeacher(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTeacherController,
  listTeachersController,
  getTeacherController,
  updateTeacherController,
  deleteTeacherController
};