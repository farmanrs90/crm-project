const Joi = require('joi');
const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const studentSchema = Joi.object({
  user: objectId.required().messages({ 'string.pattern.base': 'Invalid user ID' }),
  lead: objectId.required().messages({ 'string.pattern.base': 'Invalid lead ID' }),
  studentCode: Joi.string().min(3).max(20).required(),
  enrollmentDate: Joi.date().optional(),
  status: Joi.string().valid('active','inactive','graduated','dropped').optional()
});

const studentUpdateSchema = Joi.object({
  enrollmentDate: Joi.date().optional(),
  status: Joi.string().valid('active','inactive','graduated','dropped').optional()
}).min(1);

module.exports = {
  studentSchema,
  studentUpdateSchema
};