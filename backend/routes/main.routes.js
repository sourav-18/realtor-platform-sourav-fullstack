
const router =require("express").Router();
const securityMiddleWare=require("../middlewares/security.middleware");

router.use("/auth",securityMiddleWare.checkAppId,require("./auth.routes"));
router.use("/properties",securityMiddleWare.checkAppId,require("./property.routes"));
router.use("/upload",securityMiddleWare.checkAppId,require("./upload.routes"));

module.exports=router;