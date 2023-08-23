const express=require("express");

const router =express.Router();

const {signup,login} =require("../controllers/Auth");

const {auth,student,admin}=require("../middlewares/auth");

router.post("/signup",signup);
router.post("/login",login);

router.get("/test",auth,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"User Authenticated Successfully"
    })
})

router.get("/Student",auth,student,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"User authorized for Student role"
    })
})

router.get("/Admin",auth,admin,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"User authorized for Admin role"
    })
})


module.exports=router;