const authController = require("../controllers/auth.controller");
const router=require("express").Router();

router.post("/owner/signup",authController.ownerSignup);

module.exports=router;