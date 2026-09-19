import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import SavedPropertiesProvider from "./context/SavedPropertiesContext";
import RecentlyViewedProvider from "./context/RecentlyViewedContext";
import RequestsProvider from "./context/RequestsContext";
import PropertiesProvider from "./context/PropertiesContext";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import Properties from "./pages/Properties/Properties";
import PropertyDetails from "./pages/PropertyDetails/PropertyDetails";

import UserDashboard from "./pages/UserDashboard/UserDashboard";
import SavedProperties from "./pages/SavedProperties/SavedProperties";
import MyRequests from "./pages/MyRequests/MyRequests";

import OwnerDashboard from "./pages/OwnerDashboard/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";

// ======================================================
// ROLE PROTECTED ROUTE
// ======================================================

function RoleProtectedRoute({
  allowedRoles,
  children,
}) {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  // Wait until AuthContext checks the saved token
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f7f4",
          fontFamily: "Inter, Arial, sans-serif",
          color: "#172033",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        Loading StayNest...
      </div>
    );
  }

  // User is not logged in
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // User does not have permission for this page
  if (!allowedRoles.includes(user.role)) {
    // Admin
    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    // Owner
    if (user.role === "owner") {
      return (
        <Navigate
          to="/owner/dashboard"
          replace
        />
      );
    }

    // Normal user
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

// ======================================================
// HOME PAGE
// ======================================================

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f7f4",
        fontFamily: "Inter, Arial, sans-serif",
        color: "#172033",
      }}
    >
      {/* ==================================================
          NAVBAR
      ================================================== */}

      <header
        style={{
          minHeight: "76px",
          background: "#ffffff",
          borderBottom: "1px solid #e8e8e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 6%",
          boxSizing: "border-box",
          gap: "20px",
        }}
      >
        {/* LOGO */}

        <Link
          to="/"
          style={{
            textDecoration: "none",
            fontSize: "26px",
            fontWeight: "800",
            letterSpacing: "-1px",
            color: "#172033",
            flexShrink: 0,
          }}
        >
          Stay
          <span
            style={{
              color: "#f59e0b",
            }}
          >
            Nest
          </span>
        </Link>

        {/* NAVIGATION */}

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <Link
            to="/properties"
            style={{
              textDecoration: "none",
              color: "#475467",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Properties
          </Link>

          <Link
            to="/about"
            style={{
              textDecoration: "none",
              color: "#475467",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            About
          </Link>

          <Link
            to="/contact"
            style={{
              textDecoration: "none",
              color: "#475467",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Contact
          </Link>

          <Link
            to="/dashboard"
            style={{
              textDecoration: "none",
              color: "#475467",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Dashboard
          </Link>

          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "#172033",
              fontSize: "14px",
              fontWeight: "700",
              padding: "10px 18px",
              border: "1px solid #d0d5dd",
              borderRadius: "8px",
            }}
          >
            Sign In
          </Link>

          <Link
            to="/register"
            style={{
              textDecoration: "none",
              background: "#172033",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "700",
              padding: "11px 19px",
              borderRadius: "8px",
            }}
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* ==================================================
          HERO
      ================================================== */}

      <main
        style={{
          minHeight: "calc(100vh - 76px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "70px 6%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
            gap: "70px",
            alignItems: "center",
          }}
        >
          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <section>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#fff7e6",
                color: "#b76e00",
                padding: "8px 13px",
                borderRadius: "30px",
                fontSize: "12px",
                fontWeight: "800",
                letterSpacing: "0.5px",
                marginBottom: "22px",
              }}
            >
              <span>●</span>
              FIND YOUR NEXT HOME
            </div>

            <h1
              style={{
                fontSize: "clamp(44px, 5vw, 70px)",
                lineHeight: "1.04",
                letterSpacing: "-2.5px",
                margin: "0 0 22px",
                fontWeight: "800",
              }}
            >
              Welcome to
              <br />

              <span
                style={{
                  color: "#f59e0b",
                }}
              >
                StayNest.
              </span>
            </h1>

            <p
              style={{
                fontSize: "22px",
                lineHeight: "1.5",
                color: "#475467",
                maxWidth: "590px",
                margin: "0 0 20px",
              }}
            >
              Find a place you'll love to
              come home to.
            </p>

            <p
              style={{
                fontSize: "15px",
                lineHeight: "1.7",
                color: "#667085",
                maxWidth: "560px",
                margin: "0 0 32px",
              }}
            >
              Discover comfortable homes,
              apartments and properties in
              locations you'll love. Browse
              properties, connect with owners
              and find your next home with
              StayNest.
            </p>

            {/* ==================================================
                MAIN ACTIONS
            ================================================== */}

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/properties"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "14px 24px",
                  background: "#172033",
                  color: "#ffffff",
                  borderRadius: "9px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                Browse Properties

                <span>→</span>
              </Link>

              <Link
                to="/dashboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "14px 24px",
                  background: "#ffffff",
                  color: "#172033",
                  border: "1px solid #d0d5dd",
                  borderRadius: "9px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                Open Dashboard
              </Link>
            </div>

            {/* ==================================================
                STATS
            ================================================== */}

            <div
              style={{
                display: "flex",
                gap: "45px",
                marginTop: "50px",
                paddingTop: "28px",
                borderTop: "1px solid #e4e7ec",
                flexWrap: "wrap",
              }}
            >
              <div>
                <strong
                  style={{
                    display: "block",
                    fontSize: "24px",
                    fontWeight: "800",
                  }}
                >
                  10K+
                </strong>

                <span
                  style={{
                    fontSize: "13px",
                    color: "#667085",
                  }}
                >
                  Properties
                </span>
              </div>

              <div>
                <strong
                  style={{
                    display: "block",
                    fontSize: "24px",
                    fontWeight: "800",
                  }}
                >
                  5K+
                </strong>

                <span
                  style={{
                    fontSize: "13px",
                    color: "#667085",
                  }}
                >
                  Happy Users
                </span>
              </div>

              <div>
                <strong
                  style={{
                    display: "block",
                    fontSize: "24px",
                    fontWeight: "800",
                  }}
                >
                  50+
                </strong>

                <span
                  style={{
                    fontSize: "13px",
                    color: "#667085",
                  }}
                >
                  Cities
                </span>
              </div>
            </div>
          </section>

          {/* ==================================================
              SIGN UP CARD
          ================================================== */}

          <section
            style={{
              background: "#ffffff",
              border: "1px solid #e4e7ec",
              borderRadius: "20px",
              padding: "36px",
              boxShadow:
                "0 20px 60px rgba(23, 32, 51, 0.08)",
              width: "100%",
              maxWidth: "420px",
              boxSizing: "border-box",
              justifySelf: "center",
            }}
          >
            {/* CARD HEADER */}

            <div
              style={{
                textAlign: "center",
                marginBottom: "26px",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "#fff7e6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: "23px",
                }}
              >
                🏠
              </div>

              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: "25px",
                  fontWeight: "800",
                }}
              >
                Start your journey
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#667085",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                Create your StayNest account
                and find your perfect place.
              </p>
            </div>

            {/* GOOGLE */}

            <Link
              to="/register"
              style={{
                width: "100%",
                height: "48px",
                boxSizing: "border-box",
                background: "#ffffff",
                border: "1px solid #d0d5dd",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "700",
                color: "#344054",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "19px",
                  fontWeight: "800",
                }}
              >
                G
              </span>

              Continue with Google
            </Link>

            {/* FACEBOOK */}

            <Link
              to="/register"
              style={{
                width: "100%",
                height: "48px",
                boxSizing: "border-box",
                background: "#ffffff",
                border: "1px solid #d0d5dd",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "700",
                color: "#344054",
                marginBottom: "20px",
              }}
            >
              <span
                style={{
                  fontSize: "21px",
                  fontWeight: "800",
                }}
              >
                f
              </span>

              Continue with Facebook
            </Link>

            {/* DIVIDER */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "8px 0 20px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "#eaecf0",
                }}
              />

              <span
                style={{
                  fontSize: "12px",
                  color: "#98a2b3",
                  fontWeight: "600",
                }}
              >
                OR
              </span>

              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "#eaecf0",
                }}
              />
            </div>

            {/* EMAIL */}

            <Link
              to="/register"
              style={{
                width: "100%",
                height: "48px",
                boxSizing: "border-box",
                background: "#172033",
                color: "#ffffff",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "700",
                marginBottom: "20px",
              }}
            >
              Continue with Email
            </Link>

            {/* LOGIN LINK */}

            <p
              style={{
                margin: 0,
                textAlign: "center",
                fontSize: "13px",
                color: "#667085",
              }}
            >
              Already have an account?{" "}

              <Link
                to="/login"
                style={{
                  color: "#172033",
                  fontWeight: "800",
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
            </p>
          </section>
        </div>
      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer
        style={{
          background: "#ffffff",
          borderTop: "1px solid #e4e7ec",
          padding: "22px 6%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "#667085",
          }}
        >
          © 2026 StayNest. All rights reserved.
        </span>

        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <Link
            to="/about"
            style={{
              fontSize: "13px",
              color: "#172033",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            About
          </Link>

          <Link
            to="/contact"
            style={{
              fontSize: "13px",
              color: "#172033",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Contact
          </Link>

          <Link
            to="/properties"
            style={{
              fontSize: "13px",
              color: "#172033",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Explore Properties →
          </Link>
        </div>
      </footer>
    </div>
  );
}

// ======================================================
// APP
// ======================================================

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PropertiesProvider>
          <SavedPropertiesProvider>
            <RecentlyViewedProvider>
              <RequestsProvider>
                <Routes>

                  {/* ==================================================
                      HOME
                  ================================================== */}

                  <Route
                    path="/"
                    element={<Home />}
                  />

                  {/* ==================================================
                      PUBLIC PROPERTY PAGES
                  ================================================== */}

                  <Route
                    path="/properties"
                    element={<Properties />}
                  />

                  <Route
                    path="/properties/:id"
                    element={<PropertyDetails />}
                  />

                  {/* ==================================================
                      ABOUT
                  ================================================== */}

                  <Route
                    path="/about"
                    element={<About />}
                  />

                  {/* ==================================================
                      CONTACT
                  ================================================== */}

                  <Route
                    path="/contact"
                    element={<Contact />}
                  />

                  {/* ==================================================
                      USER DASHBOARD
                  ================================================== */}

                  <Route
                    path="/dashboard"
                    element={
                      <RoleProtectedRoute
                        allowedRoles={["user"]}
                      >
                        <UserDashboard />
                      </RoleProtectedRoute>
                    }
                  />

                  {/* ==================================================
                      SAVED PROPERTIES
                  ================================================== */}

                  <Route
                    path="/dashboard/saved"
                    element={
                      <RoleProtectedRoute
                        allowedRoles={["user"]}
                      >
                        <SavedProperties />
                      </RoleProtectedRoute>
                    }
                  />

                  {/* ==================================================
                      USER REQUESTS
                  ================================================== */}

                  <Route
                    path="/dashboard/requests"
                    element={
                      <RoleProtectedRoute
                        allowedRoles={["user"]}
                      >
                        <MyRequests />
                      </RoleProtectedRoute>
                    }
                  />

                  {/* ==================================================
                      OWNER DASHBOARD
                  ================================================== */}

                  <Route
                    path="/owner/dashboard"
                    element={
                      <RoleProtectedRoute
                        allowedRoles={["owner"]}
                      >
                        <OwnerDashboard />
                      </RoleProtectedRoute>
                    }
                  />

                  {/* ==================================================
                      ADMIN DASHBOARD
                  ================================================== */}

                  <Route
                    path="/admin/dashboard"
                    element={
                      <RoleProtectedRoute
                        allowedRoles={["admin"]}
                      >
                        <AdminDashboard />
                      </RoleProtectedRoute>
                    }
                  />

                  {/* ==================================================
                      AUTHENTICATION
                  ================================================== */}

                  <Route
                    path="/login"
                    element={<Login />}
                  />

                  <Route
                    path="/register"
                    element={<Register />}
                  />

                  {/* ==================================================
                      FALLBACK
                  ================================================== */}

                  <Route
                    path="*"
                    element={<Home />}
                  />

                </Routes>
              </RequestsProvider>
            </RecentlyViewedProvider>
          </SavedPropertiesProvider>
        </PropertiesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;