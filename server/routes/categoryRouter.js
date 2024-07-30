const router=require('express').Router();
const auth=require('../middlewares/auth')
const stripe=require('stripe')('sk_test_51PhnquRxelnIedPJNNA3UzU5nhZIwXMdQDdHlar4OWb3WgdhSPAEUOVWfys7xGH8ysffQW05yvfQxcfjBDOEPpgB00S7p9Y5EZ')
const authAdmin=require('../middlewares/authAdmin')
const categoryCtrl=require('../controllers/categoryCtrl');
const { default: Stripe } = require('stripe');
router.route('/category').get(categoryCtrl.getCategories).post(auth,authAdmin,categoryCtrl.createCategory);


router.route('/category/:id').delete(auth,authAdmin,categoryCtrl.deleteCategory).put(auth,authAdmin,categoryCtrl.updateCategory);
router.post('/create-checkout-session',async(req,res)=>{
    const {products}=req.body;
    
    const line_items=products.map((product)=>({
        price_data:{
            currency:'inr',
            product_data:{
                name:product.title
            },
            unit_amount:product.price*100
        },
        quantity:product.quantity
    }))
    const session=await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items:line_items,
        mode:'payment',
        success_url:'http://localhost:3000/success',
        cancel_url:'http://localhost:3000/cancel'
    })
    res.json({id:session.id});
})
module.exports=router;