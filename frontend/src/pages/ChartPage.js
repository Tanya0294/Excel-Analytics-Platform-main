/*
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/ChartPage.css";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Plot from "react-plotly.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, ArcElement, Tooltip, Legend);

const ChartPage = () => {
  const { fileId } = useParams();
  const [fileList, setFileList] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(fileId || "");
  const [fileData, setFileData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dimension, setDimension] = useState("1D");
  const [chartType, setChartType] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [zAxis, setZAxis] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [chartReady, setChartReady] = useState(false);
  const chartRef = useRef();

  useEffect(() => {
    const init = async () => {
      await fetchFiles();
      if (fileId) {
        setSelectedFileId(fileId);
        fetchParsedFileData(fileId);
      }
    };
    init();
  }, []);

  const fetchFiles = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/files");
    console.log("Fetched files:", res.data);  // Add this line
    setFileList(res.data);
  } catch (err) {
    console.error("Failed to fetch file list:", err);
  }
};


  const fetchParsedFileData = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/files/filedata/${id}`);
      const data = res.data?.data || [];
      setFileData(data);
      if (data.length > 0) setColumns(Object.keys(data[0]));
    } catch (err) {
      console.error("Error loading parsed file data:", err);
    }
  };

  const handleFileSelect = async (fileId) => {
    setSelectedFileId(fileId);
    if (!/^[a-f\d]{24}$/i.test(fileId)) {
      console.warn("Invalid File ID format:", fileId);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/files/filedata/${fileId}`);
      const data = response.data.data;
      setFileData(data);
      if (data.length > 0) setColumns(Object.keys(data[0]));
    } catch (error) {
      console.error("Error loading parsed file data:", error);
    }
  };

  const handleDownload = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 100);
    pdf.save("chart.pdf");
  };

  const handleSaveToHistory = async () => {
  try {
    if (!selectedFileId || !chartType || !xAxis) {
      alert("Please generate a chart before saving to history.");
      return;
    }

    const payload = {
      fileId: selectedFileId,
      chartType,
      dimension,
      xAxis,
      yAxis: yAxis || null,
      zAxis: zAxis || null,
    };

    console.log("Saving chart to history with payload:", payload);

    const response = await axios.post("http://localhost:5000/api/chart-history", payload);

    if (response.status === 201 || response.status === 200) {
      alert("Chart saved to history successfully!");
    } else {
      alert("Failed to save chart history.");
      console.error("Server responded with:", response);
    }
  } catch (err) {
    console.error("Save to history failed:", err.response?.data || err.message);
    alert("An error occurred while saving to history:\n" + (err.response?.data?.message || err.message));
  }
};


  const renderChart = (isLarge = false) => {
    if (!xAxis || (dimension === "2D" && !yAxis)) return null;

    const labels = fileData.map(row => row[xAxis]);
    const yData = fileData.map(row => row[yAxis]);
    const zData = fileData.map(row => row[zAxis]);

    const chartData = {
      labels,
      datasets: [{
        label: yAxis,
        data: yData,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1
      }]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: chartType.toUpperCase() + ' Chart' }
      }
    };

    if (dimension === "1D" && chartType === "pie") {
      const pieValues = fileData.map(row => row[xAxis]);
      const valueCounts = pieValues.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
      return (
        <Plot
          data={[{
            type: "pie",
            labels: Object.keys(valueCounts),
            values: Object.values(valueCounts),
            hole: 0,
            pull: 0.05,
            marker: { line: { color: "#000", width: 1 } }
          }]}
          layout={{
            title: "3D Style Pie Chart",
            showlegend: true,
            height: 500,
            width: 500
          }}
        />
      );
    }
    if (dimension === "2D" && chartType === "bar") return <Bar data={chartData} options={chartOptions} />;
    if (dimension === "2D" && chartType === "line") return <Line data={chartData} options={chartOptions} />;

    if (dimension === "3D") {
      return (
        <Plot
          data={[{
            x: labels,
            y: yData,
            z: zData,
            type: 'scatter3d',
            mode: 'markers',
            marker: { size: 5, color: zData, colorscale: 'Viridis' }
          }]}
          layout={{
            margin: { l: 0, r: 0, b: 0, t: 0 },
            width: isLarge ? 1000 : 950,
            height: isLarge ? 700 : 500,
            title: '3D Data Visualization'
          }}
        />
      );
    }

    if (dimension === "2D3D") {
      return (
        <Plot
          data={[{
            type: "bar3d",
            x: labels,
            y: yData,
            z: yData.map(() => 1),
            marker: {
              color: yData,
              colorscale: "Viridis"
            }
          }]}
          layout={{
            title: "2D with 3D View",
            scene: {
              xaxis: { title: xAxis },
              yaxis: { title: yAxis },
              zaxis: { title: "Depth" }
            },
            width: isLarge ? 1200 : 1000,
            height: isLarge ? 700 : 600
          }}
        />
      );
    }

    return <p>Unsupported chart configuration.</p>;
  };

  return (
    <div className="chart-page">
      <div className="chart-container">
        <div className="left-panel">
          <h1>📊 File Analysis</h1>

          <div className="panel-box">
            <label>Select File:</label>
            <select value={selectedFileId} onChange={(e) => handleFileSelect(e.target.value)} disabled={fileList.length === 0}>
              <option value="">-- Choose a file --</option>
              {fileList.map((file) => (
                <option key={file._id} value={file._id}>{file.originalname}</option>
              ))}
            </select>
          </div>

          <div className="panel-box">
            <label>Dimension:</label>
            <select value={dimension} onChange={(e) => {
              setDimension(e.target.value);
              setChartType("");
              setXAxis("");
              setYAxis("");
              setZAxis("");
            }}>
              <option value="1D">1D</option>
              <option value="2D">2D</option>
              <option value="3D">3D</option>
              <option value="2D3D">2D (3D View)</option>
            </select>
          </div>

          {dimension === "1D" && (
            <>
              <div className="panel-box">
                <label>Chart Type:</label>
                <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                  <option value="">-- Select Type --</option>
                  <option value="pie">Pie</option>
                </select>
              </div>
              <div className="panel-box">
                <label>X-Axis:</label>
                <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
                  <option value="">-- Select Column --</option>
                  {columns.map((col, idx) => <option key={idx} value={col}>{col}</option>)}
                </select>
              </div>
            </>
          )}

          {dimension === "2D" && (
            <>
              <div className="panel-box">
                <label>Chart Type:</label>
                <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                  <option value="">-- Select Type --</option>
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                </select>
              </div>
              <div className="panel-box">
                <label>X-Axis:</label>
                <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
                  <option value="">-- Select Column --</option>
                  {columns.map((col, idx) => <option key={idx} value={col}>{col}</option>)}
                </select>
              </div>
              <div className="panel-box">
                <label>Y-Axis:</label>
                <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
                  <option value="">-- Select Column --</option>
                  {columns.map((col, idx) => <option key={idx} value={col}>{col}</option>)}
                </select>
              </div>
            </>
          )}

          {dimension === "3D" && (
            <>
              <div className="panel-box">
                <label>X-Axis:</label>
                <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
                  <option value="">-- Select Column --</option>
                  {columns.map((col, idx) => <option key={idx} value={col}>{col}</option>)}
                </select>
              </div>
              <div className="panel-box">
                <label>Y-Axis:</label>
                <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
                  <option value="">-- Select Column --</option>
                  {columns.map((col, idx) => <option key={idx} value={col}>{col}</option>)}
                </select>
              </div>
              <div className="panel-box">
                <label>Z-Axis:</label>
                <select value={zAxis} onChange={(e) => setZAxis(e.target.value)}>
                  <option value="">-- Select Column --</option>
                  {columns.map((col, idx) => <option key={idx} value={col}>{col}</option>)}
                </select>
              </div>
            </>
          )}

          <button className="generate-btn" onClick={() => setChartReady(true)}>📈 Generate Chart</button>
          <button className="download-btn" onClick={handleDownload}>⬇️ Download Chart</button>
          <button className="save-history-btn" onClick={handleSaveToHistory}>💾 Save to History</button>
        </div>

        <div className="chart-preview" onClick={() => chartReady && setShowChart(true)}>
          <div ref={chartRef} style={{ width: "100%", height: "500px" }}>
            {chartReady && renderChart()}
          </div>
        </div>
      </div>

      {showChart && (
        <div className="modal-overlay">
          <div className="modal-chart">
            <div className="chart-box" ref={chartRef}>{renderChart(true)}</div>
            <div className="modal-actions">
              <button className="download-btn" onClick={handleDownload}>⬇️ Download</button>
              <button className="close-btn" onClick={() => setShowChart(false)}>❌ Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartPage;
*/
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/ChartPage.css";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Plot from "react-plotly.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const ChartPage = () => {
  const { fileId } = useParams();
  const [fileList, setFileList] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(fileId || "");
  const [fileData, setFileData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dimension, setDimension] = useState("1D");
  const [chartType, setChartType] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [zAxis, setZAxis] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [chartReady, setChartReady] = useState(false);
  const chartRef = useRef();

  useEffect(() => {
    const init = async () => {
      await fetchFiles();
      if (fileId) {
        setSelectedFileId(fileId);
        fetchParsedFileData(fileId);
      }
    };
    init();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/files");
      setFileList(res.data);
    } catch (err) {
      toast.error("Failed to fetch file list.");
    }
  };

  const fetchParsedFileData = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/files/filedata/${id}`);
      const data = res.data?.data || [];
      setFileData(data);
      if (data.length > 0) setColumns(Object.keys(data[0]));
    } catch (err) {
      toast.error("Error loading parsed file data.");
    }
  };

  const handleFileSelect = async (fileId) => {
    setSelectedFileId(fileId);
    if (!/^[a-f\d]{24}$/i.test(fileId)) {
      toast.warn("Invalid File ID format.");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/files/filedata/${fileId}`);
      const data = response.data.data;
      setFileData(data);
      if (data.length > 0) setColumns(Object.keys(data[0]));
    } catch (error) {
      toast.error("Error loading parsed file data.");
    }
  };

  const handleDownload = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 100);
    pdf.save("chart.pdf");
    toast.success("Chart downloaded successfully.");
  };

  const handleSaveToHistory = async () => {
    try {
      if (!chartReady) {
        toast.warn("No chart generated yet.");
        return;
      }
      if (!selectedFileId || !xAxis || (dimension === "2D" && !yAxis) || (dimension === "3D" && (!yAxis || !zAxis))) {
        toast.warn("Please generate a chart before saving to history.");
        return;
      }

      const payload = {
        fileId: selectedFileId,
        chartType: chartType || 'scatter3d',
        dimension,
        xAxis,
        yAxis: yAxis || null,
        zAxis: zAxis || null,
      };

      const response = await axios.post("http://localhost:5000/api/chart-history", payload);

      if (response.status === 201 || response.status === 200) {
        toast.success("Chart saved to history successfully!");
      } else {
        toast.error("Failed to save chart history.");
      }
    } catch (err) {
      toast.error("Error saving chart to history: " + (err.response?.data?.message || err.message));
    }
  };

  const renderChart = (isLarge = false) => {
    if (!xAxis || (dimension === "2D" && !yAxis)) return null;

    const labels = fileData.map((row) => row[xAxis]);
    const yData = fileData.map((row) => row[yAxis]);
    const zData = fileData.map((row) => row[zAxis]);

    const chartData = {
      labels,
      datasets: [
        {
          label: yAxis,
          data: yData,
          backgroundColor: "rgba(75,192,192,0.6)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: chartType.toUpperCase() + " Chart" },
      },
    };

    if (dimension === "1D" && chartType === "pie") {
      const pieValues = fileData.map((row) => row[xAxis]);
      const valueCounts = pieValues.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
      return (
        <Plot
          data={[
            {
              type: "pie",
              labels: Object.keys(valueCounts),
              values: Object.values(valueCounts),
              hole: 0,
              pull: 0.05,
              marker: { line: { color: "#000", width: 1 } },
            },
          ]}
          layout={{
            title: "Pie Chart",
            showlegend: true,
            height: 500,
            width: 500,
          }}
        />
      );
    }

    if (dimension === "2D" && chartType === "bar") return <Bar data={chartData} options={chartOptions} />;
    if (dimension === "2D" && chartType === "line") return <Line data={chartData} options={chartOptions} />;

    if (dimension === "3D") {
      return (
        <Plot
          data={[
            {
              x: labels,
              y: yData,
              z: zData,
              type: "scatter3d",
              mode: "markers",
              marker: { size: 5, color: zData, colorscale: "Viridis" },
            },
          ]}
          layout={{
            margin: { l: 0, r: 0, b: 0, t: 0 },
            width: isLarge ? 1000 : 950,
            height: isLarge ? 700 : 500,
            title: "3D Data Visualization",
          }}
        />
      );
    }

    return <p>Unsupported chart configuration.</p>;
  };

  return (
    <div className="chart-page">
      <ToastContainer />
      <div className="chart-container">
        <div className="left-panel">
          <h1>📊 File Analysis</h1>
          <div className="panel-box">
            <label>Select File:</label>
            <select value={selectedFileId} onChange={(e) => handleFileSelect(e.target.value)}>
              <option value="">-- Choose a file --</option>
              {fileList.map((file) => (
                <option key={file._id} value={file._id}>
                  {file.originalname}
                </option>
              ))}
            </select>
          </div>

          <div className="panel-box">
            <label>Dimension:</label>
            <select
              value={dimension}
              onChange={(e) => {
                setDimension(e.target.value);
                setChartType("");
                setXAxis("");
                setYAxis("");
                setZAxis("");
              }}
            >
              <option value="1D">1D</option>
              <option value="2D">2D</option>
              <option value="3D">3D</option>
            </select>
          </div>

          {dimension === "1D" && (
            <>
              <div className="panel-box">
                <label>Chart Type:</label>
                <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                  <option value="">-- Select Type --</option>
                  <option value="pie">Pie</option>
                </select>
              </div>
              <div className="panel-box">
                <label>X-Axis:</label>
                <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
                  <option value="">-- Select Column --</option>
                  {columns.map((col, idx) => (
                    <option key={idx} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {dimension === "2D" && (
            <>
              <div className="panel-box">
                <label>Chart Type:</label>
                <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                  <option value="">-- Select Type --</option>
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                </select>
              </div>
              <div className="panel-box">
                <label>X-Axis:</label>
                <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
                  <option value="">-- Select Column --</option>
                  {columns.map((col, idx) => (
                    <option key={idx} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
              <div className="panel-box">
                <label>Y-Axis:</label>
                <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
                  <option value="">-- Select Column --</option>
                  {columns.map((col, idx) => (
                    <option key={idx} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {dimension === "3D" && (
            <>
              <div className="panel-box">
                <label>X-Axis:</label>
                <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
                  <option value="">-- Select Column --</option>
                  {columns.map((col, idx) => (
                    <option key={idx} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
              <div className="panel-box">
                <label>Y-Axis:</label>
                <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
                  <option value="">-- Select Column --</option>
                  {columns.map((col, idx) => (
                    <option key={idx} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
              <div className="panel-box">
                <label>Z-Axis:</label>
                <select value={zAxis} onChange={(e) => setZAxis(e.target.value)}>
                  <option value="">-- Select Column --</option>
                  {columns.map((col, idx) => (
                    <option key={idx} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button className="generate-btn" onClick={() => setChartReady(true)}>
            📈 Generate Chart
          </button>
          <button className="download-btn" onClick={handleDownload}>
            ⬇️ Download Chart
          </button>
          <button className="save-history-btn" onClick={handleSaveToHistory}>
            💾 Save to History
          </button>
        </div>

        <div className="chart-preview" onClick={() => chartReady && setShowChart(true)}>
          <div ref={chartRef} style={{ width: "100%", height: "500px" }}>
            {chartReady && renderChart()}
          </div>
        </div>
      </div>

      {showChart && (
        <div className="modal-overlay">
          <div className="modal-chart">
            <div className="chart-box" ref={chartRef}>{renderChart(true)}</div>
            <div className="modal-actions">
              <button className="download-btn" onClick={handleDownload}>
                ⬇️ Download
              </button>
              <button className="close-btn" onClick={() => setShowChart(false)}>
                ❌ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartPage;
