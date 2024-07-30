const jwt=require('jsonwebtoken')
const auth=async(req,res,next)=>{
   const token=req.header('Authorization');
   if(!token){
    return res.status(400).json({msg:'Try Logging in or Registering'})
   }
   jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
     if(err){
        return res.json({msg:'Try Logging in Again'});
     }
     
     req.user=user;
     next();
   })
}

module.exports=auth