const responseUtils = require("../utils/response.utils");
const ownersDb = require("../db/owners.db");
const customerDb = require("../db/customers.db");
const devLog = require("../utils/devLog.utils");
const authValidation = require("../validations/auth.validation");
const bcryptPackage = require("../packages/bcrypt.packages");
const jwtPackage = require("../packages/jwt.packages");
const dbConstant = require("../utils/dbConstant.utils");
const constantUtils = require("../utils/constant.utils");

// exports.demo = async (req, res) => {
//     try {
//   const validate = authValidation.ownerSignupBody.validate(req.body);
// if (validate.error) {
//     return res.json(responseUtils.errorRes({ message: validate.error.message }));
// }
//     } catch (error) {
//         devLog(error);
//         return res.json(responseUtils.errorRes({ message: "Internal Server Error" }));
//     }
// }

exports.ownerSignup = async (req, res) => {
    try {
        const validate = authValidation.ownerSignupBody.validate(req.body);
        if (validate.error) {
            return res.json(responseUtils.errorRes({ message: validate.error.message }));
        }

        const { name, phoneNumber, profilePic, password } = req.body;
        const isPhoneNumberExist = await ownersDb.findOne({
            where: { phone_number: phoneNumber },
            attributes: ["id"]
        });

        if (isPhoneNumberExist) {
            return res.json(responseUtils.errorRes({ message: "PhoneNumber already exist" }));
        }

        const hashPassword = await bcryptPackage.getHahPassword(password);
        if (!hashPassword) {
            return res.json(responseUtils.errorRes({ message: "Something wrong .." }));
        }

        const createDbRes = await ownersDb.create({
            name: name,
            phone_number: phoneNumber,
            password: hashPassword,
            profile_pic: profilePic
        })

        const token = jwtPackage.getToken({
            tokenData: {
                id: createDbRes.dataValues.id,
                role: constantUtils.role.owner
            }
        })
        res.setHeader('x-access-token', token);

        return res.json(responseUtils.successRes({ message: "Signup successfully" }));

    } catch (error) {
        devLog(error);
        return res.json(responseUtils.errorRes({ message: "Internal Server Error" }));
    }
}

exports.ownerLogin = async (req, res) => {
    try {
        const validate = authValidation.ownerLoginBody.validate(req.body);
        if (validate.error) {
            return res.json(responseUtils.errorRes({ message: validate.error.message }));
        }

        const { phoneNumber, password } = req.body;
        const ownerDbRes = await ownersDb.findOne({
            where: { phone_number: phoneNumber, status: dbConstant.owners.status.active },
            attributes: ["id", "password"]
        });

        if (!ownerDbRes) {
            return res.json(responseUtils.errorRes({ message: "phoneNumber or password invalid" }));
        }

        const isValidPassword = await bcryptPackage.isValidPassword({ password: password, hashPassword: ownerDbRes.dataValues.password });
        if (!isValidPassword) {
            return res.json(responseUtils.errorRes({ message: "phoneNumber or password invalid" }));
        }

        const token = jwtPackage.getToken({
            tokenData: {
                id: ownerDbRes.dataValues.id,
                role: constantUtils.role.owner
            }
        })
        res.setHeader('x-access-token', token);

        return res.json(responseUtils.successRes({ message: "login successfully" }));

    } catch (error) {
        devLog(error);
        return res.json(responseUtils.errorRes({ message: "Internal Server Error" }));
    }
}

exports.customerSignup = async (req, res) => {
    try {
        const validate = authValidation.customerSignupBody.validate(req.body);
        if (validate.error) {
            return res.json(responseUtils.errorRes({ message: validate.error.message }));
        }

        const { name, phoneNumber, password } = req.body;
        const isPhoneNumberExist = await customerDb.findOne({
            where: { phone_number: phoneNumber },
            attributes: ["id"]
        });

        if (isPhoneNumberExist) {
            return res.json(responseUtils.errorRes({ message: "PhoneNumber already exist" }));
        }

        const hashPassword = await bcryptPackage.getHahPassword(password);
        if (!hashPassword) {
            return res.json(responseUtils.errorRes({ message: "Something wrong .." }));
        }

        const createDbRes = await customerDb.create({
            name: name,
            phone_number: phoneNumber,
            password: hashPassword,
        })

        const token = jwtPackage.getToken({
            tokenData: {
                id: createDbRes.dataValues.id,
                role: constantUtils.role.customer
            }
        })
        res.setHeader('x-access-token', token);

        return res.json(responseUtils.successRes({ message: "Signup successfully" }));

    } catch (error) {
        devLog(error);
        return res.json(responseUtils.errorRes({ message: "Internal Server Error" }));
    }
}

exports.ownerLogin = async (req, res) => {
    try {
        const validate = authValidation.customerLoginBody.validate(req.body);
        if (validate.error) {
            return res.json(responseUtils.errorRes({ message: validate.error.message }));
        }

        const { phoneNumber, password } = req.body;
        const customerDbRes = await customerDb.findOne({
            where: { phone_number: phoneNumber, status: dbConstant.owners.status.active },
            attributes: ["id", "password"]
        });

        if (!customerDbRes) {
            return res.json(responseUtils.errorRes({ message: "phoneNumber or password invalid" }));
        }

        const isValidPassword = await bcryptPackage.isValidPassword({ password: password, hashPassword: customerDbRes.dataValues.password });
        if (!isValidPassword) {
            return res.json(responseUtils.errorRes({ message: "phoneNumber or password invalid" }));
        }

        const token = jwtPackage.getToken({
            tokenData: {
                id: customerDbRes.dataValues.id,
                role: constantUtils.role.customer
            }
        })
        res.setHeader('x-access-token', token);

        return res.json(responseUtils.successRes({ message: "login successfully" }));

    } catch (error) {
        devLog(error);
        return res.json(responseUtils.errorRes({ message: "Internal Server Error" }));
    }
}