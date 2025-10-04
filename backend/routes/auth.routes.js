const authController = require("../controllers/auth.controller");
const router=require("express").Router();

router.post("/owner/signup",authController.ownerSignup);
router.post("/owner/login",authController.ownerLogin);

router.post("/customer/signup",authController.customerSignup);
router.post("/customer/login",authController.customerLogin);

module.exports=router;