const jwt =require("jsonwebtoken");
require("dotenv").config();

// Authentication middleware

exports.auth=async(req,res,next)=>{
    console.log(req.cookies.token);
    console.log(req.header("Authorization"));
    const token=req.cookies.token||req.body.token|| req.header("Authorization").replace("Bearer ", "");
    try{
        if(!token){
            res.status(401).json({
                success:false,
                message:"Token missing"
            })
        }


        try{
            const payload=jwt.verify(token,process.env.JWT_SECRET);
            req.user=payload;
            // console.log(req.user.role);


        } catch(error){
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();

    } catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong, while verifying the token',
        });

    }


}

exports.student=async(req,res,next)=>{
    try{
        const role=req.user.role;

        if(role!=="Student"){
            res.status(403).json({
                success:false,
                message: "This is a protected Route, User Forbidden",
            })
        }

        next();


    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong, while verifying the path',
        });
    }
}

exports.admin=async(req,res,next)=>{
    try{
        const role=req.user.role;

        if(role!=="Admin"){
            res.status(403).json({
                success:false,
                message: "This is a protected Route, User Forbidden",
            })
        }
       

        next();


    } catch(error){
        return res.status(500).json({
            success:false,
            message:'Something went wrong, while verifying the path',
        });
    }
}