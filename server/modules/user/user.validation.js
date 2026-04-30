const Joi=require('joi');   
const userSchema=Joi.object({
    name:Joi.string().min(3).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
    role:Joi.string().valid('admin', 'teacher', 'manager', 'student', 'accountant').default('manager'),
});
module.exports={
    userSchema
}