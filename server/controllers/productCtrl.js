const Products=require('../db/ProductModel');
const productCtrl={
    getProducts:async(req,res)=>{
        try{
            const products=await Products.find({});
            if(products.length===0){
                return res.status(400).json({msg:'There is no products'})
            }
            return res.status(200).json({products})
        }catch(err){
            return res.status(400).json({msg:err.msg});
        }
    },
    createProducts:async(req,res)=>{
        try{
            const {product_id,title,price,description,content,images,category}=req.body;
            const product=await Products.findOne({product_id});
            if(product){
             return res.json(400).json({msg:'Product Already exists'});
            }
            const newProduct=new Products({
               product_id,title,price,description,content,images,category
            })
            await newProduct.save();
            res.json({msg:"Created a Product"});
          }
          catch(err){
             return res.status(500).json({msg:err.message})
          }
    },
    deleteProduct:async(req,res)=>{
        try{
            await Products.findByIdAndDelete(req.params.id);
            res.json({msg:'Deleted a product'});
         }
         catch(err){
             return res.status(500).json({msg:err.message});
         }
    },
    updateProduct:async(req,res)=>{
        try{
            const {title,price,description,content,images,category}=req.body;
            if(!images){
             return res.status(500).json({msg:'No image upload'});
            }
            await Products.findOneAndUpdate({_id:req.params.id},{
             title,price,description,content,images,category
            })
            res.json({msg:'Updated a Product'})
         }
         catch(err){
             return res.status(500).json({msg:err.message});
         }
    }
}

module.exports=productCtrl