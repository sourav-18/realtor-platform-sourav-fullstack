require('dotenv').config();
require("fix-esm").register();
require("./db/connection.db");
const express = require('express');
const serverEnv = require("./utils/serverEnv.utils");
const dateFormatPackage = require("./packages/dateFormat.package");
const bodyParser = require("body-parser");
const cors = require("cors");
const responseUtils=require("./utils/response.utils");
const devLog = require('./utils/devLog.utils');


const app = express();

//middlewares
app.use(cors(
    {
        "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept,app-id,x-access-token",
        'Access-Control-Expose-Headers': "*"
    }
));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

//routes

app.use("/api/v1",require("./routes/main.routes"));

app.use((req, res) => {
    devLog("Invalid route:",req.method,req.originalUrl);
    res.json(responseUtils.errorRes({message:"Route Not Found"}));
});

app.listen(serverEnv.SERVER_PORT, (err) => {
    if (err) { console.log("Error in starting server: ", err); return; };

    let serverData = ({
        "Server Started": dateFormatPackage.getByFormat({}),
        "Server Port": serverEnv.SERVER_PORT,
        "Server Environment": serverEnv.SERVER_ENV,
    })

    console.log(serverData);
});