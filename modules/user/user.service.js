const user=require('./user.model');
const createUserService=async(data)=>{
    return await user.create(data);
}
const getAllUsersService=async()=>{
    return await user.find();
}
const getUserByIdService=async(id)=>{
    return await user.findById(id);
}
const updateUserService=async(id,data)=>{
    return await user.findByIdAndUpdate(id,data,{new:true});
}
const deleteUserService=async(id)=>{
    return await user.findByIdAndDelete(id);
}
module.exports={
    createUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService
}


