const bcrypt = require('bcrypt');
const saltRounds = 10;
const devLog = require("../utils/devLog.utils");

exports.getHahPassword = async (password) => {
    try {
        const hashPassword = await bcrypt.hash(password, saltRounds);
        return hashPassword;
    } catch (error) {
        devLog(error);
        return null;
    }
}

exports.isValidPassword = async ({password,hashPassword}) => {
    try {
        const result = await bcrypt.compare(password, hashPassword);
        return result;
    } catch (error) {
        devLog(error);
        return false;
    }
}