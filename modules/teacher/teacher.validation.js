const Joi = require('joi');

const idStr = Joi.string().hex().length(24);

const createTeacherSchema = Joi.object({
  user: idStr.optional(),
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null),
  subjects: Joi.array().items(Joi.string()).optional(),
  courses: Joi.array().items(idStr).optional(),
  hireDate: Joi.date().optional(),
  isActive: Joi.boolean().optional()
});

const updateTeacherSchema = Joi.object({
  user: idStr.optional(),
  firstName: Joi.string().min(2).max(100).optional(),
  lastName: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().allow('', null),
  subjects: Joi.array().items(Joi.string()).optional(),
  courses: Joi.array().items(idStr).optional(),
  hireDate: Joi.date().optional(),
  isActive: Joi.boolean().optional()
});

module.exports = { createTeacherSchema, updateTeacherSchema };