
const router =require("express").Router();
const securityMiddleWare=require("../middlewares/security.middleware");

router.use("/auth",securityMiddleWare.checkAppId,require("./auth.routes"));
router.use("/property",securityMiddleWare.checkAppId,require("./property.routes"));

module.exports=router;