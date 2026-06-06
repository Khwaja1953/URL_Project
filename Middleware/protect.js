const {verifyToken} = require("../Utils/token")
const protect = async (req,res,next)=>{
    try {
        const uuid = req.cookies?.uuid;
        if (!uuid){
            return res.render("login",{error: "please login first"})
        }
        const user = await verifyToken(uuid);
        if (!user){
            return res.render("login",{error: "please login first"})
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.end("something went wrong please try again")
    }
}

module.exports = {protect}