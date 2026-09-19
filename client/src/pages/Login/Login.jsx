import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // HANDLE INPUT CHANGE
  // ==============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // ==============================
  // HANDLE LOGIN
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login(formData);

      // OWNER
      if (response?.user?.role === "owner") {
        navigate("/owner/dashboard");
        return;
      }

      // ADMIN
      if (response?.user?.role === "admin") {
        navigate("/admin/dashboard");
        return;
      }

      // NORMAL USER
      navigate("/properties");
    } catch (err) {
      console.error("Login Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ==============================
          LEFT SIDE
      ============================== */}

      <div className="login-visual">
        <div className="visual-overlay"></div>

        <div className="visual-content">

          <Link to="/" className="brand">
            Stay<span>Nest</span>
          </Link>

          <div className="visual-text">

            <p className="visual-small-title">
              WELCOME HOME
            </p>

            <h1>
              Find a place
              <br />
              you'll love to
              <br />
              <span>come home to.</span>
            </h1>

            <p>
              Search thousands of rental
              properties and find a space
              that fits your lifestyle.
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

      {/* ==============================
          RIGHT SIDE
      ============================== */}

      <div className="login-container">

        <div className="mobile-brand">
          <Link to="/" className="brand">
            Stay<span>Nest</span>
          </Link>
        </div>

        <div className="login-card">

          {/* HEADER */}

          <div className="login-header">

            <p className="eyebrow">
              WELCOME BACK
            </p>

            <h2>
              Sign in to StayNest
            </h2>

            <p>
              Enter your details to access
              your account.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="message error-message">
              <span>!</span>
              {error}
            </div>
          )}

          {/* LOGIN FORM */}

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrapper">

                <span
                  className="input-icon email-icon"
                  aria-hidden="true"
                >
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

              <div className="label-row">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-button"
                  onClick={() =>
                    alert(
                      "Password reset functionality will be added soon."
                    )
                  }
                >
                  Forgot password?
                </button>

              </div>

              <div className="input-wrapper">

                <span
                  className="input-icon password-icon"
                  aria-hidden="true"
                >
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
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

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span className="button-arrow">
                    →
                  </span>
                </>
              )}

            </button>

          </form>

          {/* REGISTER */}

          <div className="register-link">
            Don't have an account?

            <Link to="/register">
              Create one
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;