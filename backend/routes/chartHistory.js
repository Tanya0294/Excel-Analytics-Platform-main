const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ChartHistory = require("../models/ChartHistory");

router.post("/", async (req, res) => {
  try {
    const { fileId, chartType, dimension, xAxis, yAxis, zAxis } = req.body;

    console.log("Received chart history data:", req.body);

    if (!fileId || !dimension || !xAxis) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: "Invalid fileId format" });
    }

    const newChart = new ChartHistory({
      fileId: new mongoose.Types.ObjectId(fileId),
      chartType,
      dimension,
      xAxis,
      yAxis,
      zAxis,
    });

    await newChart.save();

    console.log("✅ Chart history saved successfully.");
    res.status(201).json({ message: "Chart history saved" });
  } catch (err) {
    console.error("🔥 Error saving chart history:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ✅ NEW: GET /api/chart-history - Fetch all chart history
router.get("/", async (req, res) => {
  try {
    const history = await ChartHistory.find()
      .populate("fileId", "originalname") // Populate file info
      .sort({ createdAt: -1 }); // optional: newest first

    res.status(200).json(history);
  } catch (err) {
    console.error("🔥 Error fetching chart history:", err.message);
    res.status(500).json({ message: "Failed to fetch chart history" });
  }
});

// GET /chart-history/count
router.get("/count", async (req, res) => {
  try {
    const count = await ChartHistory.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Failed to count chart history:", err);
    res.status(500).json({ message: "Server error while counting charts" });
  }
});

module.exports = router;


module.exports = router;
