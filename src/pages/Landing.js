import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../App";
import "./Landing.css";

function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const navigate = useNavigate();
  const { login, signup, userRole } = useContext(CartContext);

  useEffect(() => {
    setIsVisible(true);
    if (userRole === "customer") navigate("/home");
    if (userRole === "admin") navigate("/admin");
  }, [userRole, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Signup failed. Try a different email.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
    setError("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="landing">
      <div className={`landing-content ${isVisible ? "visible" : ""}`}>
        <header className="landing-header">
          <h1>Welcome to Sweetville Bakery</h1>
          <p>
            {isSignupMode
              ? "Sign up to start your sweet journey."
              : "Indulge in perfection—log in to begin."}
          </p>
        </header>
        <form className="login-form" onSubmit={isSignupMode ? handleSignup : handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <button type="submit" className="login-btn">
            {isSignupMode ? "Sign Up" : "Log In"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p className="toggle-mode">
          {isSignupMode ? "Already have an account?" : "New here?"}{" "}
          <button type="button" onClick={toggleMode} className="toggle-btn">
            {isSignupMode ? "Log In" : "Sign Up"}
          </button>
        </p>
        <footer className="landing-footer"></footer>
      </div>
    </div>
  );
}

export default Landing;