import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import UploadPopup from "../components/UploadModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [chartCount, setChartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    fetchFiles();

    // Use chart count from localStorage (updated by History.js)
    const storedChartCount = localStorage.getItem("chartCount");
    if (storedChartCount) {
      setChartCount(parseInt(storedChartCount));
    }

    // Add loading animation
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get("/files");
      setFiles(res.data);
    } catch (err) {
      console.error("Files fetch error:", err);
      toast.error("Failed to load files");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/files/${id}`);
      fetchFiles();
      toast.success("File deleted successfully! 🗑️");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Delete failed");
    }
  };

  const handleAnalyze = (id) => {
    navigate(`/charts/${id}`);
  };

  const filteredFiles = files.filter((file) =>
    file?.originalname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (fileId) => {
    navigate(`/showdata/${fileId}`);
  };

  if (isLoading) {
    return (
      <div className="dashboard-container loading">
        <div className="animated-background"></div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your analytics dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
        <div className="grid-overlay"></div>
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {showUpload && (
        <UploadPopup
          onClose={() => setShowUpload(false)}
          onUploadSuccess={fetchFiles}
        />
      )}

      <div className="content-wrapper">
        <h1 className="dashboard-title">
          <span className="title-icon">📊</span>
          Excel Analytics Dashboard
          <div className="title-underline"></div>
        </h1>

        <div className="card-container">
          <div 
            className={`card upload-card ${hoveredCard === 'upload' ? 'hovered' : ''}`}
            onClick={() => setShowUpload(true)}
            onMouseEnter={() => setHoveredCard('upload')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="card-icon">📁</div>
            <p className="card-title">Upload Excel File</p>
            <p className="card-desc">Import new data for analysis</p>
            <div className="card-hover-effect"></div>
          </div>

          <div 
            className={`card stats-card ${hoveredCard === 'files' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredCard('files')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="card-icon">📄</div>
            <p className="card-number counter" data-target={files.length}>{files.length}</p>
            <p className="card-desc">Files Uploaded</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${Math.min(files.length * 10, 100)}%`}}></div>
            </div>
            <div className="card-hover-effect"></div>
          </div>

          <div 
            className={`card stats-card ${hoveredCard === 'charts' ? 'hovered' : ''}`}
            onClick={() => navigate("/history")}
            onMouseEnter={() => setHoveredCard('charts')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="card-icon">📈</div>
            <p className="card-number counter" data-target={chartCount}>{chartCount}</p>
            <p className="card-desc">Charts Created</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${Math.min(chartCount * 5, 100)}%`}}></div>
            </div>
            <div className="card-hover-effect"></div>
          </div>
        </div>

        <div className="search-section">
          <div className="search-bar-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              placeholder="Search filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="table-container">
          <table className="files-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Filename</th>
                <th>Date</th>
                <th>Size</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan="5">
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <p>No files found</p>
                      <p className="empty-desc">
                        {searchTerm ? 'Try adjusting your search' : 'Upload your first Excel file to get started'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file, index) => (
                  <tr
                    key={file._id}
                    className="table-row"
                    onClick={(e) => {
                      if (!e.target.closest("td.action-cell")) {
                        handleRowClick(file._id);
                      }
                    }}
                  >
                    <td>{index + 1}</td>
                    <td className="filename-cell">
                      <span className="file-icon">📄</span>
                      {file.originalname}
                    </td>
                    <td>{new Date(file.createdAt).toLocaleDateString()}</td>
                    <td>{(file.size / 1024).toFixed(2)} KB</td>
                    <td className="action-cell">
                      <button 
                        className="action-btn analyze-btn"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleAnalyze(file._id); 
                        }}
                      >
                        <span className="btn-icon">📊</span>
                        Analyze
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleDelete(file._id); 
                        }}
                      >
                        <span className="btn-icon">🗑️</span>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;