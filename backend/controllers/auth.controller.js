const responseUtils=require("../utils/response.utils");

exports.ownerSignup=async(req,res)=>{
    res.json(responseUtils.successRes({message:"Owner signup successfully"}));
}