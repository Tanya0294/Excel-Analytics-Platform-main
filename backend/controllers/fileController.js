// controllers/fileController.js
/*const File = require("../models/File");

// Example upload controller
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Process the file
    console.log("Received file:", req.file);

    // Your Excel parsing or DB logic here...

    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error); // ✅ Show actual error in console
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};


// GET /api/files
router.get('/', async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch files', error: error.message });
  }
});


exports.deleteFile = async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "File deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};

// Download file by ID
// Example in Express
router.get("/download/:id", async (req, res) => {
  const fileId = req.params.id;

  try {
    const file = await FileModel.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    const filePath = path.join(__dirname, "../uploads", file.filename);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: "Download error", error: err.message });
  }
});
*/


/*
// controllers/fileController.js
const File = require("../models/File");
const path = require("path"); // ✅ Required for file path resolution
const fs = require("fs");

// Upload a file
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Received file:", req.file);

    // Optionally, save file details to DB
    const newFile = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
    await newFile.save();

    res.status(200).json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// Get all files
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.status(200).json(files); // Remove `{ files: ... }` wrapper for consistency
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch files", error: error.message });
  }
};

// Delete a file
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    // Optionally delete physical file
    const filePath = path.join(__dirname, "../uploads", file.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(200).json({ message: "File deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

// Download a file
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    const filePath = path.join(__dirname, "../uploads", file.filename);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: "Download error", error: err.message });
  }
};
 */



const File = require("../models/File");
const path = require("path");
const fs = require("fs");

// Upload — if needed (currently you use route logic directly)
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const newFile = new File({
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer,
    });
    await newFile.save();

    res.status(200).json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// Get all files
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch files", error: error.message });
  }
};

// Delete a file
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    res.status(200).json({ message: "File deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

// Download
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    res.setHeader("Content-Disposition", `attachment; filename="${file.originalname}"`);
    res.setHeader("Content-Type", file.mimetype);
    res.send(file.buffer);
  } catch (err) {
    res.status(500).json({ message: "Download error", error: err.message });
  }
};
