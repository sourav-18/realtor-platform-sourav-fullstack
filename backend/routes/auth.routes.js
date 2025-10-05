const authController = require("../controllers/auth.controller");
const securityMiddleWare = require("../middlewares/security.middleware");
const constantUtils=require("../utils/constant.utils");
const router = require("express").Router();

const owner = constantUtils.role.owner;
const customer = constantUtils.role.customer;

router.post("/owner/signup", authController.ownerSignup);
router.post("/owner/login", authController.ownerLogin);

router.post("/customer/signup", authController.customerSignup);
router.post("/customer/login", authController.customerLogin);

router.get("/profile", (req,res,next)=>securityMiddleWare.checkTokenWithRoles(req,res,next,[owner,customer]), authController.profile);

module.exports = router;