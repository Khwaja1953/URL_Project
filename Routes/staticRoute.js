const express = require("express");
const {protect} = require("../Middleware/protect");
const Url = require("../Models/URL")
const router = express.Router();

router.get("/",protect,async (req,res)=>{
    const {_id} = req.user;
    const allUrls = await Url.find({createdBy: _id})
    return res.render("home",{allUrls, user:req.user});
})
router.get("/login",(req,res)=>{
    return res.render("login");
})
router.get("/register",(req,res)=>{
    return res.render("register");
})
router.get("/verify",(req,res)=>{
    return res.render("verify");
})

module.exports = router;