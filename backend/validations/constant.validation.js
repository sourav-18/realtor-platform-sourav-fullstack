const joi = require("joi")

exports.sqlId = joi.number().integer().min(1).messages({
    "number.min": `{#key} should be at least {#limit} `,
    "number.integer": `{#key} should be integer`,
    "any.required": `{#key} should be required`,
    "number.base": `{#key} must be number`
})

exports.page = joi.number().integer().min(1).integer().messages({
    'number.base': '{#key} must be a number',
    'number.empty': '{#key} is required',
    'number.min': '{#key} should be at least {#limit}',
    "number.integer": `{#key} must be an integer`
})

exports.limit = (mini, maxi) => {
    mini = mini ? mini : 1;
    maxi = maxi ? maxi : 30;
    return joi.number().integer().min(mini).max(maxi).messages({
        'number.base': 'limit must be a number',
        'number.empty': 'limit is required',
        'number.min': 'limit must be greater than or equal to {#limit}',
        'number.max': 'limit must be less than or equal to {#limit}',
        "number.integer": `{#key} must be an integer`
    })
}

exports.longString = ({ min, max }) => {
    if (!min) {
        min = 1;
    }
    if (!max) {
        max = 100;
    }
    let validation = joi.string().trim().min(min).max(max).messages({
        "string.base": "{#key} should be text",
        "any.required": "{#key} is required",
        "string.empty": "{#key} must not be empty",
        "string.min": `{#key} must be at least {#limit} characters long.`,
        "string.max": `{#key} must be at max {#limit} characters long.`,
    })
    return validation;
}


exports.dateTime = joi.string().trim().pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/).messages({
    "string.pattern.base": "{#key} date must be in YYYY-MM-DD HH:MM format",
    "date.invalid": "{#key} date must be a valid date",
    "any.required": "{#key} date required",
})

// exports.numberWithValid = (rangeArr) => {
//     return joi.number().integer().valid(...rangeArr).messages({
//         "any.only": `{#key} must be ${rangeArr.join(' or ')}`,
//         "any.required": "{#key} is required",
//     })
// } //todo

exports.stringWithValid = (rangeArr) => {
    return joi.string().valid(...rangeArr).messages({
        "any.only": `{#key} must be ${rangeArr.join(' or ')}`,
        "any.required": "{#key} is required",
    })
}

exports.url = joi.string().uri().messages({
    "string.base": "{#key} should be text",
    "any.required": "{#key} is required",
    "string.empty": "{#key} must not be empty",
    "string.uri": "{#key} must be valid url",
})



exports.phoneNumber = joi.string().trim().min(10).max(10).messages({
    "string.base": "{#key} should be number",
    "any.required": "{#key} is required",
    "string.empty": "{#key} must not be empty",
    "string.min": `{#key} must be {#limit} digits`,
    "string.max": `{#key} must be {#limit} digits`,
})

exports.ownerPassword=this.longString({ min: 3, max: 50 })
exports.customerPassword=this.longString({ min: 3, max: 50 })