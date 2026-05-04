const Joi = require('joi');

const leadSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      'string.pattern.base': 'Phone must be 10 digits',
    })
    .required(),
  email: Joi.string().email().required(),
  source: Joi.string()
    .valid('Website', 'Referral', 'Social Media', 'Other')
    .required(),
  status: Joi.string().valid('New', 'Contacted', 'Qualified', 'Lost', 'Accepted').default('New'),
  courseInterested: Joi.string().allow('').optional(),
  assignedTo: Joi.string().allow('').optional(),
  utmSource: Joi.string().allow('').optional(),
  notes: Joi.string().allow('').optional(),
});

const leadUpdateSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      'string.pattern.base': 'Phone must be 10 digits',
    })
    .optional(),
  email: Joi.string().email().optional(),
  source: Joi.string()
    .valid('Website', 'Referral', 'Social Media', 'Other')
    .optional(),
  status: Joi.string().valid('New', 'Contacted', 'Qualified', 'Lost', 'Accepted').optional(),
  courseInterested: Joi.string().allow('').optional(),
  assignedTo: Joi.string().allow('').optional(),
  utmSource: Joi.string().allow('').optional(),
  notes: Joi.string().allow('').optional(),
}).min(1);

module.exports = { leadSchema, leadUpdateSchema };