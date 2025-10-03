const dateFormat = require("dateformat").default;

exports.getByFormat = ({ date, format }) => {
    if (!date) date = new Date();
    if (!format) format = "yyyy-mm-dd H:MM:ss";

    return dateFormat(new Date(date.toString()).toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
    }), format);
}