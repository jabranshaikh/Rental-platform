import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Full name validation
    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    // Username validation
    if (!formData.username.trim()) {
      setError("Please enter a username.");
      return;
    }

    if (formData.username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (formData.username.trim().length > 30) {
      setError("Username cannot be longer than 30 characters.");
      return;
    }

    // Username format validation
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (!usernameRegex.test(formData.username.trim())) {
      setError(
        "Username can only contain letters, numbers, and underscores."
      );
      return;
    }

    // Email validation
    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    // Password validation
    if (!formData.password) {
      setError("Please enter a password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: formData.name.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      });

      setSuccess(
        "Account created successfully! Taking you to properties..."
      );

      setTimeout(() => {
        navigate("/properties");
      }, 1200);
    } catch (err) {
      console.error("Registration Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* LEFT SIDE */}
      <div className="register-visual">
        <div className="visual-overlay"></div>

        <div className="visual-content">
          <Link to="/" className="brand">
            Stay<span>Nest</span>
          </Link>

          <div className="visual-text">
            <p className="visual-small-title">
              FIND YOUR PLACE
            </p>

            <h1>
              Your next
              <br />
              chapter starts
              <br />
              <span>here.</span>
            </h1>

            <p>
              Discover beautiful homes, apartments and spaces
              that feel like they were made for you.
            </p>
          </div>

          <div className="visual-stats">
            <div>
              <strong>10K+</strong>
              <span>Properties</span>
            </div>

            <div>
              <strong>5K+</strong>
              <span>Happy Users</span>
            </div>

            <div>
              <strong>50+</strong>
              <span>Cities</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="register-container">
        <div className="mobile-brand">
          <Link to="/" className="brand">
            Stay<span>Nest</span>
          </Link>
        </div>

        <div className="register-card">
          <div className="register-header">
            <p className="eyebrow">GET STARTED</p>

            <h2>Create your account</h2>

            <p>
              Join StayNest and start finding your perfect
              place.
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="message error-message">
              <span>!</span>
              {error}
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="message success-message">
              <span>✓</span>
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="register-form"
          >
            {/* NAME */}
            <div className="form-group">
              <label htmlFor="name">
                Full Name
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  👤
                </span>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
            </div>

            {/* USERNAME */}
            <div className="form-group">
              <label htmlFor="username">
                Username
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  @
                </span>

                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>

              <span className="username-hint">
                3–30 characters. Letters, numbers, and underscores only.
              </span>
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <span className="password-hint">
                Minimum 6 characters
              </span>
            </div>

            {/* ROLE */}
            <div className="form-group">
              <label>Account Type</label>

              <div className="role-options">
                {/* RENTER */}
                <label
                  className={`role-card ${
                    formData.role === "user"
                      ? "selected"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={
                      formData.role === "user"
                    }
                    onChange={handleChange}
                  />

                  <div className="role-content">
                    <span className="role-icon">
                      🏠
                    </span>

                    <div>
                      <strong>Renter</strong>

                      <small>
                        Find and rent properties
                      </small>
                    </div>
                  </div>
                </label>

                {/* OWNER */}
                <label
                  className={`role-card ${
                    formData.role === "owner"
                      ? "selected"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="owner"
                    checked={
                      formData.role === "owner"
                    }
                    onChange={handleChange}
                  />

                  <div className="role-content">
                    <span className="role-icon">
                      🏢
                    </span>

                    <div>
                      <strong>Owner</strong>

                      <small>
                        List and manage properties
                      </small>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-link">
            Already have an account?

            <Link to="/login">
              Sign in
            </Link>
          </div>

          <p className="terms">
            By creating an account, you agree to our

            <a href="#terms">
              {" "}
              Terms of Service
            </a>{" "}

            and

            <a href="#privacy">
              {" "}
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;