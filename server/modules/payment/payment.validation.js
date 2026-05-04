const Joi = require('joi');
const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const paymentSchema = Joi.object({
  lead: objectId.optional().messages({
    'string.pattern.base': 'Invalid lead ID',
  }),
  student: objectId.optional().messages({
    'string.pattern.base': 'Invalid student ID',
  }),
  paymentPlan: objectId.required().messages({
    'string.pattern.base': 'Invalid paymentPlan ID',
    'any.required': 'Payment plan ID is required'
  }),
  installmentNumber: Joi.number().integer().min(1).required().messages({
    'number.base': 'Installment number must be a number',
    'number.integer': 'Installment number must be an integer',
    'number.min': 'Installment number must be at least 1',
    'any.required': 'Installment number is required'
  }),
  amountPaid: Joi.number().min(0).required().messages({
    'number.base': 'amountPaid must be a number',
    'number.min': 'amountPaid cannot be negative',
    'any.required': 'amountPaid is required'
  }),
  dueDate: Joi.date().required().messages({
    'date.base': 'dueDate must be a valid date',
    'any.required': 'dueDate is required'
  }),
  paidAt: Joi.date().optional().messages({
    'date.base': 'paidAt must be a valid date'
  }),
  status: Joi.string().valid('pending', 'paid', 'overdue', 'cancelled').optional().messages({
    'any.only': 'Status must be one of pending, paid, overdue, or cancelled',
    'string.base': 'Status must be a string'
  }),
  note: Joi.string().allow('').optional().messages({
    'string.base': 'Note must be a string'
  }),
  method: Joi.string().valid('cash', 'credit_card', 'bank_transfer', 'other').required().messages({
    'any.only': 'Payment method must be one of cash, credit_card, bank_transfer, or other',
    'string.base': 'Payment method must be a string',
    'any.required': 'Payment method is required'
  })
});

const paymentUpdateSchema = Joi.object({
  lead: objectId.optional().messages({
    'string.pattern.base': 'Invalid lead ID',
  }),
  student: objectId.optional().messages({
    'string.pattern.base': 'Invalid student ID',
  }),
  paymentPlan: objectId.optional().messages({
    'string.pattern.base': 'Invalid paymentPlan ID',
  }),
  installmentNumber: Joi.number().integer().min(1).optional().messages({
    'number.base': 'Installment number must be a number',
    'number.integer': 'Installment number must be an integer',
    'number.min': 'Installment number must be at least 1',
  }),
  amountPaid: Joi.number().min(0).optional().messages({
    'number.base': 'amountPaid must be a number',
    'number.min': 'amountPaid cannot be negative',
  }),
  dueDate: Joi.date().optional().messages({
    'date.base': 'dueDate must be a valid date',
  }),
  paidAt: Joi.date().optional().messages({
    'date.base': 'paidAt must be a valid date'
  }),
  status: Joi.string().valid('pending', 'paid', 'overdue', 'cancelled').optional().messages({
    'any.only': 'Status must be one of pending, paid, overdue, or cancelled',
    'string.base': 'Status must be a string'
  }),
  note: Joi.string().allow('').optional().messages({
    'string.base': 'Note must be a string'
  }),
  method: Joi.string().valid('cash', 'credit_card', 'bank_transfer', 'other').optional().messages({
    'any.only': 'Payment method must be one of cash, credit_card, bank_transfer, or other',
    'string.base': 'Payment method must be a string'
  })
}).min(1);

module.exports = { paymentSchema, paymentUpdateSchema };