const environmentVariables = {
    SERVER_PORT: process.env.SERVER_PORT,
    SERVER_ENV: process.env.SERVER_ENV,

    APP_ID: process.env.APP_ID,
    JWT_SECRET: process.env.JWT_SECRET,


    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,

    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,


}

module.exports = environmentVariables;