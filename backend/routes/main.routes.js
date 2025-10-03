
const router =require("express").Router();
const securityMiddleWare=require("../middlewares/security.middleware");

router.use("/auth",securityMiddleWare.checkAppId,require("./auth.routes"));

module.exports=router;