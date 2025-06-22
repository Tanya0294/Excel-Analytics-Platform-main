// src/pages/UploadPage.js
import React, { useState } from "react";
import axios from "axios";
import "../styles/UploadPage.css";

import { toast, ToastContainer } from "react-toastify";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ File uploaded successfully");
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      toast.error("❌ Upload failed");
    }
  };

  return (
    <div className="modal-content page-version">
      <div className="upload-left">
        <div className="drop-zone">
          <p>📤 Drag and Drop files to upload</p>
          <input type="file" onChange={handleFileChange} />
          <button className="upload-btn" onClick={handleUpload}>Upload</button>
          <p className="note">Supported: XLS, XLSX</p>
        </div>
      </div>
      <div className="upload-right">
        <h4>Uploaded Files</h4>
        <ul className="uploaded-files-list">
          <li><span>{selectedFile?.name || "No file selected"}</span></li>
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UploadPage;
/*
import React, { useState } from "react";
import axios from "axios";
import "../styles/Upload.css";
import { toast, ToastContainer } from "react-toastify";

const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files first.");
      return;
    }

    const remainingFiles = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.post("/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(`✅ ${file.name} uploaded`);
      } catch (error) {
        console.error(error);
        toast.error(`❌ Failed to upload ${file.name}`);
        remainingFiles.push(file);
      }
    }

    setSelectedFiles(remainingFiles);
  };

  return (
    <div className="upload-page">
      <div className="upload-left">
        <div className="drop-zone">
          <p>📤 Drag and drop or choose multiple files</p>
          <input type="file" multiple onChange={handleFileChange} />
          <button className="upload-btn" onClick={handleUpload}>
            Upload All
          </button>
          <p className="note">Supported: XLS, XLSX</p>
        </div>
      </div>

      <div className="upload-right">
        <h4>Selected Files</h4>
        <ul className="uploaded-files-list">
          {selectedFiles.length === 0 ? (
            <li>No files selected</li>
          ) : (
            selectedFiles.map((file, idx) => (
              <li key={idx}>
                <span>{file.name}</span>
              </li>
            ))
          )}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UploadPage;
*/