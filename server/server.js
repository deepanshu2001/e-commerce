const express=require('express');
const { default: mongoose } = require('mongoose');
const app=express();
const stripe=require('stripe')("sk_test_51PhnquRxelnIedPJNNA3UzU5nhZIwXMdQDdHlar4OWb3WgdhSPAEUOVWfys7xGH8ysffQW05yvfQxcfjBDOEPpgB00S7p9Y5EZ")
const cors=require('cors')
const fileUpload = require('express-fileupload')
const PORT=process.env.PORT||5000;
const cookieparser=require('cookie-parser')
require('dotenv').config()
app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles:true
}))
app.use("/user",require('./routes/UserRoute'))
app.use("/api",require('./routes/UploadRoute'))
app.use('/api',require('./routes/categoryRouter'));
app.use("/api",require('./routes/ProductRoute'))
//database connection
const db_url=process.env.MONGODB_URL;
mongoose.connect(db_url,{
    useNewUrlParser:true,
}).then(()=>{
    console.log('Connected to DB')
}).catch((err)=>{
    console.log(err);
})


app.get('/',(req,res)=>{
    res.send("<h1>Hello</h1>")
})
app.listen(PORT,(req,res)=>{
    console.log('App running at PORT ',PORT)
})

