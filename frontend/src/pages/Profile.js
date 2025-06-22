/*import React from 'react';

const Profile = () => {
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('email');

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Role:</strong> {role}</p>
    </div>
  );
};

export default Profile;
*/

/*
import React, { useEffect, useState, useRef } from "react";
import "../styles/Profile.css";

const Profile = ({ onClose }) => {
  const popupRef = useRef(null);
  const [profile, setProfile] = useState({ username: "", role: "" });

  useEffect(() => {
    // You can replace this with an API call
    const tokenData = JSON.parse(localStorage.getItem("userInfo")) || {
      username: "Guest",
      role: "user",
    };
    setProfile(tokenData);

    // Close popup on outside click
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="profile-popup" ref={popupRef}>
      <h4>👤 Profile</h4>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Role:</strong> {profile.role}</p>
    </div>
  );
};

export default Profile;
*/
/*
import React, { useEffect, useState, useRef } from "react";
import "../styles/Profile.css";

const Profile = ({ onClose }) => {
  const popupRef = useRef(null);
  const [profile, setProfile] = useState({ email: "", role: "" });

  useEffect(() => {
    // Fetch profile data from API
    const fetchProfile = async () => {
      try {
        const res = await fetch("/auth/profile", {
          method: "GET",
          credentials: "include", // ensures cookies are sent
        });
        if (res.ok) {
          const data = await res.json();
          setProfile({
            email: data.email || "unknown@example.com",
            role: data.role || "user",
          });
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();

    // Close popup on outside click
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="profile-popup" ref={popupRef}>
      <h4>👤 Profile</h4>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
    </div>
  );
};

export default Profile;
*/
import React, { useEffect, useState, useRef } from "react";
import "../styles/Profile.css";

const Profile = ({ onClose }) => {
  const popupRef = useRef(null);
  const [profile, setProfile] = useState({ email: "", role: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          credentials: "include", // send cookies
        });
        if (res.ok) {
          const data = await res.json();
          setProfile({
            email: data.email || "unknown@example.com",
            role: data.role || "user",
          });
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();

    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="profile-popup" ref={popupRef}>
      <h4>👤 Profile</h4>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
    </div>
  );
};

export default Profile;

