import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const getDashboardPath = () => {
    if (user?.role === "admin") {
      return "/admin/dashboard";
    }

    if (user?.role === "owner") {
      return "/owner/dashboard";
    }

    return "/dashboard";
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-brand">
          Stay<span>Nest</span>
        </Link>

        {/* Navigation */}
        <nav className="navbar-links">

          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
            end
          >
            Home
          </NavLink>

          {/* Properties */}
          <NavLink
            to="/properties"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Properties
          </NavLink>

          {/* About */}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            About
          </NavLink>

          {/* Contact */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Contact
          </NavLink>

          {/* Dashboard */}
          {isAuthenticated && (
            <NavLink
              to={getDashboardPath()}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Dashboard
            </NavLink>
          )}

        </nav>

        {/* Right Side */}
        <div className="navbar-actions">

          {isAuthenticated ? (
            <>
              <span className="navbar-user">
                Hi{" "}
                {user?.name?.split(" ")[0] || "User"}
              </span>

              <button
                className="navbar-logout"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="navbar-login"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="navbar-register"
              >
                Get Started
              </Link>
            </>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;