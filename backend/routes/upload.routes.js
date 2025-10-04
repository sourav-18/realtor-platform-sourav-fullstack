const uploadController = require("../controllers/upload.controller");
const router=require("express").Router();

router.post("/image",uploadController.imageUpload);
router.post("/bulk-image",uploadController.bulkImageUpload);

module.exports=router;