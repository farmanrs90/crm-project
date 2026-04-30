const{createStudentService,getAllStudentsService,getStudentByIdService,updateStudentService,deleteStudentService}=require('./student.service');
const createStudentController=async(req,res,next)=>{
    try {
        const student=await createStudentService(req.body);
        res.status(201).json(student);
    } catch (error) {next(error);}
};
const getAllStudentsController=async(req,res,next)=>{
    try {
        const students=await getAllStudentsService();
        res.status(200).json(students);
    } catch (error) {next(error);}
};
const getStudentByIdController=async(req,res,next)=>{
    try {
        const student=await getStudentByIdService(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {next(error);}

};
const updateStudentController=async(req,res,next)=>{
    try {
        const student=await updateStudentService(req.params.id,req.body);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {next(error);}
};
const deleteStudentController=async(req,res,next)=>{
    try {
        const student=await deleteStudentService(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {next(error);}
};
module.exports={
    createStudentController,
    getAllStudentsController,
    getStudentByIdController,
    updateStudentController,
    deleteStudentController
};