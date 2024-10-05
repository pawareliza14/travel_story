const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir); // Destination folder for storing uploaded files
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed"), false);
    }
};

// Initialize multer instance
const upload = multer({
    storage,
    fileFilter,
});

module.exports = upload;
