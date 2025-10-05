const { DataTypes } = require("sequelize");
const sequelize = require("./connection.db");
const dbConstant = require("../utils/dbConstant.utils");

const owner = sequelize.define("owners",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(Object.values(dbConstant.owners.status)),
            defaultValue: dbConstant.owners.status.active
        },
        profile_pic: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        indexes: [
            { fields: ['status'] },
        ]
    }
)

module.exports = owner;