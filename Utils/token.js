const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid");
const SECRET_KEY="ilssrinagar"

async function generateToken(user){
    const uuid = uuidv4();
    const token = jwt.sign({uuid: {_id:user._id,email:user.email,role:user.role,profile:user.profile}},SECRET_KEY)
    return token;
}

async function verifyToken(uuid){
    try {
        
        
        if(!uuid){
            return null
        }
        const user = jwt.verify(uuid,SECRET_KEY,{ algorithm: 'RS256',expireIn: '7d' });
        if (!user){
            return null
        }
        return user.uuid
    } catch (error) {
        console.error(error);
        return null
    }
}

module.exports = {generateToken,verifyToken} 