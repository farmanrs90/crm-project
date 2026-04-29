const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const enrollmentSchema = Joi.object({
    student: objectId.required().messages({
        'string.pattern.base': 'Invalid student ID'
    }),
    group: objectId.required().messages({
        'string.pattern.base': 'Invalid group ID'
    }),
    paymentPlan: objectId.required().messages({
        'string.pattern.base': 'Invalid paymentPlan ID'
    }),
    enrolledAt: Joi.date().optional(),
    status: Joi.string().valid('active', 'paused', 'completed', 'cancelled').optional(),
});

module.exports = { enrollmentSchema };