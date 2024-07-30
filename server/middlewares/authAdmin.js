const jwt=require('jsonwebtoken')
const Users=require('../db/UserModel')
const authAdmin=async(req,res,next)=>{
   
    const user=await Users.findOne({
        _id:req.user.id
    })
    if(user.role===0){
        return res.status(400).json({msg:'This user does not have admin Access'})
    }
    next();
}

module.exports=authAdmin