const routerUser=require('express').Router();
const{userSchema}=require('./user.validation');
const validateObjectId=require('../../common/middleware/validateObjectId');
const auth=require('../../common/middleware/auth');


const validate=require('../../common/middleware/validate');
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('./user.controller');
routerUser.post('/', auth, createUser);
routerUser.get('/', auth, getAllUsers);
routerUser.get('/:id', auth, validateObjectId('id'), getUserById);
routerUser.put('/:id', auth, validateObjectId('id'), validate(userSchema), updateUser);
routerUser.delete('/:id', auth, validateObjectId('id'), deleteUser);
module.exports=routerUser;