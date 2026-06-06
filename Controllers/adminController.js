const Url = require("../Models/URL");

const handleGetAllUrls = async (req,res)=>{
    try {
        const allUrls = await Url.find();
        if (!allUrls){
            return res.status(404).render("home",{
                error: "no url found..."
            })
        }
        return res.render("home",{allUrls})
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "something went wrong"
        })

    }
}
const handleDeleteUrls = async (req,res)=>{
    try {
        const {shortId} = req.params;
        if (!shortId){
            return res.status(400).json({
                error: "shortId is required"
            })
        }
        const deletedUrl = await Url.deleteOne({shortId});

        if (deletedUrl.deletedCount == 0){
            return res.status(404).render("home",{
                error: "url not found"
            })

        }
        return res.status(204).json({
    data: "Deleted successfully"
});

    } catch (error) {
        console.error(error);
        return res.status(500).render("home",{
            error: "something went wrong.."
        })
    }
}


module.exports = {handleGetAllUrls,handleDeleteUrls}