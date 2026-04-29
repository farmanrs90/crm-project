const {
    createUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService
} = require('./user.service');
const { userSchema } = require('./user.validation');
const createUser = async (req, res,next) => {
    try {
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const newUser = await createUserService(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }

};
const getAllUsers = async (req, res,next) => {
    try {
        const users = await getAllUsersService();
        res.json(users);
    } catch (error) {
        next(error);
    }
};
const getUserById = async (req, res,next) => {
    try {
        const user = await getUserByIdService(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};
const updateUser = async (req, res,next) => {
    try {
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const updatedUser = await updateUserService(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};
const deleteUser = async (req, res,next) => {
    try {
        const deletedUser = await deleteUserService(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}