const propertyController = require("../controllers/property.controller");
const router=require("express").Router();
const securityMiddleWare=require("../middlewares/security.middleware");
const constantUtils=require("../utils/constant.utils");

const owner=constantUtils.role.owner;
const customer=constantUtils.role.customer;

router.post("/",(req,res,next)=>securityMiddleWare.checkTokenWithRoles(req,res,next,[owner]),propertyController.create);
router.get("/",(req,res,next)=>securityMiddleWare.checkToken(req,res,next),propertyController.list);
router.get("/details/:id",(req,res,next)=>securityMiddleWare.checkToken(req,res,next),propertyController.details);
router.put("/:id",(req,res,next)=>securityMiddleWare.checkTokenWithRoles(req,res,next,[owner]),propertyController.update);
router.patch("/:id/status/:status",(req,res,next)=>securityMiddleWare.checkTokenWithRoles(req,res,next,[owner]),propertyController.statusUpdate);
router.get("/list-by-owner",(req,res,next)=>securityMiddleWare.checkTokenWithRoles(req,res,next,[owner]),propertyController.listByOwner);
router.get("/static-data",propertyController.staticData)

module.exports=router;