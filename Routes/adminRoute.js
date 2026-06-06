const express = require("express");
const {handleDeleteUrls,handleGetAllUrls} = require("../Controllers/adminController");
const {protect} = require("../Middleware/protect");
const {restrict} = require("../Middleware/restrict")
const router = express.Router();

router.get("/",protect,restrict("ADMIN"),handleGetAllUrls);
router.delete("/:shortId",protect,handleDeleteUrls)



module.exports = router; 