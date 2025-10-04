var jwt = require('jsonwebtoken');
const serverEnv = require("../utils/serverEnv.utils");
const devLog = require("../utils/devLog.utils");

exports.getToken = ({ tokenData, expiresIn }) => {
    if (!expiresIn) expiresIn = "2d";
    if (!tokenData) tokenData = {};
    var token = jwt.sign(tokenData, serverEnv.JWT_SECRET);
    return token;
}

exports.getTokenData = (token) => {
    try {
        const decoded = jwt.verify(token, serverEnv.JWT_SECRET);
        return decoded
    } catch (error) {
        devLog(error)
        return null;
    }

}