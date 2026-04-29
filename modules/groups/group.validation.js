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

module.exports = { groupSchema };