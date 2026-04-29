const{registerUserService, loginUserService} = require('./auth.service');
const registerUserController = async (req, res, next) => {
    
    try {
        const payload = req.body || {};
        console.log('Register payload:', payload);
        const user = await registerUserService(payload);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

const loginUserController = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        const result = await loginUserService({ email, password });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
module.exports = {
    registerUserController,
    loginUserController
};