import { useMemo, useState } from "react";

import { useProperties } from "../../context/PropertiesContext";
import { useRequests } from "../../context/RequestsContext";

import "./AdminDashboard.css";

function AdminDashboard() {
  /*
    ========================================
    FIXED ADMIN IDENTITY
    ========================================
    The Admin Dashboard should always display
    the StayNest admin account.

    It should NOT use the currently logged-in
    user's name because that could be an owner.
  */
  const ADMIN_NAME = "StayNest Admin";
  const ADMIN_EMAIL = "admin@staynest.com";

  const {
    properties,
    loading: propertiesLoading,
    error: propertiesError,
    deleteProperty,
  } = useProperties();

  const {
    requests,
    updateRequestStatus,
  } = useRequests();

  const [activeSection, setActiveSection] =
    useState("overview");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [propertyFilter, setPropertyFilter] =
    useState("All");

  const [requestFilter, setRequestFilter] =
    useState("All");

  const [selectedProperty, setSelectedProperty] =
    useState(null);

  const [showPropertyModal, setShowPropertyModal] =
    useState(false);

  const [showMobileSidebar, setShowMobileSidebar] =
    useState(false);

  // ========================================
  // PLATFORM STATISTICS
  // ========================================

  const totalProperties =
    properties.length;

  const totalRequests =
    requests.length;

  const pendingRequests =
    requests.filter(
      (request) =>
        request.status === "Pending"
    );

  const approvedRequests =
    requests.filter(
      (request) =>
        request.status === "Approved"
    );

  const rejectedRequests =
    requests.filter(
      (request) =>
        request.status === "Rejected"
    );

  // ========================================
  // DATABASE STATUS
  // ========================================

  const databaseStatus =
    propertiesLoading
      ? "Checking..."
      : propertiesError
      ? "Not Connected"
      : "Operational";

  const databaseConnected =
    !propertiesLoading &&
    !propertiesError;

  // ========================================
  // PLATFORM USERS
  // ========================================

  const platformUsers = useMemo(() => {
    const users = [];

    properties.forEach((property) => {
      const ownerEmail =
        property.ownerEmail ||
        property.ownerId?.email;

      const ownerName =
        property.ownerName ||
        property.ownerId?.name;

      if (
        ownerEmail &&
        !users.some(
          (existingUser) =>
            existingUser.email ===
            ownerEmail
        )
      ) {
        users.push({
          id:
            property.ownerId?._id ||
            property.ownerId ||
            ownerEmail,

          name:
            ownerName ||
            "Property Owner",

          email: ownerEmail,

          role: "Owner",
        });
      }
    });

    requests.forEach((request) => {
      const userEmail =
        request.userEmail ||
        request.userId?.email;

      const userName =
        request.userName ||
        request.userId?.name;

      if (
        userEmail &&
        !users.some(
          (existingUser) =>
            existingUser.email ===
            userEmail
        )
      ) {
        users.push({
          id:
            request.userId?._id ||
            request.userId ||
            userEmail,

          name:
            userName ||
            "User",

          email: userEmail,

          role: "User",
        });
      }
    });

    return users;
  }, [properties, requests]);

  // ========================================
  // FILTERED PROPERTIES
  // ========================================

  const filteredProperties =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      return properties.filter(
        (property) => {
          const ownerName =
            property.ownerName ||
            property.ownerId?.name ||
            "";

          const ownerEmail =
            property.ownerEmail ||
            property.ownerId?.email ||
            "";

          const matchesSearch =
            !search ||
            property.title
              ?.toLowerCase()
              .includes(search) ||
            property.location
              ?.toLowerCase()
              .includes(search) ||
            ownerName
              .toLowerCase()
              .includes(search) ||
            ownerEmail
              .toLowerCase()
              .includes(search);

          const matchesFilter =
            propertyFilter === "All" ||
            property.status ===
              propertyFilter;

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      properties,
      searchTerm,
      propertyFilter,
    ]);

  // ========================================
  // FILTERED REQUESTS
  // ========================================

  const filteredRequests =
    useMemo(() => {
      if (requestFilter === "All") {
        return requests;
      }

      return requests.filter(
        (request) =>
          request.status ===
          requestFilter
      );
    }, [
      requests,
      requestFilter,
    ]);

  // ========================================
  // DATE FORMATTER
  // ========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ========================================
  // GET PROPERTY ID
  // ========================================

  const getPropertyId = (property) => {
    return (
      property?._id ||
      property?.id
    );
  };

  // ========================================
  // GET REQUEST ID
  // ========================================

  const getRequestId = (request) => {
    return (
      request?._id ||
      request?.id
    );
  };

  // ========================================
  // DELETE PROPERTY
  // ========================================

  const handleDeleteProperty = async (
    property
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${property.title}"?`
      );

    if (!confirmed) {
      return;
    }

    const propertyId =
      getPropertyId(property);

    if (!propertyId) {
      window.alert(
        "Property ID could not be found."
      );

      return;
    }

    try {
      const token =
        localStorage.getItem(
          "staynest_token"
        );

      if (!token) {
        window.alert(
          "Admin session not found. Please login again."
        );

        return;
      }

      await deleteProperty(
        propertyId,
        token
      );

      setShowPropertyModal(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error(
        "Admin Delete Property Error:",
        error
      );

      window.alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete property."
      );
    }
  };

  // ========================================
  // REQUEST STATUS
  // ========================================

  const handleRequestStatus = async (
    request,
    status
  ) => {
    const requestId =
      getRequestId(request);

    if (!requestId) {
      window.alert(
        "Request ID could not be found."
      );

      return;
    }

    try {
      await updateRequestStatus(
        requestId,
        status
      );
    } catch (error) {
      console.error(
        "Request Status Error:",
        error
      );

      window.alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update request."
      );
    }
  };

  // ========================================
  // PROPERTY DETAILS
  // ========================================

  const openPropertyDetails = (
    property
  ) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const closePropertyDetails = () => {
    setShowPropertyModal(false);
    setSelectedProperty(null);
  };

  // ========================================
  // SIDEBAR NAVIGATION
  // ========================================

  const scrollToSection = (
    section
  ) => {
    setActiveSection(section);
    setShowMobileSidebar(false);

    const target =
      document.getElementById(
        section
      );

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // ========================================
  // REQUEST HELPERS
  // ========================================

  const getRequestType = (
    request
  ) => {
    return (
      request.requestType ||
      request.type ||
      "Property Request"
    );
  };

  const getPropertyTitle = (
    request
  ) => {
    return (
      request.propertyTitle ||
      request.title ||
      "Property"
    );
  };

  const getPropertyLocation = (
    request
  ) => {
    return (
      request.propertyLocation ||
      request.location ||
      "Location not available"
    );
  };

  return (
    <div className="admin-dashboard">

      {/* ========================================
          MOBILE OVERLAY
      ======================================== */}

      {showMobileSidebar && (
        <div
          className="admin-mobile-overlay"
          onClick={() =>
            setShowMobileSidebar(false)
          }
        />
      )}

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside
        className={`admin-sidebar ${
          showMobileSidebar
            ? "mobile-open"
            : ""
        }`}
      >
        <div className="admin-sidebar-brand">

          <div className="admin-brand-name">
            Stay<span>Nest</span>
          </div>

          <div className="admin-brand-label">
            ADMIN CONSOLE
          </div>

        </div>

        <nav className="admin-sidebar-nav">

          {/* OVERVIEW */}

          <button
            type="button"
            className={
              activeSection ===
              "overview"
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() =>
              scrollToSection(
                "overview"
              )
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1"
              />

              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1"
              />

              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1"
              />

              <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1"
              />
            </svg>

            <span>
              Overview
            </span>
          </button>

          {/* PROPERTIES */}

          <button
            type="button"
            className={
              activeSection ===
              "properties"
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() =>
              scrollToSection(
                "properties"
              )
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="m3 10 9-7 9 7" />

              <path d="M5 9v11h14V9" />

              <path d="M9 20v-6h6v6" />
            </svg>

            <span>
              Properties
            </span>
          </button>

          {/* REQUESTS */}

          <button
            type="button"
            className={
              activeSection ===
              "requests"
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() =>
              scrollToSection(
                "requests"
              )
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 4h16v16H4z" />

              <path d="M8 8h8" />

              <path d="M8 12h8" />

              <path d="M8 16h5" />
            </svg>

            <span>
              Requests
            </span>

            {pendingRequests.length >
              0 && (
              <span className="admin-nav-badge">
                {
                  pendingRequests.length
                }
              </span>
            )}
          </button>

          {/* USERS */}

          <button
            type="button"
            className={
              activeSection ===
              "users"
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() =>
              scrollToSection(
                "users"
              )
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle
                cx="9"
                cy="8"
                r="3"
              />

              <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />

              <path d="M16 5.5a3 3 0 0 1 0 5.8" />

              <path d="M18 14c1.8.7 3 2.5 3 4.5" />
            </svg>

            <span>
              Users
            </span>
          </button>

        </nav>

        {/* SIDEBAR ADMIN ACCOUNT */}

        <div className="admin-sidebar-bottom">

          <div className="admin-sidebar-user">

            <div className="admin-user-avatar">
              {ADMIN_NAME
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <strong>
                {ADMIN_NAME}
              </strong>

              <span>
                {ADMIN_EMAIL}
              </span>

            </div>

          </div>

          <div className="admin-sidebar-status">
            <span />
            System operational
          </div>

        </div>
      </aside>

      {/* ========================================
          MAIN
      ======================================== */}

      <main className="admin-main">

        {/* TOP BAR */}

        <header className="admin-topbar">

          <button
            type="button"
            className="admin-mobile-menu"
            onClick={() =>
              setShowMobileSidebar(
                true
              )
            }
          >
            <span />
            <span />
            <span />
          </button>

          <div className="admin-topbar-title">

            <span>
              STAYNEST ADMIN
            </span>

            <h1>
              Platform Overview
            </h1>

          </div>

          <div className="admin-topbar-right">

            <div className="admin-live-status">
              <span />
              Live
            </div>

            <div className="admin-topbar-avatar">
              {ADMIN_NAME
                .charAt(0)
                .toUpperCase()}
            </div>

          </div>

        </header>

        {/* ========================================
            OVERVIEW
        ======================================== */}

        <section
          className="admin-section admin-overview-section"
          id="overview"
        >

          <div className="admin-welcome">

            <div>

              <span className="admin-eyebrow">
                PLATFORM CONTROL
              </span>

              <h2>
                Good to see you,{" "}
                {ADMIN_NAME.split(
                  " "
                )[1] || "Admin"}.
              </h2>

              <p>
                Here's what's happening
                across StayNest right now.
              </p>

            </div>

            <div className="admin-date-card">

              <span>
                TODAY
              </span>

              <strong>
                {new Date().toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </strong>

            </div>

          </div>

          {/* STATS */}

          <div className="admin-stats-grid">

            {/* TOTAL PROPERTIES */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="m3 10 9-7 9 7" />
                  <path d="M5 9v11h14V9" />
                  <path d="M9 20v-6h6v6" />
                </svg>

              </div>

              <div>

                <span>
                  TOTAL PROPERTIES
                </span>

                <strong>
                  {totalProperties}
                </strong>

                <small>
                  Active platform listings
                </small>

              </div>

            </div>

            {/* USERS */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle
                    cx="9"
                    cy="8"
                    r="3"
                  />

                  <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />

                  <path d="M16 5.5a3 3 0 0 1 0 5.8" />

                  <path d="M18 14c1.8.7 3 2.5 3 4.5" />
                </svg>

              </div>

              <div>

                <span>
                  PLATFORM USERS
                </span>

                <strong>
                  {platformUsers.length}
                </strong>

                <small>
                  Users & property owners
                </small>

              </div>

            </div>

            {/* REQUESTS */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 4h16v16H4z" />

                  <path d="M8 8h8" />

                  <path d="M8 12h8" />

                  <path d="M8 16h5" />
                </svg>

              </div>

              <div>

                <span>
                  TOTAL REQUESTS
                </span>

                <strong>
                  {totalRequests}
                </strong>

                <small>
                  Property enquiries
                </small>

              </div>

            </div>

            {/* PENDING */}

            <div className="admin-stat-card admin-stat-card-highlight">

              <div className="admin-stat-icon">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />

                  <path d="M12 7v5l3 2" />
                </svg>

              </div>

              <div>

                <span>
                  PENDING
                </span>

                <strong>
                  {pendingRequests.length}
                </strong>

                <small>
                  Need attention
                </small>

              </div>

            </div>

          </div>

          {/* SUMMARY */}

          <div className="admin-summary-grid">

            {/* REQUEST STATUS */}

            <div className="admin-summary-card">

              <div className="admin-summary-header">

                <div>

                  <span>
                    REQUEST STATUS
                  </span>

                  <h3>
                    Request overview
                  </h3>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    scrollToSection(
                      "requests"
                    )
                  }
                >
                  View all
                </button>

              </div>

              <div className="admin-request-status-list">

                <div>

                  <span className="status-indicator pending" />

                  <span>
                    Pending
                  </span>

                  <strong>
                    {
                      pendingRequests.length
                    }
                  </strong>

                </div>

                <div>

                  <span className="status-indicator approved" />

                  <span>
                    Approved
                  </span>

                  <strong>
                    {
                      approvedRequests.length
                    }
                  </strong>

                </div>

                <div>

                  <span className="status-indicator rejected" />

                  <span>
                    Rejected
                  </span>

                  <strong>
                    {
                      rejectedRequests.length
                    }
                  </strong>

                </div>

              </div>

            </div>

            {/* PLATFORM HEALTH */}

            <div className="admin-summary-card">

              <div className="admin-summary-header">

                <div>

                  <span>
                    PLATFORM HEALTH
                  </span>

                  <h3>
                    System status
                  </h3>

                </div>

                <div className="admin-health-icon">
                  ✓
                </div>

              </div>

              <div className="admin-health-list">

                <div>

                  <span>
                    Frontend
                  </span>

                  <strong>
                    Operational
                  </strong>

                  <i className="health-dot" />

                </div>

                <div>

                  <span>
                    Authentication
                  </span>

                  <strong>
                    Operational
                  </strong>

                  <i className="health-dot" />

                </div>

                <div>

                  <span>
                    Local Storage
                  </span>

                  <strong>
                    Operational
                  </strong>

                  <i className="health-dot" />

                </div>

                <div>

                  <span>
                    Database
                  </span>

                  <strong
                    className={
                      databaseConnected
                        ? ""
                        : "not-connected"
                    }
                  >
                    {databaseStatus}
                  </strong>

                  <i
                    className={
                      databaseConnected
                        ? "health-dot"
                        : "health-dot warning"
                    }
                  />

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ========================================
            PROPERTIES
        ======================================== */}

        <section
          className="admin-section"
          id="properties"
        >

          <div className="admin-section-heading">

            <div>

              <span className="admin-eyebrow">
                LISTING MANAGEMENT
              </span>

              <h2>
                All Properties
              </h2>

              <p>
                Manage every property listed
                on the StayNest platform.
              </p>

            </div>

            <div className="admin-section-count">
              {
                filteredProperties.length
              }{" "}
              properties
            </div>

          </div>

          {/* TOOLBAR */}

          <div className="admin-toolbar">

            <div className="admin-search">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <path d="m20 20-4-4" />
              </svg>

              <input
                type="text"
                placeholder="Search properties, locations or owners..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

            </div>

            <select
              value={propertyFilter}
              onChange={(event) =>
                setPropertyFilter(
                  event.target.value
                )
              }
              className="admin-filter"
            >

              <option value="All">
                All Status
              </option>

              <option value="Available">
                Available
              </option>

              <option value="Reserved">
                Reserved
              </option>

              <option value="Rented">
                Rented
              </option>

              <option value="Sold">
                Sold
              </option>

            </select>

          </div>

          {/* PROPERTY TABLE */}

          {filteredProperties.length >
          0 ? (

            <div className="admin-properties-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      PROPERTY
                    </th>

                    <th>
                      OWNER
                    </th>

                    <th>
                      TYPE
                    </th>

                    <th>
                      PRICE
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      ACTION
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredProperties.map(
                    (property) => {

                      const ownerName =
                        property.ownerName ||
                        property.ownerId?.name ||
                        "Property Owner";

                      const ownerEmail =
                        property.ownerEmail ||
                        property.ownerId?.email ||
                        "Owner information unavailable";

                      return (
                        <tr
                          key={getPropertyId(
                            property
                          )}
                        >

                          {/* PROPERTY */}

                          <td>

                            <div className="admin-property-cell">

                              <img
                                src={
                                  property.image ||
                                  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80"
                                }
                                alt={
                                  property.title
                                }
                              />

                              <div>

                                <strong>
                                  {
                                    property.title
                                  }
                                </strong>

                                <span>
                                  {
                                    property.location
                                  }
                                </span>

                              </div>

                            </div>

                          </td>

                          {/* OWNER */}

                          <td>

                            <div className="admin-owner-cell">

                              <div className="admin-small-avatar">

                                {ownerName
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>

                              <div>

                                <strong>
                                  {ownerName}
                                </strong>

                                <span>
                                  {ownerEmail}
                                </span>

                              </div>

                            </div>

                          </td>

                          {/* TYPE */}

                          <td>

                            <div className="admin-type-cell">

                              <strong>
                                {
                                  property.propertyType
                                }
                              </strong>

                              <span>
                                For{" "}
                                {
                                  property.listingType
                                }
                              </span>

                            </div>

                          </td>

                          {/* PRICE */}

                          <td>

                            <strong className="admin-price">

                              {property.priceLabel ||
                                `PKR ${Number(
                                  property.price ||
                                    0
                                ).toLocaleString()}`}

                            </strong>

                            {property.listingType ===
                              "Rent" && (
                              <span className="admin-price-period">
                                / month
                              </span>
                            )}

                          </td>

                          {/* STATUS */}

                          <td>

                            <span
                              className={`admin-property-status ${
                                property.status ===
                                "Available"
                                  ? "available"
                                  : property.status ===
                                    "Reserved"
                                  ? "reserved"
                                  : property.status?.toLowerCase()
                              }`}
                            >

                              <span />

                              {
                                property.status
                              }

                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td>

                            <div className="admin-table-actions">

                              <button
                                type="button"
                                className="admin-view-button"
                                onClick={() =>
                                  openPropertyDetails(
                                    property
                                  )
                                }
                              >
                                View
                              </button>

                              <button
                                type="button"
                                className="admin-delete-button"
                                onClick={() =>
                                  handleDeleteProperty(
                                    property
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="admin-empty-state">

              <div>
                🔍
              </div>

              <h3>
                No properties found
              </h3>

              <p>
                Try changing your search or
                filter.
              </p>

            </div>

          )}

        </section>

        {/* ========================================
            REQUESTS
        ======================================== */}

        <section
          className="admin-section"
          id="requests"
        >

          <div className="admin-section-heading">

            <div>

              <span className="admin-eyebrow">
                PLATFORM ACTIVITY
              </span>

              <h2>
                All Requests
              </h2>

              <p>
                Monitor property enquiries
                across StayNest.
              </p>

            </div>

            <div className="admin-section-count">
              {
                filteredRequests.length
              }{" "}
              requests
            </div>

          </div>

          {/* REQUEST FILTERS */}

          <div className="admin-request-filters">

            {[
              "All",
              "Pending",
              "Approved",
              "Rejected",
            ].map((filter) => (

              <button
                type="button"
                key={filter}
                className={
                  requestFilter ===
                  filter
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setRequestFilter(
                    filter
                  )
                }
              >
                {filter}
              </button>

            ))}

          </div>

          {/* REQUEST LIST */}

          {filteredRequests.length >
          0 ? (

            <div className="admin-requests-list">

              {filteredRequests.map(
                (request) => (

                  <article
                    className="admin-request-card"
                    key={getRequestId(
                      request
                    )}
                  >

                    <div className="admin-request-icon">

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M4 4h16v16H4z" />

                        <path d="M8 8h8" />

                        <path d="M8 12h8" />

                        <path d="M8 16h5" />
                      </svg>

                    </div>

                    <div className="admin-request-main">

                      <div className="admin-request-heading">

                        <div>

                          <span>
                            {
                              getRequestType(
                                request
                              )
                            }
                          </span>

                          <h3>
                            {
                              getPropertyTitle(
                                request
                              )
                            }
                          </h3>

                          <p>
                            {
                              getPropertyLocation(
                                request
                              )
                            }
                          </p>

                        </div>

                        <span
                          className={`admin-request-status ${request.status?.toLowerCase()}`}
                        >

                          <span />

                          {
                            request.status
                          }

                        </span>

                      </div>

                      {/* REQUEST META */}

                      <div className="admin-request-meta">

                        <div>

                          <span>
                            USER
                          </span>

                          <strong>
                            {
                              request.userName ||
                              request.userId?.name ||
                              "User"
                            }
                          </strong>

                          <small>
                            {
                              request.userEmail ||
                              request.userId?.email ||
                              "No email"
                            }
                          </small>

                        </div>

                        <div>

                          <span>
                            SUBMITTED
                          </span>

                          <strong>
                            {formatDate(
                              request.createdAt
                            )}
                          </strong>

                        </div>

                        {request.preferredDate && (
                          <div>

                            <span>
                              VISIT DATE
                            </span>

                            <strong>
                              {formatDate(
                                request.preferredDate
                              )}
                            </strong>

                          </div>
                        )}

                      </div>

                      {/* MESSAGE */}

                      {request.message && (
                        <div className="admin-request-message">

                          <span>
                            MESSAGE
                          </span>

                          <p>
                            {
                              request.message
                            }
                          </p>

                        </div>
                      )}

                      {/* ACTIONS */}

                      {request.status ===
                        "Pending" && (

                        <div className="admin-request-actions">

                          <button
                            type="button"
                            className="admin-reject-button"
                            onClick={() =>
                              handleRequestStatus(
                                request,
                                "Rejected"
                              )
                            }
                          >
                            Reject
                          </button>

                          <button
                            type="button"
                            className="admin-approve-button"
                            onClick={() =>
                              handleRequestStatus(
                                request,
                                "Approved"
                              )
                            }
                          >
                            ✓ Approve
                          </button>

                        </div>

                      )}

                    </div>

                  </article>

                )
              )}

            </div>

          ) : (

            <div className="admin-empty-state">

              <div>
                ✓
              </div>

              <h3>
                No requests found
              </h3>

              <p>
                There are no requests matching
                the selected filter.
              </p>

            </div>

          )}

        </section>

        {/* ========================================
            USERS
        ======================================== */}

        <section
          className="admin-section admin-users-section"
          id="users"
        >

          <div className="admin-section-heading">

            <div>

              <span className="admin-eyebrow">
                ACCOUNT MANAGEMENT
              </span>

              <h2>
                Platform Users
              </h2>

              <p>
                Users currently visible from
                platform activity.
              </p>

            </div>

            <div className="admin-section-count">
              {platformUsers.length} users
            </div>

          </div>

          {platformUsers.length >
          0 ? (

            <div className="admin-users-grid">

              {platformUsers.map(
                (platformUser) => (

                  <div
                    className="admin-user-card"
                    key={
                      platformUser.id
                    }
                  >

                    <div className="admin-user-card-top">

                      <div className="admin-large-avatar">

                        {(
                          platformUser.name ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}

                      </div>

                      <span
                        className={`admin-role-badge ${platformUser.role.toLowerCase()}`}
                      >
                        {
                          platformUser.role
                        }
                      </span>

                    </div>

                    <h3>
                      {
                        platformUser.name
                      }
                    </h3>

                    <p>
                      {
                        platformUser.email
                      }
                    </p>

                    <div className="admin-user-card-footer">

                      <span>
                        Account activity
                      </span>

                      <strong>
                        Active
                      </strong>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="admin-empty-state">

              <div>
                👤
              </div>

              <h3>
                No users detected
              </h3>

              <p>
                Users will appear here as
                platform activity is created.
              </p>

            </div>

          )}

        </section>

        {/* ========================================
            FOOTER
        ======================================== */}

        <footer className="admin-footer">

          <div>

            <strong>
              Stay<span>Nest</span>
            </strong>

            <p>
              Platform administration
              console.
            </p>

          </div>

          <span>
            © 2026 StayNest
          </span>

        </footer>

      </main>

      {/* ========================================
          PROPERTY DETAILS MODAL
      ======================================== */}

      {showPropertyModal &&
        selectedProperty && (

          <div
            className="admin-modal-overlay"
            onClick={
              closePropertyDetails
            }
          >

            <div
              className="admin-property-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="admin-modal-header">

                <div>

                  <span>
                    PROPERTY DETAILS
                  </span>

                  <h2>
                    {
                      selectedProperty.title
                    }
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={
                    closePropertyDetails
                  }
                >
                  ×
                </button>

              </div>

              <img
                className="admin-modal-image"
                src={
                  selectedProperty.image ||
                  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"
                }
                alt={
                  selectedProperty.title
                }
              />

              <div className="admin-modal-details">

                <div>

                  <span>
                    LOCATION
                  </span>

                  <strong>
                    {
                      selectedProperty.location
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    TYPE
                  </span>

                  <strong>
                    {
                      selectedProperty.propertyType
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    LISTING
                  </span>

                  <strong>
                    For{" "}
                    {
                      selectedProperty.listingType
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    PRICE
                  </span>

                  <strong>
                    {selectedProperty.priceLabel ||
                      `PKR ${Number(
                        selectedProperty.price ||
                          0
                      ).toLocaleString()}`}
                  </strong>

                </div>

                <div>

                  <span>
                    OWNER
                  </span>

                  <strong>
                    {
                      selectedProperty.ownerName ||
                      selectedProperty.ownerId?.name ||
                      "Property Owner"
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    OWNER EMAIL
                  </span>

                  <strong>
                    {
                      selectedProperty.ownerEmail ||
                      selectedProperty.ownerId?.email ||
                      "Not available"
                    }
                  </strong>

                </div>

              </div>

              {selectedProperty.description && (
                <div className="admin-modal-description">

                  <span>
                    DESCRIPTION
                  </span>

                  <p>
                    {
                      selectedProperty.description
                    }
                  </p>

                </div>
              )}

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="admin-modal-close-button"
                  onClick={
                    closePropertyDetails
                  }
                >
                  Close
                </button>

                <button
                  type="button"
                  className="admin-modal-delete-button"
                  onClick={() =>
                    handleDeleteProperty(
                      selectedProperty
                    )
                  }
                >
                  Delete Property
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}

export default AdminDashboard;