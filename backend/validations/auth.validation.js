const joi = require("joi");
const constantValidation = require("./constant.validation");

exports.ownerSignupBody = joi.object({
    name: constantValidation.longString({ min: 3, max: 50 }).required(),
    phoneNumber: constantValidation.phoneNumber.required(),
    profilePic:constantValidation.url.required(),
    password: constantValidation.ownerPassword.required(),
    confirmPassword: joi
        .string()
        .valid(joi.ref('password'))
        .required()
        .messages({ 'any.only': 'password do not match', "any.required": "{#key} is required", }),
})

exports.ownerLoginBody = joi.object({
    phoneNumber: constantValidation.phoneNumber.required(),
    password: constantValidation.ownerPassword.required(),
})

exports.customerSignupBody = joi.object({
    name: constantValidation.longString({ min: 3, max: 50 }),
    phoneNumber: constantValidation.phoneNumber.required(),
    password: constantValidation.customerPassword.required(),
    confirmPassword: joi
        .string()
        .valid(joi.ref('password'))
        .required()
        .messages({ 'any.only': 'Confirm password must match password' }),
})

exports.customerLoginBody = joi.object({
    phoneNumber: constantValidation.phoneNumber.required(),
    password: constantValidation.customerPassword.required(),
})