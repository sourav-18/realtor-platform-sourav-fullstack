const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const dateFormatPackage = require("./packages/dateFormat.package");
const log = require("../utils/log.utils")

let S3 = new S3Client({
    endpoint: process.env.DIGITAL_OCEAN_SPACES_ENDPOINT,
    // region: process.env.DIGITAL_OCEAN_SPACES_REGION,
    credentials: {
        accessKeyId: process.env.DIGITAL_OCEAN_ACCESS_KEY,
        secretAccessKey: process.env.DIGITAL_OCEAN_SPACES_SECRET,
    }
});

async function fileUpload(folderName, fileOriginalname, bufferFile, mimetype) {
    const command = new PutObjectCommand({
        Bucket: process.env.DIGITAL_OCEAN_SPACES_BUCKET,
        Key: `realtor/${folderName}/` + dateFormatPackage.getByFormat({ date: new Date(), format: "yyyymmdd" }) + "/" + dateFormatPackage.getByFormat({ date: new Date(), format: "yyyymmddHHMMss" }) + "_" + fileOriginalname.replace(/ /g, "_"),
        Body: bufferFile,
        ACL: "public-read",
        ContentType: mimetype,
    })
    await S3.send(command);
    return process.env.DIGITAL_OCEAN_SPACES_BASE_URL + command.input.Key;
}

// exports.profileImageUpload = async (req, res) => {
//     try {
//         let maxSize = 2 * 1024 * 1024;
//         let fileDetails = multer({
//             limits: {
//                 fileSize: maxSize
//             },
//             fileFilter: (req, file, cb) => {
//                 if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === 'image/jpg') {
//                     cb(null, true);
//                 } else {
//                     cb({
//                         message: "Unsupported File Format"
//                     });
//                 }
//             }
//         }).single("file");
//         fileDetails(req, res, async (err) => {
//             if (err) {
//                 return res.json({
//                     status: "error",
//                     message: err.message,
//                     responseCode: 500,
//                     data: null,
//                 });
//             } else if (!req.file) {
//                 return res.json({
//                     status: "error",
//                     message: "File Not Selected",
//                     responseCode: 500,
//                     data: null,
//                 });
//             } else {
//                 try {
//                     const getUploadedFileUrl = await fileUpload("profile-pic", req.file.originalname, req.file.buffer, req.file.mimetype);
//                     return res.json({
//                         status: "success",
//                         message: "profile image upload successfully",
//                         responseCode: 200,
//                         data: getUploadedFileUrl,
//                     });
//                 } catch (error) {
//                     return res.json({
//                         status: "error",
//                         message: error,
//                         responseCode: 500,
//                         data: null,
//                     });
//                 }
//             }
//         });
//     } catch (error) {
//         return res.json({
//             status: "error",
//             responseCode: 500,
//             message: "Internal Server Error. Please try again later.",
//             data: null
//         });
//     }
// }