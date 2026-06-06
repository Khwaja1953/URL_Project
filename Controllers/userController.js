require("dotenv").config();
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const {generateToken} = require("../Utils/token");
const {transporter} = require("../Utils/mail")
const logger = require('../Utils/logger')

const handleUserRegister = async (req,res)=>{
    try {
        const {name, email, password} = req.body;
        // console.log(req.body);
        // console.log(req.file);
        if (!name || !email || !password){
            return res.status(400).render("register",{
                error: "all feilds are required"
            })
        }
        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(409).render("register",{
                error: "email already exists"
            })
        }

        const otp = parseInt(Math.random() * 1000 + 1000);

        transporter.sendMail({
            from:process.env.EMAIL,
            to: email,
            subject: "OTP for URL Shortner Account verification",
            text:`your otp for account verification is ${otp}. please do not share with anyone`
        })
        
        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hash = bcrypt.hashSync(password,salt);
        // console.log(hash);


        const newUser = await User.create({name,email,password:hash,storedOtp:{otp},profile: `/uploads/${req.file.filename}`});
        if(!newUser){
            return res.status(500).render("register",{
                error: "something went wrong"
            })
        }
        return res.status(201).render("verify",{email})
        
    } catch (error) {
        console.error(error);
        return res.status(500).render("register",{error: "something went wrong please try again..."})
    }
}

const handleUserLogin = async (req, res)=>{

    try {
        const {email, password} = req.body;
        logger.info(`${email} has logged in at ${new Date(Date.now())}`)
        if( !email || !password){
            return res.status(400).render("login",{
                error: "all feilds are required"
            });
        }

        const existingUser = await User.findOne({email})
        if (!existingUser){
            return res.status(404).render("login",{
                error: "Email is incorrect"
            })
        }
        const validatePassword = bcrypt.compareSync(password,existingUser.password);
        // console.log(validatePassword);
        if (!validatePassword){
            return res.status(400).render("login",{error:"password is incorrect"})
        }
        if(!existingUser.isVerified){
            return res.render("verify",{email:existingUser.email,error: "please verify your account first"})
        }
        const uuid = await generateToken(existingUser);
        res.cookie("uuid",uuid);
        if (existingUser.role === "ADMIN"){
            return res.status(200).redirect("/admin")
        }
        return res.status(200).redirect("/")
        
    } catch (error) {
        console.log(error);
        return res.status(500).render("login",{
            error: "something went wrong"
        })
    }
}

const handleUserVerify = async (req,res)=>{
try{
    const {email, otp} = req.body;
    if(!email || !otp){
        return res.status(400).render("verify",{
                error: "all feilds are required"
            });
    }
    const existingUser = await User.findOne({email});
    if (!existingUser){
        return res.status(400).render("register",{error: "please register first"});
    }

    if(otp != existingUser.storedOtp.otp){
        return res.render("verify",{error:"invalid otp",email})
    }
    if(Date.now() > parseInt(existingUser.storedOtp.validTill)){
        
        return res.render("verify",{error:"otp expired",email})
    }
    await User.findOneAndUpdate({email},{isVerified:true})
    return res.status(201).render("login",{data:"account verified successfully please login"})
}
catch (error) {
        console.log(error);
        return res.status(500).render("verify",{
            error: "something went wrong"
        })
    }
}

module.exports = {handleUserRegister, handleUserLogin, handleUserVerify}