const auth=require('../middlewares/auth')
const authAdmin=require('../middlewares/authAdmin')
const productCtrl=require('../controllers/productCtrl')
const router=require('express').Router();
router.route('/product').get(productCtrl.getProducts).post(auth,authAdmin,productCtrl.createProducts);


router.route('/product/:id').delete(auth,authAdmin,productCtrl.deleteProduct).put(auth,authAdmin,productCtrl.updateProduct);

module.exports=router;