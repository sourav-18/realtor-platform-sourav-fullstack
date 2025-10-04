const propertyController = require("../controllers/property.controller");
const router=require("express").Router();
const securityMiddleWare=require("../middlewares/security.middleware");
const constantUtils=require("../utils/constant.utils");

const owner=constantUtils.role.owner;
const customer=constantUtils.role.customer;

router.post("/",(req,res,next)=>securityMiddleWare.checkTokenWithRoles(req,res,next,[owner]),propertyController.create);
router.get("/",(req,res,next)=>securityMiddleWare.checkTokenWithRoles(req,res,next,[owner,customer]),propertyController.list);
router.put("/:propertyId",(req,res,next)=>securityMiddleWare.checkTokenWithRoles(req,res,next,[owner]),propertyController.update);
router.patch("/:propertyId/status/:status",(req,res,next)=>securityMiddleWare.checkTokenWithRoles(req,res,next,[owner]),propertyController.statusUpdate);
router.get("/list-by-owner",(req,res,next)=>securityMiddleWare.checkTokenWithRoles(req,res,next,[owner]),propertyController.listByOwner);
router.get("/static-data",propertyController.staticData)

module.exports=router;