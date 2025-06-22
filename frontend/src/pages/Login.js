import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("auth", "true");
      localStorage.setItem("role", res.data.user?.role || "user");
      
      // Success animation before navigation
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
      </div>

      {/* Left Image Section */}
      <motion.div 
        className="auth-image-section"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img src="/img.png" alt="Welcome" />
        <div className="welcome-text">
          <h2>Welcome Back!</h2>
          <p>Sign in to continue your data analysis journey</p>
        </div>
      </motion.div>

      {/* Right Form Section */}
      <motion.div
        className="auth-form-wrapper"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <form className="auth-form" onSubmit={handleLogin}>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Login
          </motion.h2>

          <motion.div 
            className="input-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="input-icon">📧</span>
          </motion.div>

          <motion.div 
            className="input-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="input-icon">🔒</span>
          </motion.div>

          <motion.button 
            type="submit" 
            disabled={isLoading}
            className={`auth-btn ${isLoading ? 'loading' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              "Login"
            )}
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Don't have an account? <a href="/register">Register</a>
          </motion.p>
        </form>
      </motion.div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
        }

        .animated-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 80px;
          height: 80px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 120px;
          height: 120px;
          top: 60%;
          left: 80%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 60px;
          height: 60px;
          top: 80%;
          left: 20%;
          animation-delay: 4s;
        }

        .shape-4 {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 70%;
          animation-delay: 1s;
        }

        .shape-5 {
          width: 90px;
          height: 90px;
          top: 40%;
          left: 5%;
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .auth-image-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }

        .auth-image-section img {
          max-width: 400px;
          width: 100%;
          height: auto;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .welcome-text {
          text-align: center;
          color: white;
          margin-top: 2rem;
        }

        .welcome-text h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .welcome-text p {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .auth-form-wrapper {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }

        .auth-form {
          background: rgba(255, 255, 255, 0.95);
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          width: 100%;
          max-width: 400px;
        }

        .auth-form h2 {
          text-align: center;
          margin-bottom: 2rem;
          color: #333;
          font-size: 2rem;
          font-weight: 600;
        }

        .input-group {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .input-group input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .input-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
        }

        .auth-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .auth-btn:hover {
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .auth-btn.loading {
          cursor: not-allowed;
          opacity: 0.8;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .auth-form p {
          text-align: center;
          color: #666;
        }

        .auth-form a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .auth-form a:hover {
          color: #764ba2;
        }

        @media (max-width: 768px) {
          .auth-container {
            flex-direction: column;
          }
          
          .auth-image-section {
            flex: none;
            padding: 1rem;
          }
          
          .welcome-text h2 {
            font-size: 2rem;
          }
          
          .auth-form {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;