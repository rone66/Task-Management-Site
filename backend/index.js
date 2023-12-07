// setup express and db connection 
//PORT defining
// server creating
//base route creat

const express=require("express");
const app=express();
const cors=require("cors");
const bodyparser=require("body-parser");


require("dotenv").config();

const PORT = process.env.PORT || 3001;

const connectDb=require("./config/database");
connectDb();
app.use(bodyparser.json({extended:true}));
app.use(bodyparser.urlencoded({extended:true}));


app.listen(PORT,()=>{
    console.log(`server is live successfully ${PORT}`)
})
app.use(cors());
const route=require("./routes/route");
app.use("/api/v1",route)

app.get("/",(req,res)=>{
    res.send(`<h2>This is homepage</h2>`)
})