import { Link } from "react-router-dom";

import DashboardSidebar from "../../components/Dashboard/DashboardSidebar";
import DashboardStats from "../../components/Dashboard/DashboardStats";

import { useAuth } from "../../context/AuthContext";
import { useSavedProperties } from "../../context/SavedPropertiesContext";
import { useRecentlyViewed } from "../../context/RecentlyViewedContext";
import { useRequests } from "../../context/RequestsContext";

import "./UserDashboard.css";

function UserDashboard() {
  // ==============================
  // AUTHENTICATED USER
  // ==============================
  const { user } = useAuth();

  // ==============================
  // DASHBOARD DATA
  // ==============================
  const { savedProperties } = useSavedProperties();
  const { recentlyViewed } = useRecentlyViewed();
  const { requests } = useRequests();

  const recentRequests = requests.slice(0, 2);

  // ==============================
  // USER DISPLAY NAME
  // ==============================
  const displayName =
    user?.name ||
    user?.username ||
    "User";

  // ==============================
  // SAFELY FORMAT PROPERTY AREA
  // ==============================
  const formatArea = (area) => {
    if (
      area === undefined ||
      area === null ||
      area === ""
    ) {
      return "N/A";
    }

    const numericArea = Number(area);

    if (Number.isNaN(numericArea)) {
      return area;
    }

    return numericArea.toLocaleString();
  };

  // ==============================
  // SAFELY GET PROPERTY ID
  // ==============================
  const getPropertyId = (property) => {
    return property.id || property._id;
  };

  return (
    <div className="user-dashboard">
      <DashboardSidebar />

      <main className="dashboard-main">

        {/* ============================== */}
        {/* HEADER */}
        {/* ============================== */}

        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">
              YOUR DASHBOARD
            </p>

            <h1>
              Good evening, {displayName}.
            </h1>

            <p className="dashboard-header-description">
              Here's what's happening with your StayNest
              activity.
            </p>
          </div>

          <Link
            to="/properties"
            className="dashboard-browse-button"
          >
            Browse Properties

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </Link>
        </header>

        {/* ============================== */}
        {/* STATS */}
        {/* ============================== */}

        <DashboardStats />

        {/* ============================== */}
        {/* SAVED PROPERTIES */}
        {/* ============================== */}

        <section className="dashboard-section">

          <div className="dashboard-section-header">
            <div>
              <span className="dashboard-section-eyebrow">
                YOUR COLLECTION
              </span>

              <h2>Saved Properties</h2>
            </div>

            <Link
              to="/dashboard/saved"
              className="dashboard-view-all"
            >
              View All
              <span>→</span>
            </Link>
          </div>

          {savedProperties.length > 0 ? (
            <div className="dashboard-property-grid">

              {savedProperties
                .slice(0, 2)
                .map((property) => {

                  const propertyId =
                    getPropertyId(property);

                  return (
                    <article
                      className="dashboard-property-card"
                      key={propertyId}
                    >

                      <Link
                        to={`/properties/${propertyId}`}
                      >
                        <img
                          src={property.image}
                          alt={
                            property.title ||
                            "Property"
                          }
                          className="dashboard-property-image"
                        />
                      </Link>

                      <div className="dashboard-property-content">

                        <div className="dashboard-property-top">

                          <span className="dashboard-property-type">
                            {property.propertyType ||
                              "Property"}
                          </span>

                          <span className="dashboard-property-price">
                            {property.priceLabel ||
                              "Price unavailable"}
                          </span>

                        </div>

                        <h3>
                          {property.title ||
                            "Untitled Property"}
                        </h3>

                        <div className="dashboard-property-location">

                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />

                            <circle
                              cx="12"
                              cy="10"
                              r="2.5"
                            />
                          </svg>

                          <span>
                            {property.location ||
                              "Location unavailable"}
                          </span>

                        </div>

                        <div className="dashboard-property-stats">

                          <span>
                            🛏️{" "}
                            {property.beds ?? "N/A"} Beds
                          </span>

                          <span>
                            🛁{" "}
                            {property.baths ?? "N/A"} Baths
                          </span>

                          <span>
                            📐{" "}
                            {formatArea(property.area)} sqft
                          </span>

                        </div>

                        <Link
                          to={`/properties/${propertyId}`}
                          className="dashboard-property-link"
                        >
                          View Details
                          <span>→</span>
                        </Link>

                      </div>

                    </article>
                  );
                })}

            </div>
          ) : (

            <div className="dashboard-empty-state">

              <div className="dashboard-empty-icon">
                ♡
              </div>

              <h3>
                No saved properties yet
              </h3>

              <p>
                Save properties you love and find them
                here anytime.
              </p>

              <Link
                to="/properties"
                className="dashboard-empty-button"
              >
                Explore Properties
              </Link>

            </div>
          )}

        </section>

        {/* ============================== */}
        {/* RECENTLY VIEWED */}
        {/* ============================== */}

        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <span className="dashboard-section-eyebrow">
                YOUR ACTIVITY
              </span>

              <h2>Recently Viewed</h2>
            </div>

            <Link
              to="/properties"
              className="dashboard-view-all"
            >
              Browse More
              <span>→</span>
            </Link>

          </div>

          {recentlyViewed.length > 0 ? (

            <div className="dashboard-property-grid">

              {recentlyViewed
                .slice(0, 3)
                .map((property) => {

                  const propertyId =
                    getPropertyId(property);

                  return (
                    <article
                      className="dashboard-property-card"
                      key={propertyId}
                    >

                      <Link
                        to={`/properties/${propertyId}`}
                      >
                        <img
                          src={property.image}
                          alt={
                            property.title ||
                            "Property"
                          }
                          className="dashboard-property-image"
                        />
                      </Link>

                      <div className="dashboard-property-content">

                        <div className="dashboard-property-top">

                          <span className="dashboard-property-type">
                            {property.propertyType ||
                              "Property"}
                          </span>

                          <span className="dashboard-property-price">
                            {property.priceLabel ||
                              "Price unavailable"}
                          </span>

                        </div>

                        <h3>
                          {property.title ||
                            "Untitled Property"}
                        </h3>

                        <div className="dashboard-property-location">

                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />

                            <circle
                              cx="12"
                              cy="10"
                              r="2.5"
                            />
                          </svg>

                          <span>
                            {property.location ||
                              "Location unavailable"}
                          </span>

                        </div>

                        <div className="dashboard-property-stats">

                          <span>
                            🛏️{" "}
                            {property.beds ?? "N/A"} Beds
                          </span>

                          <span>
                            🛁{" "}
                            {property.baths ?? "N/A"} Baths
                          </span>

                          <span>
                            📐{" "}
                            {formatArea(property.area)} sqft
                          </span>

                        </div>

                        <Link
                          to={`/properties/${propertyId}`}
                          className="dashboard-property-link"
                        >
                          View Details
                          <span>→</span>
                        </Link>

                      </div>

                    </article>
                  );
                })}

            </div>

          ) : (

            <div className="dashboard-empty-state">

              <div className="dashboard-empty-icon">
                ◉
              </div>

              <h3>
                No recently viewed properties
              </h3>

              <p>
                Properties you view will appear here.
              </p>

              <Link
                to="/properties"
                className="dashboard-empty-button"
              >
                Explore Properties
              </Link>

            </div>
          )}

        </section>

        {/* ============================== */}
        {/* RECENT REQUESTS */}
        {/* ============================== */}

        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <span className="dashboard-section-eyebrow">
                YOUR ACTIVITY
              </span>

              <h2>Recent Requests</h2>
            </div>

            <Link
              to="/dashboard/requests"
              className="dashboard-view-all"
            >
              View All
              <span>→</span>
            </Link>

          </div>

          {recentRequests.length > 0 ? (

            <div className="dashboard-request-list">

              {recentRequests.map((request) => (

                <div
                  className="dashboard-request-card"
                  key={request.id || request._id}
                >

                  <div className="dashboard-request-icon">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16v16H4z" />
                      <path d="M8 8h8" />
                      <path d="M8 12h8" />
                      <path d="M8 16h5" />
                    </svg>

                  </div>

                  <div className="dashboard-request-content">

                    <div>

                      <span className="dashboard-request-type">
                        {request.type ||
                          "Property Request"}
                      </span>

                      <h3>
                        {request.title ||
                          "Request"}
                      </h3>

                      <p>
                        {request.propertyTitle ||
                          "Property"}
                      </p>

                      {request.location && (
                        <span className="dashboard-request-location">
                          {request.location}
                        </span>
                      )}

                    </div>

                    <div className="dashboard-request-right">

                      <span
                        className={`dashboard-request-status ${
                          request.status
                            ?.toLowerCase()
                            .replace(" ", "-") || ""
                        }`}
                      >
                        {request.status ||
                          "Pending"}
                      </span>

                      <span className="dashboard-request-date">

                        {request.createdAt
                          ? new Date(
                              request.createdAt
                            ).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Recently"}

                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="dashboard-empty-state">

              <div className="dashboard-empty-icon">
                ✓
              </div>

              <h3>
                No requests yet
              </h3>

              <p>
                Contact an owner or schedule a property
                visit to create your first request.
              </p>

              <Link
                to="/properties"
                className="dashboard-empty-button"
              >
                Explore Properties
              </Link>

            </div>
          )}

        </section>

        {/* ============================== */}
        {/* FOOTER */}
        {/* ============================== */}

        <footer className="dashboard-footer">

          <span>
            Stay<span>Nest</span>
          </span>

          <p>
            © 2026 StayNest. All rights reserved.
          </p>

        </footer>

      </main>
    </div>
  );
}

export default UserDashboard;