/*
// models/File.js
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: {
  type: String,
  required: true,
},
  originalname: String,
  mimetype: String,
  size: Number,
}, { timestamps: true }); // <-- required for createdAt

module.exports = mongoose.model("File", fileSchema);
*/

/*
const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  buffer: Buffer,
  mimetype: String,
  size: Number,
}, { timestamps: true });

module.exports = mongoose.models.File || mongoose.model("File", FileSchema);
*/
const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  filename: String, // Optional: add if you save with diskStorage
  originalname: String,
  mimetype: String,
  size: Number,
  buffer: Buffer
}, { timestamps: true });

module.exports = mongoose.models.File || mongoose.model("File", FileSchema);

