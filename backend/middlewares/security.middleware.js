const serverEnv = require("../utils/serverEnv.utils");
const responseUtils = require("../utils/response.utils");
const jwtPackage = require("../packages/jwt.packages");
const devLog = require("../utils/devLog.utils");

exports.checkAppId = (req, res, next) => {
    const appId = req.headers["app-id"];
    if (!appId) {
        return res.json(responseUtils.errorRes({ message: "App not provided" }));
    } else if (appId !== serverEnv.APP_ID) {
        return res.json(responseUtils.errorRes({ message: "Invalid App ID" }));
    }
    next();
}

exports.checkTokenWithRoles = (req, res, next, roles) => {
    try {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if (!token) {
            return res.json(responseUtils.errorRes({ message: "Token not provided" }));
        }
        token = token.startsWith("Bearer ") ? token.slice(7) : token;
        const tokenData = jwtPackage.getTokenData(token);

        if (!tokenData) {
            return res.json(responseUtils.errorRes({ message: "Invalid Token" }));
        }

        if (!roles || roles.length == 0||!roles.includes(tokenData.role)) {
            return res.json(responseUtils.errorRes({ message: "Access to this field is not allowed." }));
        }
        next();
    } catch (error) {
        devLog(error);
        return res.json(responseUtils.errorRes({ message: "Internal Server Error" }));
    }

}

exports.checkToken = (req, res, next, roles) => {
    try {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if (!token) {
            return res.json(responseUtils.errorRes({ message: "Token not provided" }));
        }
        token = token.startsWith("Bearer ") ? token.slice(7) : token;
        const tokenData = jwtPackage.getTokenData(token);

        if (!tokenData) {
            return res.json(responseUtils.errorRes({ message: "Invalid Token" }));
        }
        next();
    } catch (error) {
        devLog(error);
        return res.json(responseUtils.errorRes({ message: "Internal Server Error" }));
    }

}