const express = require("express");
const multer = require("multer");
const path = require("path");
const {handleUserLogin, handleUserRegister, handleUserVerify} = require('../Controllers/userController')
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, path.join(__dirname, "../uploads"));

    },
    filename: function(req,file,cb){
    
        cb(null,Date.now() + file.originalname);
    }
});
const upload = multer({storage: storage});
const router = express.Router();

router.post('/register',upload.single("profile"),handleUserRegister);
router.post('/login',handleUserLogin);
router.post("/verify",handleUserVerify);


module.exports = router;