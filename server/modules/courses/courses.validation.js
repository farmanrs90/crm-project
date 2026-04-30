const Joi = require("joi");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const courseSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),

  category: objectId.required().messages({
    "string.pattern.base": "Invalid category ID",
  }),

  durationMonths: Joi.number().integer().min(1).required(),

  price: Joi.number().min(0).required(),

  description: Joi.string().allow(""),

  isActive: Joi.boolean(),

  syllabus: Joi.string().allow(""),
});

module.exports = { courseSchema };