const propertyController = require("../controllers/property.controller");
const router=require("express").Router();
const securityMiddleWare=require("../middlewares/security.middleware");
const constantUtils=require("../utils/constant.utils");

const owner=constantUtils.role.owner;
const customer=constantUtils.role.customer;

router.post("/",(req,res,next)=>securityMiddleWare.checkTokenWithRoles(req,res,next,[customer]),propertyController.create)

module.exports=router;