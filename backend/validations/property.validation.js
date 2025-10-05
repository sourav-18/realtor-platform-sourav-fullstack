const joi = require("joi");
const constantValidation = require("./constant.validation");
const dbConstant = require("../utils/dbConstant.utils");

exports.createBody = joi.object({
    title: constantValidation.longString({ min: 5, max: 100 }).required(),
    description: constantValidation.longString({ min: 10, max: 1000 }).required(),
    price: constantValidation.price.required(),
    topCities: constantValidation.stringWithValid(dbConstant.property.topCities).required(),
    location: constantValidation.longString({ min: 5, max: 100 }).required(),
    images: constantValidation.propertyImages.required(),
    propertyType: constantValidation.stringWithValid(dbConstant.property.propertyType).required(),
    listingType: constantValidation.stringWithValid(Object.values(dbConstant.property.listingType)).required(),
    specifications: constantValidation.getSpecifications()

})

exports.updateBody = joi.object({
    title: constantValidation.longString({ min: 5, max: 100 }).required(),
    description: constantValidation.longString({ min: 10, max: 1000 }).required(),
    price: constantValidation.price.required(),
    topCities: constantValidation.stringWithValid(dbConstant.property.topCities).required(),
    location: constantValidation.longString({ min: 5, max: 100 }).required(),
    images: constantValidation.propertyImages.required(),
    propertyType: constantValidation.stringWithValid(dbConstant.property.propertyType).required(),
    listingType: constantValidation.stringWithValid(Object.values(dbConstant.property.listingType)).required(),
    specifications: constantValidation.getSpecifications()
})

exports.updatePrams = joi.object({
    id: constantValidation.sqlId.required()
})

exports.statusUpdatePrams = joi.object({
    id: constantValidation.sqlId.required(),
    status: constantValidation.stringWithValid(Object.values(dbConstant.property.status))
})

exports.listQuery = joi.object({
    page: constantValidation.page,
    limit: constantValidation.limit(),
    search: constantValidation.longString({min:2,max:100}),
    location: constantValidation.longString({min:2,max:100}),
    minPrice: constantValidation.price,
    maxPrice: constantValidation.price,
    propertyType: constantValidation.stringWithValid(dbConstant.property.propertyType),
    listingType: constantValidation.stringWithValid(Object.values(dbConstant.property.listingType)),
    topCities: constantValidation.stringWithValid(dbConstant.property.topCities),
    bedrooms: constantValidation.numberValidate,
    sortBy:constantValidation.stringWithValid(["price-high","price-low","newest"])
}).unknown(true)

exports.listByOwnerQuery = joi.object({
    page: constantValidation.page,
    limit: constantValidation.limit()
}).unknown(true)

exports.detailsParams = joi.object({
    id: constantValidation.sqlId.required(),
})