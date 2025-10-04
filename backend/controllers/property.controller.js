const responseUtils = require("../utils/response.utils");

exports.create = (req, res) => {
    //     try {
    //   const validate = authValidation.ownerSignupBody.validate(req.body);
    // if (validate.error) {
    // return res.json(responseUtils.errorRes({ message: validate.error.message }));
    // }
    return res.json(responseUtils.successRes({ message: "property create successfully" }));
    //     } catch (error) {
    //         devLog(error);
    //         return res.json(responseUtils.errorRes({ message: "Internal Server Error" }));
    //     }
}