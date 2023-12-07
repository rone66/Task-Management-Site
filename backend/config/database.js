//this function is setup for mongodb

const mongoose=require("mongoose");
require("dotenv").config();
const connectDb=async()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then((conn)=>{
        console.log("database connected successfully");
        console.log(conn.connection.host);})
    .catch((err)=>{
        console.log("connection prblm in db",err);
        process.exit(1);
    });

}
module.exports=connectDb;