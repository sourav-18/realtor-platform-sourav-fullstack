const { DataTypes } = require("sequelize");
const sequelize = require("./connection.db");
const dbConstant=require("../utils/dbConstant.utils");
const ownerDb=require("./owners.db");

const property = sequelize.define("property",
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        top_cities: {
            type: DataTypes.ENUM(dbConstant.property.topCities),
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        images: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        property_type: {
            type: DataTypes.ENUM(dbConstant.property.propertyType),
            allowNull: false,
        },
        listing_type: {
            type: DataTypes.ENUM(Object.values(dbConstant.property.listingType)),
            allowNull: false,
        },
        status:{
            type: DataTypes.ENUM(Object.values(dbConstant.property.status)),
            defaultValue: dbConstant.property.status.active,
        },
        owner_id:{
            type:DataTypes.INTEGER,
            references:{
                model:ownerDb,
                key:'id'
            },
            allowNull:false
        }
    }
)

module.exports = property;