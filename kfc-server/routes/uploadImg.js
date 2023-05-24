const express = require("express")

const router = express.Router()

const fs = require("fs");
const upload = require("../middleware/multer")
router.post('/', upload.single("image"),  async (req, res) =>{
    //Images handler
    const imgFile = req.file
    try {
        if (imgFile)
        return res.json({success: true}).sendFile(imgFile.path)
    }
    catch (e) {
        imgFile.path && fs.unlinkSync(imgFile.path);
        return res.status(401).json({success: false, message: "File is not available!"})
    }
} )

module.exports = router