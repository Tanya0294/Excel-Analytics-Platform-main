/*const mongoose = require("mongoose");

const FileDataSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

// ✅ This prevents OverwriteModelError during hot-reloads
module.exports = mongoose.models.FileData || mongoose.model("FileData", FileDataSchema);
*/
const mongoose = require("mongoose");

const FileDataSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.models.FileData || mongoose.model("FileData", FileDataSchema);
