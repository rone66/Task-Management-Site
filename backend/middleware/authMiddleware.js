const jwt=require("jsonwebtoken");
require ("dotenv").config(); 

const authenticateToken=async(req,res,next)=>{
    const token=await req.headers.authorization;
  // console.log(token);

    if(token===null|| token===undefined){
        return res.status(400).json({message:"token is missing"})
    }
    jwt.verify(token,process.env.SECRET,(error,user)=>{
        if(error){
            return res.status(401).json({error})
        }
        req.user=user;
        next();
    })

}

module.exports={authenticateToken};