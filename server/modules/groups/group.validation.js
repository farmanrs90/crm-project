const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const groupSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required(),
  course: objectId.required().messages({
    'string.pattern.base': 'Invalid course ID',
  }),
  teacher: objectId.required().messages({
    'string.pattern.base': 'Invalid teacher ID',
  }),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).optional(),
  capacity: Joi.number().integer().min(1).default(15),
  isActive: Joi.boolean().optional(),
});

const groupUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().optional(),
  course: objectId.optional().messages({
    'string.pattern.base': 'Invalid course ID',
  }),
  teacher: objectId.optional().messages({
    'string.pattern.base': 'Invalid teacher ID',
  }),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  capacity: Joi.number().integer().min(1).optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

module.exports = { groupSchema, groupUpdateSchema };