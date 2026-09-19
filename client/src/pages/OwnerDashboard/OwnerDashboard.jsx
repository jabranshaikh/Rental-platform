import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useRequests } from "../../context/RequestsContext";
import { useProperties } from "../../context/PropertiesContext";

import "./OwnerDashboard.css";

function OwnerDashboard() {
  const { user, token } = useAuth();

  const {
    requests,
    updateRequestStatus,
  } = useRequests();

  const {
    addProperty,
    updateProperty,
    deleteProperty,
    getPropertiesByOwner,
  } = useProperties();

  // =========================================
  // OWNER ID
  // =========================================

  const ownerId =
    user?.id ||
    user?._id ||
    null;

  // =========================================
  // MY PROPERTIES
  // =========================================

  const myProperties =
    getPropertiesByOwner(ownerId);

  // =========================================
  // PROPERTY IDS
  // =========================================

  const myPropertyIds = new Set(
    myProperties.map(
      (property) =>
        property?._id ||
        property?.id
    )
  );

  // =========================================
  // MY REQUESTS
  // =========================================

  const myRequests = requests.filter(
    (request) => {
      const requestOwnerId =
        request?.ownerId?._id ||
        request?.ownerId;

      const requestPropertyId =
        request?.propertyId?._id ||
        request?.propertyId;

      if (
        requestOwnerId &&
        ownerId
      ) {
        return (
          String(requestOwnerId) ===
          String(ownerId)
        );
      }

      return myPropertyIds.has(
        requestPropertyId
      );
    }
  );

  // =========================================
  // REQUEST STATS
  // =========================================

  const pendingRequests =
    myRequests.filter(
      (request) =>
        request.status === "Pending"
    );

  const approvedRequests =
    myRequests.filter(
      (request) =>
        request.status === "Approved"
    );

  // =========================================
  // PROPERTY MODAL
  // =========================================

  const [
    showPropertyModal,
    setShowPropertyModal,
  ] = useState(false);

  const [
    editingProperty,
    setEditingProperty,
  ] = useState(null);

  const [
    propertyForm,
    setPropertyForm,
  ] = useState({
    title: "",
    location: "",
    listingType: "Rent",
    propertyType: "House",
    price: "",
    beds: "",
    baths: "",
    area: "",
    image: "",
    description: "",
    features: "",
    status: "Available",
  });

  const [propertySubmitting, setPropertySubmitting] =
    useState(false);

  // =========================================
  // RESET FORM
  // =========================================

  const resetPropertyForm = () => {
    setPropertyForm({
      title: "",
      location: "",
      listingType: "Rent",
      propertyType: "House",
      price: "",
      beds: "",
      baths: "",
      area: "",
      image: "",
      description: "",
      features: "",
      status: "Available",
    });
  };

  // =========================================
  // DATE FORMAT
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================
  // TIME FORMAT
  // =========================================

  const formatTime = (time) => {
    if (!time) {
      return "Not specified";
    }

    const [hours, minutes] =
      time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes)
    );

    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  // =========================================
  // REQUEST ACTIONS
  // =========================================

  const handleApprove = async (
    requestId
  ) => {
    try {
      await updateRequestStatus(
        requestId,
        "Approved"
      );
    } catch (error) {
      console.error(
        "Approve Request Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to approve request."
      );
    }
  };

  const handleReject = async (
    requestId
  ) => {
    try {
      await updateRequestStatus(
        requestId,
        "Rejected"
      );
    } catch (error) {
      console.error(
        "Reject Request Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to reject request."
      );
    }
  };

  // =========================================
  // OPEN ADD PROPERTY
  // =========================================

  const openAddProperty = () => {
    setEditingProperty(null);

    resetPropertyForm();

    setShowPropertyModal(true);
  };

  // =========================================
  // OPEN EDIT PROPERTY
  // =========================================

  const openEditProperty = (
    property
  ) => {
    setEditingProperty(property);

    setPropertyForm({
      title: property.title || "",

      location:
        property.location || "",

      listingType:
        property.listingType || "Rent",

      propertyType:
        property.propertyType ||
        "House",

      price:
        property.price ?? "",

      beds:
        property.beds ?? "",

      baths:
        property.baths ?? "",

      area:
        property.area ?? "",

      image:
        property.image || "",

      description:
        property.description || "",

      features:
        Array.isArray(
          property.features
        )
          ? property.features.join(", ")
          : "",

      status:
        property.status ||
        "Available",
    });

    setShowPropertyModal(true);
  };

  // =========================================
  // CLOSE PROPERTY MODAL
  // =========================================

  const closePropertyModal = () => {
    if (propertySubmitting) {
      return;
    }

    setShowPropertyModal(false);

    setEditingProperty(null);

    resetPropertyForm();
  };

  // =========================================
  // FORM CHANGE
  // =========================================

  const handlePropertyChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setPropertyForm(
      (currentForm) => ({
        ...currentForm,
        [name]: value,
      })
    );
  };

  // =========================================
  // ADD / UPDATE PROPERTY
  // =========================================

  const handlePropertySubmit = async (
    event
  ) => {
    event.preventDefault();

    // ---------------------------------------
    // CHECK LOGIN
    // ---------------------------------------

    if (!user) {
      alert(
        "Owner information could not be found. Please log in again."
      );

      return;
    }

    // ---------------------------------------
    // CHECK TOKEN
    // ---------------------------------------

    if (!token) {
      alert(
        "Your login session has expired. Please log in again."
      );

      return;
    }

    // ---------------------------------------
    // REQUIRED FIELDS
    // ---------------------------------------

    if (
      !propertyForm.title.trim() ||
      !propertyForm.location.trim() ||
      !propertyForm.price ||
      !propertyForm.description.trim()
    ) {
      alert(
        "Please fill in all required fields."
      );

      return;
    }

    // ---------------------------------------
    // FEATURES
    // ---------------------------------------

    const features =
      propertyForm.features
        .split(",")
        .map(
          (feature) =>
            feature.trim()
        )
        .filter(Boolean);

    // ---------------------------------------
    // NUMBERS
    // ---------------------------------------

    const priceNumber =
      Number(propertyForm.price);

    const bedsNumber =
      Number(propertyForm.beds || 0);

    const bathsNumber =
      Number(propertyForm.baths || 0);

    const areaNumber =
      Number(propertyForm.area || 0);

    // ---------------------------------------
    // VALIDATE PRICE
    // ---------------------------------------

    if (
      Number.isNaN(priceNumber) ||
      priceNumber <= 0
    ) {
      alert(
        "Please enter a valid property price."
      );

      return;
    }

    // ---------------------------------------
    // PROPERTY DATA
    // ---------------------------------------

    const propertyData = {
      title:
        propertyForm.title.trim(),

      location:
        propertyForm.location.trim(),

      listingType:
        propertyForm.listingType,

      propertyType:
        propertyForm.propertyType,

      price:
        priceNumber,

      beds:
        bedsNumber,

      baths:
        bathsNumber,

      area:
        areaNumber,

      image:
        propertyForm.image.trim() ||
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",

      description:
        propertyForm.description.trim(),

      features,

      status:
        propertyForm.status,
    };

    try {
      setPropertySubmitting(true);

      // =====================================
      // UPDATE EXISTING PROPERTY
      // =====================================

      if (editingProperty) {
        const propertyId =
          editingProperty._id ||
          editingProperty.id;

        if (!propertyId) {
          alert(
            "Property ID could not be found."
          );

          return;
        }

        const response =
          await updateProperty(
            propertyId,
            propertyData,
            token
          );

        if (
          response &&
          response.success
        ) {
          alert(
            "Property updated successfully."
          );

          setShowPropertyModal(false);

          setEditingProperty(null);

          resetPropertyForm();
        } else {
          alert(
            response?.message ||
              "Failed to update property."
          );
        }

        return;
      }

      // =====================================
      // CREATE NEW PROPERTY
      // =====================================

      const response =
        await addProperty(
          propertyData,
          token
        );

      if (
        response &&
        response.success
      ) {
        alert(
          "Property added successfully!"
        );

        setShowPropertyModal(false);

        setEditingProperty(null);

        resetPropertyForm();
      } else {
        alert(
          response?.message ||
            "Failed to add property."
        );
      }
    } catch (error) {
      console.error(
        "Property Submit Error:",
        error
      );

      console.error(
        "Backend Response:",
        error.response?.data
      );

      const backendMessage =
        error.response?.data?.message;

      if (
        error.response?.status === 401
      ) {
        alert(
          "Your login session is invalid or expired. Please log in again."
        );
      } else if (
        error.response?.status === 403
      ) {
        alert(
          "Your account does not have owner permission to add properties."
        );
      } else {
        alert(
          backendMessage ||
            error.message ||
            "Failed to save property."
        );
      }
    } finally {
      setPropertySubmitting(false);
    }
  };

  // =========================================
  // DELETE PROPERTY
  // =========================================

  const handleDeleteProperty = async (
    propertyId
  ) => {
    const propertyBelongsToOwner =
      myProperties.some(
        (property) =>
          String(
            property?._id ||
              property?.id
          ) ===
          String(propertyId)
      );

    if (!propertyBelongsToOwner) {
      alert(
        "You cannot delete a property that does not belong to you."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this property?"
      );

    if (!confirmed) {
      return;
    }

    if (!token) {
      alert(
        "Your login session has expired. Please log in again."
      );

      return;
    }

    try {
      const response =
        await deleteProperty(
          propertyId,
          token
        );

      if (
        response &&
        response.success
      ) {
        alert(
          "Property deleted successfully."
        );
      } else {
        alert(
          response?.message ||
            "Failed to delete property."
        );
      }
    } catch (error) {
      console.error(
        "Delete Property Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete property."
      );
    }
  };

  return (
    <div className="owner-dashboard">

      {/* SIDEBAR */}

      <aside className="owner-sidebar">

        <div className="owner-sidebar-top">

          <div className="owner-sidebar-brand">
            Stay<span>Nest</span>
          </div>

          <div className="owner-sidebar-role">
            <span className="owner-role-dot" />
            OWNER PORTAL
          </div>

        </div>

        <nav className="owner-sidebar-nav">

          <a
            href="#overview"
            className="owner-sidebar-link active"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
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
          </a>

          <a
            href="#requests"
            className="owner-sidebar-link"
          >
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

            <span>
              Requests
            </span>

            {pendingRequests.length >
              0 && (
              <span className="owner-sidebar-badge">
                {pendingRequests.length}
              </span>
            )}
          </a>

          <a
            href="#properties"
            className="owner-sidebar-link"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 10 9-7 9 7" />
              <path d="M5 9v11h14V9" />
              <path d="M9 20v-6h6v6" />
            </svg>

            <span>
              My Properties
            </span>
          </a>

        </nav>

        <div className="owner-sidebar-bottom">

          <div className="owner-sidebar-help">

            <div className="owner-help-icon">
              ?
            </div>

            <div>
              <strong>
                Need help?
              </strong>

              <p>
                We're here for you.
              </p>
            </div>

          </div>

          <div className="owner-sidebar-line" />

          <div className="owner-sidebar-mini">

            <span>
              {user?.name ||
                "StayNest Owner"}
            </span>

            <small>
              {user?.email ||
                "Owner workspace"}
            </small>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <main className="owner-dashboard-main">

        {/* HEADER */}

        <header
          className="owner-dashboard-header"
          id="overview"
        >

          <div className="owner-header-content">

            <div>

              <p className="owner-dashboard-eyebrow">
                OWNER PORTAL
              </p>

              <h1>
                Welcome back,{" "}
                {user?.name
                  ?.split(" ")[0] ||
                  "Owner"}
                .
              </h1>

              <p className="owner-header-description">
                Keep your listings organized
                and stay on top of incoming
                requests.
              </p>

            </div>

            <button
              type="button"
              className="owner-header-add-button"
              onClick={
                openAddProperty
              }
            >
              <span>
                +
              </span>

              Add Property
            </button>

          </div>

        </header>

        {/* STATS */}

        <section className="owner-stats">

          <div className="owner-stat-card">

            <div className="owner-stat-icon">

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

            <div className="owner-stat-content">

              <span>
                MY PROPERTIES
              </span>

              <strong>
                {myProperties.length}
              </strong>

              <p>
                Your listed properties
              </p>

            </div>

          </div>

          <div className="owner-stat-card">

            <div className="owner-stat-icon">

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

            <div className="owner-stat-content">

              <span>
                PENDING REQUESTS
              </span>

              <strong>
                {pendingRequests.length}
              </strong>

              <p>
                Waiting for your response
              </p>

            </div>

          </div>

          <div className="owner-stat-card">

            <div className="owner-stat-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>

            </div>

            <div className="owner-stat-content">

              <span>
                APPROVED
              </span>

              <strong>
                {approvedRequests.length}
              </strong>

              <p>
                Approved requests
              </p>

            </div>

          </div>

          <div className="owner-stat-card">

            <div className="owner-stat-icon">

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

            <div className="owner-stat-content">

              <span>
                TOTAL REQUESTS
              </span>

              <strong>
                {myRequests.length}
              </strong>

              <p>
                Requests for your properties
              </p>

            </div>

          </div>

        </section>

        {/* REQUESTS */}

        <section
          className="owner-section"
          id="requests"
        >

          <div className="owner-section-header">

            <div>

              <span className="owner-section-label">
                PROPERTY ACTIVITY
              </span>

              <h2>
                Incoming Requests
              </h2>

              <p>
                Review requests from
                potential tenants.
              </p>

            </div>

            {pendingRequests.length >
              0 && (
              <div className="owner-pending-indicator">
                <span />
                {pendingRequests.length}{" "}
                pending
              </div>
            )}

          </div>

          {myRequests.length > 0 ? (

            <div className="owner-requests-list">

              {myRequests.map(
                (request) => {

                  const requestId =
                    request?._id ||
                    request?.id;

                  const requestType =
                    request.requestType ||
                    request.type ||
                    "Property Request";

                  const propertyTitle =
                    request.propertyTitle ||
                    request.title ||
                    "Property";

                  const propertyLocation =
                    request.propertyLocation ||
                    request.location ||
                    "";

                  return (

                    <article
                      className="owner-request-card"
                      key={requestId}
                    >

                      <div className="owner-request-icon">

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

                      <div className="owner-request-content">

                        <div className="owner-request-top">

                          <div>

                            <span className="owner-request-type">
                              {requestType}
                            </span>

                            <h3>
                              {propertyTitle}
                            </h3>

                            {propertyLocation && (
                              <p className="owner-request-location">

                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                >
                                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />

                                  <circle
                                    cx="12"
                                    cy="10"
                                    r="2.5"
                                  />
                                </svg>

                                {
                                  propertyLocation
                                }

                              </p>
                            )}

                          </div>

                          <span
                            className={`owner-request-status ${
                              request.status
                                ?.toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )
                            }`}
                          >
                            <span />

                            {request.status}

                          </span>

                        </div>

                        {(request.userName ||
                          request.userEmail) && (

                          <div className="owner-request-user">

                            <div className="owner-request-avatar">

                              {(
                                request.userName ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <div>

                              <strong>
                                {request.userName ||
                                  "Potential Tenant"}
                              </strong>

                              {request.userEmail && (
                                <span>
                                  {
                                    request.userEmail
                                  }
                                </span>
                              )}

                            </div>

                          </div>

                        )}

                        {request.requestType ===
                          "Property Viewing" && (

                          <div className="owner-visit-details">

                            <div>

                              <span>
                                PREFERRED DATE
                              </span>

                              <strong>
                                {formatDate(
                                  request.preferredDate
                                )}
                              </strong>

                            </div>

                            <div>

                              <span>
                                PREFERRED TIME
                              </span>

                              <strong>
                                {formatTime(
                                  request.preferredTime
                                )}
                              </strong>

                            </div>

                          </div>

                        )}

                        {request.message && (

                          <div className="owner-request-message">

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

                        <div className="owner-request-footer">

                          <span className="owner-request-date">
                            Submitted{" "}
                            {formatDate(
                              request.createdAt
                            )}
                          </span>

                          {request.status ===
                            "Pending" && (

                            <div className="owner-request-actions">

                              <button
                                type="button"
                                className="owner-reject-button"
                                onClick={() =>
                                  handleReject(
                                    requestId
                                  )
                                }
                              >
                                Reject
                              </button>

                              <button
                                type="button"
                                className="owner-approve-button"
                                onClick={() =>
                                  handleApprove(
                                    requestId
                                  )
                                }
                              >
                                <span>
                                  ✓
                                </span>

                                Approve
                              </button>

                            </div>

                          )}

                        </div>

                      </div>

                    </article>

                  );
                }
              )}

            </div>

          ) : (

            <div className="owner-empty-state">

              <div className="owner-empty-icon">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M4 5h16v14H4z" />
                  <path d="m4 7 8 6 8-6" />
                </svg>

              </div>

              <span className="owner-empty-label">
                ALL CLEAR
              </span>

              <h3>
                No incoming requests
              </h3>

              <p>
                New contact and property
                viewing requests for your
                properties will appear here.
              </p>

            </div>

          )}

        </section>

        {/* PROPERTIES */}

        <section
          className="owner-section owner-properties-section"
          id="properties"
        >

          <div className="owner-section-header owner-properties-header">

            <div>

              <span className="owner-section-label">
                YOUR LISTINGS
              </span>

              <h2>
                My Properties
              </h2>

              <p>
                Manage properties that belong
                to your StayNest account.
              </p>

            </div>

            <button
              type="button"
              className="owner-add-property-button"
              onClick={
                openAddProperty
              }
            >
              <span>
                +
              </span>

              Add Property
            </button>

          </div>

          {myProperties.length > 0 ? (

            <div className="owner-properties-grid">

              {myProperties.map(
                (property) => {

                  const propertyId =
                    property?._id ||
                    property?.id;

                  return (

                    <article
                      className="owner-property-card"
                      key={propertyId}
                    >

                      <div className="owner-property-image-wrapper">

                        <img
                          src={
                            property.image ||
                            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"
                          }
                          alt={
                            property.title
                          }
                        />

                        <div className="owner-property-image-overlay" />

                        <span
                          className={`owner-property-status ${
                            property.status ===
                            "Available"
                              ? "available"
                              : "reserved"
                          }`}
                        >
                          <span />

                          {
                            property.status
                          }
                        </span>

                        <span className="owner-property-listing">
                          For{" "}
                          {
                            property.listingType
                          }
                        </span>

                      </div>

                      <div className="owner-property-content">

                        <div className="owner-property-top">

                          <span className="owner-property-type">
                            {
                              property.propertyType
                            }
                          </span>

                          <strong>

                            {
                              property.priceLabel ||
                              `PKR ${Number(
                                property.price || 0
                              ).toLocaleString()}`
                            }

                            {property.listingType ===
                              "Rent" && (
                              <small>
                                / month
                              </small>
                            )}

                          </strong>

                        </div>

                        <h3>
                          {property.title}
                        </h3>

                        <p className="owner-property-location">

                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />

                            <circle
                              cx="12"
                              cy="10"
                              r="2.5"
                            />
                          </svg>

                          {
                            property.location
                          }

                        </p>

                        <div className="owner-property-stats">

                          <span>

                            <strong>
                              {
                                property.beds
                              }
                            </strong>

                            Beds

                          </span>

                          <span>

                            <strong>
                              {
                                property.baths
                              }
                            </strong>

                            Baths

                          </span>

                          <span>

                            <strong>
                              {Number(
                                property.area || 0
                              ).toLocaleString()}
                            </strong>

                            Sq Ft

                          </span>

                        </div>

                        <div className="owner-property-actions">

                          <button
                            type="button"
                            className="owner-edit-button"
                            onClick={() =>
                              openEditProperty(
                                property
                              )
                            }
                          >

                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path d="M12 20h9" />

                              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                            </svg>

                            Edit

                          </button>

                          <button
                            type="button"
                            className="owner-delete-button"
                            onClick={() =>
                              handleDeleteProperty(
                                propertyId
                              )
                            }
                          >

                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path d="M4 7h16" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                              <path d="M6 7l1 13h10l1-13" />
                              <path d="M9 7V4h6v3" />
                            </svg>

                            Delete

                          </button>

                        </div>

                      </div>

                    </article>

                  );
                }
              )}

            </div>

          ) : (

            <div className="owner-empty-state owner-properties-empty">

              <div className="owner-empty-icon">
                +
              </div>

              <span className="owner-empty-label">
                GET STARTED
              </span>

              <h3>
                No properties yet
              </h3>

              <p>
                Add your first property to
                start receiving requests.
              </p>

              <button
                type="button"
                className="owner-empty-add-button"
                onClick={
                  openAddProperty
                }
              >
                Add Your First Property
              </button>

            </div>

          )}

        </section>

        {/* FOOTER */}

        <footer className="owner-dashboard-footer">

          <div className="owner-footer-brand">

            Stay<span>Nest</span>

            <p>
              Find a place you'll love to
              come home to.
            </p>

          </div>

          <p>
            © 2026 StayNest. All rights
            reserved.
          </p>

        </footer>

      </main>

      {/* PROPERTY MODAL */}

      {showPropertyModal && (

        <div
          className="owner-property-modal-overlay"
          onClick={
            closePropertyModal
          }
        >

          <div
            className="owner-property-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="owner-modal-header">

              <div>

                <span>
                  {editingProperty
                    ? "UPDATE LISTING"
                    : "NEW LISTING"}
                </span>

                <h2>
                  {editingProperty
                    ? "Edit Property"
                    : "Add Property"}
                </h2>

                <p>
                  {editingProperty
                    ? "Update the details of your property."
                    : "Add a new property to StayNest."}
                </p>

              </div>

              <button
                type="button"
                className="owner-modal-close"
                onClick={
                  closePropertyModal
                }
                aria-label="Close"
              >
                ×
              </button>

            </div>

            <form
              className="owner-property-form"
              onSubmit={
                handlePropertySubmit
              }
            >

              <div className="owner-form-grid">

                <div className="owner-form-group owner-form-full">

                  <label htmlFor="title">
                    Property Title
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={
                      propertyForm.title
                    }
                    onChange={
                      handlePropertyChange
                    }
                    placeholder="e.g. Modern Family House"
                    required
                  />

                </div>

                <div className="owner-form-group owner-form-full">

                  <label htmlFor="location">
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={
                      propertyForm.location
                    }
                    onChange={
                      handlePropertyChange
                    }
                    placeholder="e.g. DHA Phase 6, Lahore"
                    required
                  />

                </div>

                <div className="owner-form-group">

                  <label htmlFor="listingType">
                    Listing Type
                  </label>

                  <select
                    id="listingType"
                    name="listingType"
                    value={
                      propertyForm.listingType
                    }
                    onChange={
                      handlePropertyChange
                    }
                  >
                    <option value="Rent">
                      Rent
                    </option>

                    <option value="Sale">
                      Sale
                    </option>
                  </select>

                </div>

                <div className="owner-form-group">

                  <label htmlFor="propertyType">
                    Property Type
                  </label>

                  <select
                    id="propertyType"
                    name="propertyType"
                    value={
                      propertyForm.propertyType
                    }
                    onChange={
                      handlePropertyChange
                    }
                  >
                    <option value="House">
                      House
                    </option>

                    <option value="Apartment">
                      Apartment
                    </option>

                    <option value="Villa">
                      Villa
                    </option>

                    <option value="Studio">
                      Studio
                    </option>

                    <option value="Commercial">
                      Commercial
                    </option>
                  </select>

                </div>

                <div className="owner-form-group">

                  <label htmlFor="price">
                    Price (PKR)
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={
                      propertyForm.price
                    }
                    onChange={
                      handlePropertyChange
                    }
                    placeholder="85000"
                    required
                  />

                </div>

                <div className="owner-form-group">

                  <label htmlFor="status">
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={
                      propertyForm.status
                    }
                    onChange={
                      handlePropertyChange
                    }
                  >
                    <option value="Available">
                      Available
                    </option>

                    <option value="Reserved">
                      Reserved
                    </option>
                  </select>

                </div>

                <div className="owner-form-group">

                  <label htmlFor="beds">
                    Bedrooms
                  </label>

                  <input
                    id="beds"
                    name="beds"
                    type="number"
                    min="0"
                    value={
                      propertyForm.beds
                    }
                    onChange={
                      handlePropertyChange
                    }
                    placeholder="4"
                    required
                  />

                </div>

                <div className="owner-form-group">

                  <label htmlFor="baths">
                    Bathrooms
                  </label>

                  <input
                    id="baths"
                    name="baths"
                    type="number"
                    min="0"
                    value={
                      propertyForm.baths
                    }
                    onChange={
                      handlePropertyChange
                    }
                    placeholder="4"
                    required
                  />

                </div>

                <div className="owner-form-group">

                  <label htmlFor="area">
                    Area (sq ft)
                  </label>

                  <input
                    id="area"
                    name="area"
                    type="number"
                    min="0"
                    value={
                      propertyForm.area
                    }
                    onChange={
                      handlePropertyChange
                    }
                    placeholder="2400"
                    required
                  />

                </div>

                <div className="owner-form-group owner-form-full">

                  <label htmlFor="image">
                    Image URL
                  </label>

                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={
                      propertyForm.image
                    }
                    onChange={
                      handlePropertyChange
                    }
                    placeholder="https://example.com/property.jpg"
                  />

                  <small>
                    Leave empty to use a
                    default property image.
                  </small>

                </div>

                <div className="owner-form-group owner-form-full">

                  <label htmlFor="description">
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={
                      propertyForm.description
                    }
                    onChange={
                      handlePropertyChange
                    }
                    placeholder="Describe the property..."
                    rows="4"
                    required
                  />

                </div>

                <div className="owner-form-group owner-form-full">

                  <label htmlFor="features">
                    Features
                  </label>

                  <input
                    id="features"
                    name="features"
                    type="text"
                    value={
                      propertyForm.features
                    }
                    onChange={
                      handlePropertyChange
                    }
                    placeholder="Parking, Security, Garden, Balcony"
                  />

                  <small>
                    Separate features with
                    commas.
                  </small>

                </div>

              </div>

              <div className="owner-modal-actions">

                <button
                  type="button"
                  className="owner-modal-cancel"
                  onClick={
                    closePropertyModal
                  }
                  disabled={
                    propertySubmitting
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="owner-modal-submit"
                  disabled={
                    propertySubmitting
                  }
                >
                  {propertySubmitting
                    ? "Saving..."
                    : editingProperty
                    ? "Save Changes"
                    : "Add Property"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default OwnerDashboard;