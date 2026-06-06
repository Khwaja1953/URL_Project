const Url = require('../Models/URL');
const shortid = require('shortid');

const handleCreateUrl = async (req,res)=>{
try{
    const {url} = req.body;
    // console.log(url);
    if(!url)return res.render("home",{error:"url is required"})

    const existingUrl = await Url.findOne({url});
    if (existingUrl){
        return res.render("home",{data: "url already shortned", url: existingUrl});
    }

    const shortId = shortid.generate();
    
    const savedUrl = await Url.create({url,shortId,createdBy: req.user._id});
    if (!savedUrl)return res.render("home",{error: "something went wrong please try again."});

    return res.status(201).render("home",{data: "success",url:savedUrl})

}
catch(err){
    console.error(err);
    return res.status(500).render("home",{error:err,data:"something went wrong please try again later"})
}
}

const handleGetUrl = async (req, res)=>{
    try{
        const {shortId} = req.params;
        if(!shortId)return res.status(400).render("home",{error: "id is required"});

        const existingUrl = await Url.findOneAndUpdate({shortId},{$push: {visitHistory: Date.now()}});
        if (!existingUrl)return res.status(404).render("home",{error: "no such url exists"})

        return res.redirect(existingUrl.url)

    }
    catch(err){
        console.error(err);
    return res.status(500).render("home",{error:err,data:"something went wrong please try again later"})
    }
}

module.exports = {handleCreateUrl, handleGetUrl};