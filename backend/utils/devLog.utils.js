const serverEnv = require("../utils/serverEnv.utils");

module.exports = (...data) => {
    if (serverEnv.SERVER_ENV === "dev") {
        console.log(...data);
    }
    return;
}