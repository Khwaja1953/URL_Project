
const restrict = (...allowedRole)=>{
return async function (req,res,next) {
    if(!req.user.role){
        return res.render('login')
    }

    if(!allowedRole.includes(req.user.role)){
        return res.render("home",{error: "you dont have access to that route"})
    }
    next()
}
}

module.exports = {restrict}