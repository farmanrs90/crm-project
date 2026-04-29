const Joi= require('joi');
const paymentPlanSchema=Joi.object({
    planType:Joi.string().valid('full', 'installments').required().messages({
        'any.only': 'Plan type must be either full or installments',
        'string.base': 'Plan type must be a string',
        'any.required': 'Plan type is required'
    }),
    totalAmount:Joi.number().min(0).required().messages({
        'number.base': 'Total amount must be a number',
        'number.min': 'Total amount must be a positive number',
        'any.required': 'Total amount is required'
    }),
    discountAmount:Joi.number().min(0).optional().messages({
        'number.base': 'Discount amount must be a number',
        'number.min': 'Discount amount must be a positive number'
    }),
    note:Joi.string().allow('').optional().messages({
        'string.base': 'Note must be a string'
    }),
    isActive:Joi.boolean().optional().messages({
        'boolean.base': 'isActive must be a boolean'
    })
});
module.exports={paymentPlanSchema};