const express = require('express');
const routerAuth = express.Router();
const{registerUserController, loginUserController}=require('./auth.controller');
const { registerSchema, loginSchema } = require('./auth.validation');
const validate=require('../../common/middleware/validate');
routerAuth.post('/register', validate(registerSchema), registerUserController);
routerAuth.post('/login', validate(loginSchema), loginUserController);
module.exports=routerAuth;