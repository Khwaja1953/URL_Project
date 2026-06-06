const mongoose = require('mongoose');


const connectDb = async (mongouri)=>{
    try{

        await mongoose.connect(mongouri);
        console.log("mongodb connected");
    }
    catch(err){
        console.error(err);
    }
}

module.exports = connectDb;