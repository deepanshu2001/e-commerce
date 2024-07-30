const Users=require('../db/UserModel')
const bcrypt=require('bcrypt');

const jwt = require('jsonwebtoken');
const UserCtrl={
   register:async(req,res)=>{
     const {name,email,password}=req.body;
     const match=await Users.findOne({email});
     
     if(match){
        return res.status(400).json({message:"Email already Exists.Try Logging In!!!!"});
     }
     if(password.length<6){
      return res.status(400).json({msg:'Password should be atleast 6 characters Long'})
     }
     try{
       const hashed_password=await bcrypt.hash(password,10);
       const new_User=new Users({
         name,email,password:hashed_password
       })
       await new_User.save();
       const accessToken=createaccesstoken({id:new_User._id});
       const refreshToken=createrefreshtoken({id:new_User._id});
       res.cookie('refreshtoken',refreshToken,{
         httpOnly:true,
         path: '/user/refresh_token',
         
       })
       
      res.json({accessToken})
     }
    catch(err){
        return res.status(500).json({message:err});
    }
   },
   refreshtoken:async(req,res)=>{
      try{
         const rf_token=req.cookies.refreshtoken;
         if(!rf_token){
            return res.status(400).json({msg:'Please Enter or Login!!!'})
         }
         jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
           
            if(err){
               return res.status(400).json({msg:'Please Login or Register'})
            }
            const accessToken=createaccesstoken({id:user.id});
            res.json({accessToken})
         })
      }
      catch(err){
         return res.status(500).json({msg:err.message})
      }
      
      
   },
   login:async(req,res)=>{
      const {email,password}=req.body;
      const match=await Users.findOne({email});
      
      if(!match){
         res.status(400).json({msg:"User does not exists"});
      }
      
      await bcrypt.compare(password,match.password,(err,result)=>{
         if(err){
            res.status(500).json({msg:err.msg});
         }
         if(result){
            const accessToken=createaccesstoken({id:match._id});
            const refreshToken=createrefreshtoken({id:match._id});
            res.cookie('refreshtoken',refreshToken,{
              httpOnly:true,
              path: '/user/refresh_token',
            })
            
           res.status(200).json({message:'LogIn successfull!!!'})
         }
         else{
            res.status(400).json({message:'Passwords do not match.Please Try again'});
         }
      })
   },
   logout:async(req,res)=>{
      res.clearCookie('refreshtoken',{path:'/user/refresh_token'})
      res.status(200).json({msg:'Logged out successfully'})
   },
   getUser:async(req,res)=>{
      try{
        const user=await Users.findById(req.user.id).select('-password');
        if(!user){
          return res.status(400).json({msg:'User not found'});
        }
        res.json(user);

      }
      catch(err){
          return res.status(500).json({msg:err.message})
      }
  },
 
}
function createaccesstoken(payload){
   return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'});
}
function createrefreshtoken(payload){
   return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'5d'});
}
module.exports=UserCtrl