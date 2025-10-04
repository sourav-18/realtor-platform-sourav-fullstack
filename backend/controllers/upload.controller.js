const responseUtils = require("../utils/response.utils");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const devLog = require("../utils/devLog.utils");
const serverEnv = require("../utils/serverEnv.utils");


cloudinary.config({
    cloud_name: serverEnv.CLOUDINARY_CLOUD_NAME,
    api_key: serverEnv.CLOUDINARY_API_KEY,
    api_secret: serverEnv.CLOUDINARY_API_SECRET
});

async function cloudinaryUpload(buffer) {
    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "realtor-platform" },
                (error, uploadedResult) => {
                    if (error) reject(error);
                    else resolve(uploadedResult);
                }
            );
            stream.end(buffer);
        });
        return result.url;
    } catch (error) {
        return null;
    }

}

exports.imageUpload = async (req, res) => {
    try {
        let maxSize = 5 * 1024 * 1024;
        let fileDetails = multer({
            limits: {
                fileSize: maxSize
            },
            fileFilter: (req, file, cb) => {
                if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === 'image/jpg') {
                    cb(null, true);
                } else {
                    cb({
                        message: "Unsupported File Format"
                    });
                }
            }
        }).single("image");

        fileDetails(req, res, async (err) => {
            if (err) {
                return res.json(responseUtils.errorRes({ message: err.message }))
            } else if (!req.file) {
                return res.json(responseUtils.errorRes({ message: "No images selected" }))
            } else {
                const imageUrl = await cloudinaryUpload(req.file.buffer);
                if (!imageUrl) return res.json(responseUtils.errorRes({ message: "Failed to upload image" }));
                return res.json(responseUtils.successRes({ message: "Image upload successfully", data: imageUrl }));
            }
        }
        )
    } catch (error) {
        devLog(error)
        return res.json(responseUtils.errorRes({ message: "Internal Server Error" }))
    }

}

exports.bulkImageUpload = async (req, res) => {
    try {
        const maxImageLen = 10;
        let maxSize = (5 * 1024 * 1024) * maxImageLen;
        let fileDetails = multer({
            limits: {
                fileSize: maxSize
            },
            fileFilter: (req, file, cb) => {
                if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === 'image/jpg') {
                    cb(null, true);
                } else {
                    cb({
                        message: "Unsupported File Format"
                    });
                }
            },
            storage: multer.memoryStorage(),
        }).array("images", maxImageLen);

        fileDetails(req, res, async (err) => {
            if (err) {
                return res.json(responseUtils.errorRes({ message: err.message }))
            } else if (!req.files || req.files.length === 0) {
                return res.json(responseUtils.errorRes({ message: "No images selected" }))
            } else {
                let imageUrls = await Promise.all(req.files.map((item) => cloudinaryUpload(item.buffer)));
                imageUrls = imageUrls.filter(item => item);
                return res.json(responseUtils.successRes({ message: "Image upload successfully", data: imageUrls }));
            }
        }
        )
    } catch (error) {
        devLog(error)
        return res.json(responseUtils.errorRes({ message: "Internal Server Error" }))
    }

}


