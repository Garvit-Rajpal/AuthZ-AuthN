const user=require("../models/User");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
require("dotenv").config();

exports.signup=async(req,res)=>{
    try{
        const {name,email,password,role} = req.body;
        if(!name||!email||!password||!role){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details"
            })
        }
        const get_email = await user.findOne({email});
        if(get_email){
            return res.status(400).json({
                success:false,
                message:"User Already exists"
            })
        }

        let hashedPassword;
        try{
             hashedPassword= await bcrypt.hash(password,10);
        } catch(error){
            return res.status(500).json({
                success:false,
                message:'Error inn hashing Password',
            });
        }

        const user_create= await user.create({name, email, password:hashedPassword,role});

        return res.status(200).json({
            success:true,
            data:user_create,
            message:"User Created Successfully"
        })



    } catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later',
        });

    }
}

exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details"
            })
        }
        let email_check=await user.findOne({email});
        if(!email_check){
            return res.status(400).json({
                success:false,
                message:"User does not exists!! Please signin first"
            })

        }

        const payload= {
            email:email_check.email,
            id:email_check.id,
            role:email_check.role
        }

        // comparing the passwords
        if(await bcrypt.compare(password,email_check.password)){
            const token=jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h",
                });
            
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true
            }
            // console.log(typeof email_check);
            // email_check=email_check.toObject();
            email_check.token=token;
            // console.log(email_check)
            email_check.password=undefined;

            res.cookie("token",token,options).status(200).json({
                success:true,
                email_check,
                token,
                message:"User Logged in successfully"
            })

        }
        else {
            //passwsord do not match
            return res.status(403).json({
                success:false,
                message:"Password Incorrect",
            });
        }



    } catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be logged in, please try again later',
        });

    }
}