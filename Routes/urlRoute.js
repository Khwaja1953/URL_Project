const express = require("express");
const router = express.Router();
const {handleCreateUrl, handleGetUrl} = require("../Controllers/urlController");
const {protect} = require("../Middleware/protect")

router.post("/",protect,handleCreateUrl);
router.get("/:shortId",handleGetUrl);


module.exports = router