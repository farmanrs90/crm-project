const jwt=require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET||'change_this_secret';

module.exports=(req,res,next)=>{
    const auth=req.get('Authorization')||req.get('authorization');
    if(!auth || !auth.startsWith('Bearer ')){
        return res.status(401).json({message:'Unauthorized'});
    }
    const token=auth.split(' ')[1];
    try {
        const payload=jwt.verify(token, JWT_SECRET);    
        req.user={id:payload.id};
        next();
    } catch (error) {
        return res.status(401).json({message:'Invalid or expired token'});
        
    }
}