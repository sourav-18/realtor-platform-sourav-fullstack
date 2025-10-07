const { Sequelize } = require("sequelize");
const serverEnv = require("../utils/serverEnv.utils");

const dbConnectionInfo = {
    host: serverEnv.DB_HOST,
    dialect: 'postgres',
    logging: false
}

const sequelize = new Sequelize(serverEnv.DB_NAME, serverEnv.DB_USER, serverEnv.DB_PASSWORD,dbConnectionInfo);

// const sequelize = new Sequelize('', {
//     dialect: 'postgres',
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false 
//         }
//     },
//     logging: false
// });

sequelize.authenticate().then(() => console.log("DB connect successfully")).catch((err) => console.log("DB Connection Error:", err));

sequelize.sync({ alter: serverEnv.SERVER_ENV === "dev" ? true : false }).then(() => console.log("All DB synced")).catch((err) => console.log("DB Sync Error:", err));

module.exports = sequelize;