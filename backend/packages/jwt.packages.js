var jwt = require('jsonwebtoken');
const serverEnv = require("../utils/serverEnv.utils");

exports.getToken = ({ tokenData, expiresIn }) => {
    if (!expiresIn) expiresIn = "2d";
    if (tokenData) tokenData = {};
    var token = jwt.sign(tokenData, serverEnv.JWT_SECRET);
    return token;
}