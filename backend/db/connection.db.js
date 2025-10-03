const { Sequelize } = require("sequelize");
const serverEnv = require("../utils/serverEnv.utils");

const sequelize = new Sequelize(serverEnv.DB_NAME, serverEnv.DB_USER, serverEnv.DB_PASSWORD, {
    host: serverEnv.DB_HOST,
    dialect: 'postgres'
});

sequelize.authenticate().then(()=>console.log("DB connect successfully")).catch((err)=>console.log("DB Connection Error:",err));