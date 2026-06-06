const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {type: String, required: true},
    role: {type: String, enum: ["ADMIN", "USER"], default: "USER"},
    storedOtp:{
        otp: {type: String},
        validTill: {type: String, default: ()=> (Date.now() + 5 * 60 * 1000)}
    },
    isVerified:{type:Boolean, default: false},
    profile: {type: String}
},{
    timeStamps: true
});


const User = mongoose.model("User",userSchema);

module.exports = User;
