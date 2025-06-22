import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import Profile from "../pages/Profile";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isVertical, setIsVertical] = useState(true);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const profileBtnRef = useRef(null);

  const handleLogout = async () => {
    setIsAnimating(true);
    try {
      await fetch("/auth/logout", { method: "POST", credentials: "include" });
      localStorage.removeItem("token");
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (err) {
      console.error("Logout failed", err);
      setIsAnimating(false);
    }
  };

  // Disable scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Close profile popup on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileBtnRef.current &&
        !profileBtnRef.current.contains(e.target)
      ) {
        setShowProfilePopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { path: "/dashboard", label: "Home", icon: "🏠" },
    { path: "/upload", label: "Upload", icon: "📤" },
    { path: "/history", label: "History", icon: "📊" },
  ];

  return (
    <>
      {/* Animated Background for Navbar */}
      <div className="navbar-background">
        <div className="nav-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
        </div>
      </div>

      {/* Overlay blur background */}
      {isOpen && isVertical && (
        <div
          className="overlay-blur"
          onClick={() => setIsOpen(false)}
        >
          <div className="blur-effect"></div>
        </div>
      )}

      {/* Toggle button with animation */}
      <div 
        className={`navbar-toggle-btn ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="hamburger-lines">
          <span className="line line1"></span>
          <span className="line line2"></span>
          <span className="line line3"></span>
        </div>
      </div>

      <nav
        className={`navbar ${isOpen ? "open" : ""} ${
          isVertical ? "vertical" : "horizontal"
        } ${isAnimating ? "animating" : ""}`}
      >
        {/* Navbar Background Effects */}
        <div className="navbar-bg-effects">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="mesh-gradient"></div>
        </div>

        <div className="navbar-content">
          <div className="navbar-top">
            <div className="navbar-logo">
              <span className="logo-icon">📊</span>
              <span className="logo-text">Excel Analytics</span>
              <div className="logo-pulse"></div>
            </div>

            {/* Layout toggle with improved design */}
            <div className="navbar-layout-toggle">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isVertical}
                  onChange={() => setIsVertical(!isVertical)}
                />
                <span className="toggle-slider">
                  <span className="toggle-icon">{isVertical ? "📱" : "💻"}</span>
                </span>
              </label>
              <span className="toggle-label">
                {isVertical ? "Vertical" : "Horizontal"}
              </span>
            </div>
          </div>

          <div className="navbar-links">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
                <div className="nav-ripple"></div>
              </Link>
            ))}

            {/* Profile button with enhanced popup */}
            <span
              ref={profileBtnRef}
              onClick={() => setShowProfilePopup(!showProfilePopup)}
              className={`nav-link profile-btn ${
                showProfilePopup ? "active" : ""
              }`}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">Profile</span>
              <div className="nav-ripple"></div>
            </span>

            {/* Enhanced logout button */}
            <button 
              onClick={handleLogout} 
              className={`logout-btn ${isAnimating ? 'loading' : ''}`}
              disabled={isAnimating}
            >
              <span className="nav-icon">
                {isAnimating ? (
                  <div className="logout-spinner"></div>
                ) : (
                  "🚪"
                )}
              </span>
              <span className="nav-text">
                {isAnimating ? "Logging out..." : "Logout"}
              </span>
              <div className="nav-ripple"></div>
            </button>
          </div>

          {/* Navbar footer with status indicator */}
          <div className="navbar-footer">
            <div className="status-indicator">
              <div className="status-dot online"></div>
              <span className="status-text">Online</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Profile Popup */}
      {showProfilePopup && (
        <div className="profile-popup-wrapper">
          <div className="profile-popup-backdrop"></div>
          <Profile onClose={() => setShowProfilePopup(false)} />
        </div>
      )}
    </>
  );
}

export default Navbar;