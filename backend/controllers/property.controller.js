const responseUtils = require("../utils/response.utils");
const propertyValidation = require("../validations/property.validation");
const propertyDb = require("../db/property.db");
const devLog = require("../utils/devLog.utils");
const constantUtils = require("../utils/constant.utils");
const dbConstantUtils = require("../utils/dbConstant.utils");
const { Op } = require("sequelize");
const ownersDb = require("../db/owners.db");

exports.create = async (req, res) => {
    try {
        const validate = propertyValidation.createBody.validate(req.body);
        if (validate.error) {
            return res.json(responseUtils.errorRes({ message: validate.error.message }));
        }
        const { title, description, price, topCities, location, images, propertyType, listingType, specifications } = req.body;
        const createData = {
            title: title.trim(),
            description: description.trim(),
            price: price,
            top_cities: topCities,
            location: location.trim(),
            images: images,
            property_type: propertyType,
            listing_type: listingType,
            specifications:specifications,
            owner_id: req.headers.user_id
        }
        await propertyDb.create(createData)
        return res.json(responseUtils.successRes({ message: "property create successfully" }));
    } catch (error) {
        devLog(error);
        return res.json(responseUtils.errorRes({ message: "Internal Server Error" }));
    }
}

exports.list = async (req, res) => {
    try {
        const validate = propertyValidation.listQuery.validate(req.query);
        if (validate.error) {
            return res.json(responseUtils.errorRes({ message: validate.error.message }));
        }
        const { skip, limit } = constantUtils.getPaginationValue(req.query.page, req.query.limit);
        const {specifications,topCities,listingType,propertyType}=req.body;
        const filterQuery={status: dbConstantUtils.property.status.active}
        if(topCities)filterQuery.top_cities=topCities;
        if(topCities)filterQuery.listing_type=listingType;
        if(topCities)filterQuery.property_type=propertyType;

        const dbRes = await propertyDb.findAndCountAll({
            where: filterQuery, order: [['id', 'DESC']], offset: skip, limit: limit,
            attributes: { exclude: ["status"] }
        })

        if (dbRes.rows.length === 0) {
            return res.json(responseUtils.errorRes({ message: "Property not found" }));
        }

        return res.json(responseUtils.successRes({
            message: "Property fetch successfully", data: {
                items: dbRes.rows,
                totalCount: dbRes.count,
            }
        }));

    } catch (error) {
        devLog(error);
        return res.json(responseUtils.errorRes({ message: "Internal Server Error" }));
    }
}

exports.update = async (req, res) => {
    try {
        const validate1 = propertyValidation.updatePrams.validate(req.params);
        const validate2 = propertyValidation.updateBody.validate(req.body);
        const validate = validate1.error ? validate1 : validate2;
        if (validate.error) {
            return res.json(responseUtils.errorRes({ message: validate.error.message }));
        }
        const { title, description, price, topCities, location, images, propertyType, listingType, specifications } = req.body;
        const updateData = {
            title: title.trim(),
            description: description.trim(),
            price: price,
            top_cities: topCities,
            location: location.trim(),
            images: images,
            property_type: propertyType,
            listing_type: listingType,
        }
        if(specifications)updateData.specifications=specifications;
        const updateDbRes = await propertyDb.update(updateData,
            {
                where: { id: req.params.id, owner_id: req.headers.user_id, status: { [Op.ne]: dbConstantUtils.property.status.delete } },
                limit: 1
            },
        )

        if (!updateDbRes[0]) {
            return res.json(responseUtils.successRes({ message: "Property not found" }));
        }
        return res.json(responseUtils.successRes({ message: "Property updated successfully" }));
    } catch (error) {
        devLog(error);
        return res.json(responseUtils.errorRes({ message: "Internal Server Error" }));
    }
}

exports.statusUpdate = async (req, res) => {
    try {
        const validate = propertyValidation.statusUpdatePrams.validate(req.params);
        if (validate.error) {
            return res.json(responseUtils.errorRes({ message: validate.error.message }));
        }
        const updateDbRes = await propertyDb.update({
            status: req.params.status
        },
            {
                where: { id: req.params.id, owner_id: req.headers.user_id },
                limit: 1
            },
        )
        if (!updateDbRes[0]) {
            return res.json(responseUtils.successRes({ message: "Property not found" }));
        }
        return res.json(responseUtils.successRes({ message: "property status updated successfully" }));
    } catch (error) {
        devLog(error);
        return res.json(responseUtils.errorRes({ message: "Internal Server Error" }));
    }
}

exports.listByOwner = async (req, res) => {
    try {
        const validate = propertyValidation.listByOwnerQuery.validate(req.query);
        if (validate.error) {
            return res.json(responseUtils.errorRes({ message: validate.error.message }));
        }
        const { skip, limit } = constantUtils.getPaginationValue(req.query.page, req.query.limit);
        const dbRes = await propertyDb.findAndCountAll({
            where: {
                status: { [Op.ne]: dbConstantUtils.property.status.delete },
                owner_id: req.headers.user_id,
            }, order: [['id', 'DESC']], offset: skip, limit: limit,
            attributes: { exclude: ["owner_id"] }
        })

        if (dbRes.rows.length === 0) {
            return res.json(responseUtils.errorRes({ message: "Property not found" }));
        }

        return res.json(responseUtils.successRes({
            message: "Property fetch successfully", data: {
                items: dbRes.rows,
                totalCount: dbRes.count,
            }
        }));

    } catch (error) {
        devLog(error);
        return res.json(responseUtils.errorRes({ message: "Internal Server Error" }));
    }
}

exports.details = async (req, res) => {
    try {
        const validate = propertyValidation.detailsParams.validate(req.params);
        if (validate.error) {
            return res.json(responseUtils.errorRes({ message: validate.error.message }));
        }
        const dbRes = await propertyDb.findOne({
            where: {
                status: dbConstantUtils.property.status.active,
                id: req.params.id
            },
            attributes: { exclude: ["status"] }
        })

        if (!dbRes) {
            return res.json(responseUtils.errorRes({ message: "Property not found" }));
        }
        const ownerId = dbRes.dataValues.owner_id;
        delete dbRes.dataValues.owner_id;
        if (req.headers.user_id) {
            const ownerDbRes = await ownersDb.findByPk(ownerId, { attributes: ["name", "phone_number"] })
            if (ownerDbRes)
                dbRes.dataValues.ownerDetails = { name: ownerDbRes.name, phoneNumber: ownerDbRes.phone_number }
        }

        return res.json(responseUtils.successRes({ message: "Property details fetch successfully", data: dbRes }));
    } catch (error) {
        devLog(error);
        return res.json(responseUtils.errorRes({ message: "Internal Server Error" }));
    }
}

exports.staticData = async = (req, res) => {
    return res.json(responseUtils.successRes({
        message: "property static fetch successfully",
        data: {
            topCities: dbConstantUtils.property.topCities,
            listingType: dbConstantUtils.property.listingType,
            propertyType: dbConstantUtils.property.propertyType,
        }
    }));
}