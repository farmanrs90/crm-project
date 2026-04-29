const Joi = require('joi');

const leadSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  source: Joi.string()
    .valid('Website', 'Referral', 'Social Media', 'Other')
    .required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      'string.pattern.base': 'Phone must be 10 digits',
    })
    .optional(),
});

module.exports = { leadSchema };