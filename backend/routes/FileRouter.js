const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const File = require("../models/File");
const FileData = require("../models/Filedata");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload and Parse
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames?.[0];

    if (!sheetName) {
      return res.status(400).json({ message: "No sheet found in Excel file." });
    }

    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({ message: "File selected, but no data found in the Excel sheet." });
    }

    const newFile = new File({
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer,
    });

    const savedFile = await newFile.save();

    const fileData = new FileData({
      fileId: savedFile._id,
      data: jsonData,
    });

    await fileData.save();

    res.status(200).json({ message: "Uploaded & parsed", file: savedFile });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});


// Get all files
router.get("/", async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch files", error: err.message });
  }
});

// Get parsed Excel data for given fileId
router.get("/filedata/:id", async (req, res) => {
  try {
    const dataEntry = await FileData.findOne({ fileId: req.params.id });
    if (!dataEntry) return res.status(404).json({ message: "Parsed data not found" });

    res.status(200).json({ data: dataEntry.data });
  } catch (err) {
    console.error("FETCH FILEDATA ERROR:", err);
    res.status(500).json({ message: "Error retrieving parsed data", error: err.message });
  }
});

// Delete file + data
router.delete("/:id", async (req, res) => {
  try {
    const deletedFile = await File.findByIdAndDelete(req.params.id);
    const deletedData = await FileData.findOneAndDelete({ fileId: req.params.id });

    if (!deletedFile) return res.status(404).json({ message: "File not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

// Download original buffer
router.get("/download/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    res.setHeader("Content-Disposition", `attachment; filename="${file.originalname}"`);
    res.setHeader("Content-Type", file.mimetype);
    res.send(file.buffer);
  } catch (err) {
    res.status(500).json({ message: "Download failed", error: err.message });
  }
});

module.exports = router;
