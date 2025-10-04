const { DataTypes } = require("sequelize");
const sequelize = require("./connection.db");
const dbConstant = require("../utils/dbConstant.utils");

const customer = sequelize.define("customers",
    {
        name: {
            type: DataTypes.STRING,
            defaultValue: "guest"
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(Object.values(dbConstant.customers.status)),
            defaultValue: dbConstant.customers.status.active
        },
        customer_type: {
            type: DataTypes.ENUM(Object.values(dbConstant.customers.customerTypes)),
            defaultValue: dbConstant.customers.customerTypes.guest
        }
    },
)

module.exports = customer;