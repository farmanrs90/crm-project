const express = require('express');
const routerAuth = express.Router();
const{registerUserController, loginUserController}=require('./auth.controller');
const{userSchema}=require('../user/user.validation');
const validate=require('../../common/middleware/validate');
routerAuth.post('/register', validate(userSchema), registerUserController);
routerAuth.post('/login', loginUserController);
module.exports=routerAuth;