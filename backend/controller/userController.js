const User=require("../models/userSchema");
const bcrypt=require("bcrypt");
const emailValidator=require("email-validator");
const jsonwebtoken=require("jsonwebtoken");
require("dotenv").config();




exports.Signup= async(req,res)=>{
    try {
    const {name,username,email,password}=req.body;
    console.log(name);
    const validEmail=emailValidator.validate(email);
    if(!name || !username || !email || !password){
        return res.status(401).json({
            success:false,
            message:"please fill all the value"
        })
    }
    if (!validEmail) {
        return res.status(401).json({
            success:false,
            message:"please check your email address"
        })
    }
    //console.log(password);
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password,10);
        //console.log(hashedPassword);    
    } 
    catch(error) {
        return res.status(400).json({
            success:false,
            message:"problem in hashing in password"
        })
    }
    const user=await User.create({
        name,username,email,password:hashedPassword
    })
    return res.status(200).json({
        success:true,
        user,
        message:"User registered successfully "
    })
    } 
    catch(error) {
        //console.log(error);
        return res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}

exports.Login=async(req,res)=>{
    try {
        const {username,password}=req.body;
        // console.log(req);
        if (!username || !password) {
            return res.status(404).json({
                success:false,
                message:"Any of the creadential is empty"
            })
            
        }
        // console.log("i am before searching");
        const user= await User.findOne({username});
         console.log("i am after searching",user);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"please do register yourself"
            })
        }
        const payload={
            username:user.username,
            id:user._id
        }
        // console.log(password,user.password);
        if(bcrypt.compare(password,user.password)){
            
            let token=jsonwebtoken.sign(payload,process.env.SECRET,
                {expiresIn:"2h"});
            user.password=undefined;
            user[token]=token;
          
            const cookieOptions={
                expires:new Date(Date.now()+3*24*60*10000),
                httpOnly:true
            }
            res.cookie("token",token,cookieOptions).status(200).json({
                success:true,
                message:"User login successfully",
                name:user.name,
                username:user.username,
                email:user.email,
                token:token
            
                
            })
            
            //console.log(user);
        }else{
            return res.status(400).json({
                message:"please check the password or username"
            })
        }
    } 
    catch(error) {
        return res.status(405).json({
            success:false,
            message:error.message,
        })
    }
}