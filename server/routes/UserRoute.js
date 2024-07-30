const express=require('express');
const auth=require('../middlewares/auth')
const authAdmin=require('../middlewares/authAdmin')
const router=express.Router();
const UserCtrl=require('../controllers/UserCtlr')
router.post("/register",UserCtrl.register)
router.post('/login',UserCtrl.login);
router.get("/refresh_token",UserCtrl.refreshtoken)
router.get('/logout',UserCtrl.logout)
router.get('/infor',auth,UserCtrl.getUser);

module.exports=router