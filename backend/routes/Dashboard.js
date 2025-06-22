const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const UploadHistory = require('../models/UploadHistory'); // You need to create this

const upload = multer({ dest: 'uploads/' });

// POST /dashboard/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', req.file.path);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];

    const rows = [];
    worksheet.eachRow((row, rowNumber) => {
      rows.push(row.values);
    });

    // Save history
    await UploadHistory.create({
      fileName: req.file.originalname,
      uploadedAt: new Date()
    });

    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing file');
  }
});

// GET /dashboard/history
router.get('/history', async (req, res) => {
  try {
    const history = await UploadHistory.find().sort({ uploadedAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).send('Error fetching history');
  }
});

module.exports = router;
