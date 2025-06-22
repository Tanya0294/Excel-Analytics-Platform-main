/*const multer = require("multer");
const path = require("path");

// Ensure this folder exists: /backend/uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Save to /uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage });
*/
const multer = require("multer");

// ✅ In-memory storage
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
