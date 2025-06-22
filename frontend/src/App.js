/*
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import History from "./pages/History";
// import uploadpage from "./pages/UploadPage";
// import AnalyzePage from "./pages/AnalyzeFile"; // not used in routes currently
import ShowData from "./components/ShowData";
// import ShowDataPage from "./pages/ShowDataPage";
// import ChartPage from "./pages/ChartPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChartPage from "./pages/ChartPage"; // adjust path if needed
import "./App.css";
import UploadPage from "./pages/UploadPage";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

const AppLayout = () => {
  const location = useLocation();

  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className={!hideNavbar ? "sidebar-open" : ""}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/charts/:fileId"
            // path="/charts/:fileId"
            element={
              <ProtectedRoute>
                <ChartPage />
              </ProtectedRoute>
            }
          />
          <Route path="/showdata/:fileId" element={<ShowData />} />
           <Route path="/showdata" element={<ShowData />} />
        <Route path="/chartpage" element={<ChartPage />} />
        </Routes>
      </div>
      {!hideNavbar && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    
    </Router>
  );
}

export default App;
*/

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import History from "./pages/History";
import UploadPage from "./pages/UploadPage";
import ChartPage from "./pages/ChartPage";
import ShowData from "./components/ShowData";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

// Axios config
axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

const AppLayout = () => {
  const location = useLocation();

  // Hide navbar & footer on auth pages
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className={!hideNavbar ? "sidebar-open" : ""}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/charts/:fileId"
            element={
              <ProtectedRoute>
                <ChartPage />
              </ProtectedRoute>
            }
          />
          <Route path="/showdata/:fileId" element={<ShowData />} />
          <Route path="/showdata" element={<ShowData />} />
          <Route
            path="/chartpage"
            element={
              <ProtectedRoute>
                <ChartPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {!hideNavbar && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
