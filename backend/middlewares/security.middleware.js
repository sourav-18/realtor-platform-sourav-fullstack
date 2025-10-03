const serverEnv = require("../utils/serverEnv.utils");
const responseUtils=require("../utils/response.utils");

exports.checkAppId=(req,res,next)=>{
    const appId=req.headers["app-id"];
    if(!appId){
        return res.json(responseUtils.errorRes({message:"App not provided"}));
    }else if(appId!==serverEnv.APP_ID){
        return res.json(responseUtils.errorRes({message:"Invalid App ID"}));
    }
    next();
}