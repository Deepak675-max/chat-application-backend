const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, 'C:/Users/deepa/OneDrive/Desktop/chat application/backend/public/files')
        const uploadPath = '/home/ubuntu/chat_app/chat-application-backend/public/files'
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const originalName = path.parse(file.originalname).name; // Extracting the name without extension
        const fileNameWithSuffix = originalName + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, fileNameWithSuffix);
    }
})

const upload = multer({ storage: storage });

module.exports = upload;