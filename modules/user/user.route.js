const routerUser=require('express').Router();
const{userSchema}=require('./user.validation');
const validateObjectId=require('../../common/middleware/validateObjectId');


const validate=require('../../common/middleware/validate');
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('./user.controller');
routerUser.post('/', createUser);
routerUser.get('/', getAllUsers);
routerUser.get('/:id', validateObjectId('id'), getUserById);
routerUser.put('/:id', validateObjectId('id'), validate(userSchema), updateUser);
routerUser.delete('/:id', validateObjectId('id'), deleteUser);
module.exports=routerUser;