import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";

import { useAuth } from "../../context/AuthContext";
import { useProperties } from "../../context/PropertiesContext";
import {
  useSavedProperties,
} from "../../context/SavedPropertiesContext";
import {
  useRecentlyViewed,
} from "../../context/RecentlyViewedContext";
import {
  useRequests,
} from "../../context/RequestsContext";

import "./PropertyDetails.css";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const { getPropertyById } =
    useProperties();

  const {
    isSaved,
    toggleSaveProperty,
  } = useSavedProperties();

  const {
    addRecentlyViewed,
  } = useRecentlyViewed();

  const {
    addRequest,
  } = useRequests();

  const property = getPropertyById(id);

  const [showVisitModal, setShowVisitModal] =
    useState(false);

  const [visitDate, setVisitDate] =
    useState("");

  const [visitTime, setVisitTime] =
    useState("");

  const [visitMessage, setVisitMessage] =
    useState("");

  const [requestSent, setRequestSent] =
    useState(false);

  const [requestSubmitting, setRequestSubmitting] =
    useState(false);

  useEffect(() => {
    if (property) {
      addRecentlyViewed(property);
    }
  }, [property, addRecentlyViewed]);

  if (!property) {
    return (
      <div className="property-details-page">
        <Navbar />

        <main className="property-details-not-found">
          <div>
            <span>
              PROPERTY NOT FOUND
            </span>

            <h1>
              We couldn't find this property.
            </h1>

            <p>
              The property may have been
              removed or is no longer
              available.
            </p>

            <Link to="/properties">
              Browse Properties
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // IMPORTANT:
  // MongoDB uses _id.
  // Older/local properties may use id.
  // =====================================================

  const propertyId =
    property?._id || property?.id;

  const saved = isSaved(propertyId);

  // =====================================================
  // SAVE PROPERTY
  // =====================================================

  const handleSave = () => {
    toggleSaveProperty(property);
  };

  // =====================================================
  // CONTACT OWNER
  // =====================================================

  const handleContactOwner = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!propertyId) {
      alert(
        "Property ID could not be found."
      );
      return;
    }

    try {
      setRequestSubmitting(true);

      /*
       * IMPORTANT:
       * Do NOT send ownerId.
       * Do NOT send userId.
       * Do NOT send ownerName.
       * Do NOT send userName.
       * Do NOT send userEmail.
       *
       * The backend gets all of this information
       * from the authenticated user and property.
       */

      await addRequest({
        propertyId: propertyId,

        requestType:
          "Contact Owner",

        preferredDate: "",

        preferredTime: "",

        message:
          "I am interested in this property and would like to contact the owner.",
      });

      setRequestSent(true);
    } catch (error) {
      console.error(
        "Contact Owner Request Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send request. Please try again."
      );
    } finally {
      setRequestSubmitting(false);
    }
  };

  // =====================================================
  // OPEN VISIT MODAL
  // =====================================================

  const handleScheduleVisit = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!propertyId) {
      alert(
        "Property ID could not be found."
      );
      return;
    }

    setShowVisitModal(true);
  };

  // =====================================================
  // SUBMIT VISIT REQUEST
  // =====================================================

  const handleVisitSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!propertyId) {
      alert(
        "Property ID could not be found."
      );
      return;
    }

    try {
      setRequestSubmitting(true);

      /*
       * Again, only send information that the
       * user is allowed to choose.
       *
       * The backend determines:
       * - userId
       * - userName
       * - userEmail
       * - ownerId
       * - ownerName
       * - ownerEmail
       * - propertyTitle
       * - propertyLocation
       */

      await addRequest({
        propertyId: propertyId,

        requestType:
          "Property Viewing",

        preferredDate:
          visitDate,

        preferredTime:
          visitTime,

        message:
          visitMessage.trim(),
      });

      setShowVisitModal(false);

      setVisitDate("");
      setVisitTime("");
      setVisitMessage("");

      setRequestSent(true);
    } catch (error) {
      console.error(
        "Property Viewing Request Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send viewing request. Please try again."
      );
    } finally {
      setRequestSubmitting(false);
    }
  };

  // =====================================================
  // FORMAT AREA
  // =====================================================

  const formattedArea =
    property.area !== undefined &&
    property.area !== null &&
    property.area !== ""
      ? Number(property.area).toLocaleString()
      : "0";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="property-details-page">
      <Navbar />

      <main className="property-details-main">
        <div className="property-details-container">

          {/* BACK */}
          <Link
            to="/properties"
            className="property-details-back"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>

            Back to Properties
          </Link>

          {/* IMAGE */}
          <section className="property-details-image-section">
            <img
              src={
                property.image ||
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
              }
              alt={property.title}
            />

            <div className="property-details-image-gradient" />

            <div className="property-details-image-info">
              <span>
                {property.propertyType}
              </span>

              <span>
                For {property.listingType}
              </span>
            </div>

            <button
              type="button"
              className={
                saved
                  ? "property-details-save saved"
                  : "property-details-save"
              }
              onClick={handleSave}
            >
              <svg
                viewBox="0 0 24 24"
                fill={
                  saved
                    ? "currentColor"
                    : "none"
                }
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M20.8 8.7c0 5.2-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
              </svg>

              {saved ? "Saved" : "Save"}
            </button>
          </section>

          {/* MAIN LAYOUT */}
          <section className="property-details-layout">

            {/* MAIN INFO */}
            <div className="property-details-main-info">

              {/* HEADING */}
              <div className="property-details-heading">
                <div>

                  <span className="property-details-eyebrow">
                    {property.listingType ===
                    "Rent"
                      ? "AVAILABLE FOR RENT"
                      : "AVAILABLE FOR SALE"}
                  </span>

                  <h1>
                    {property.title}
                  </h1>

                  <div className="property-details-location">
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

                    {property.location}
                  </div>
                </div>

                <div className="property-details-price">
                  <strong>
                    {property.priceLabel ||
                      `PKR ${Number(
                        property.price || 0
                      ).toLocaleString()}`}
                  </strong>

                  {property.listingType ===
                    "Rent" && (
                    <span>
                      per month
                    </span>
                  )}
                </div>
              </div>

              {/* STATS */}
              <div className="property-details-stats">

                <div>
                  <strong>
                    {property.beds || 0}
                  </strong>

                  <span>
                    Bedrooms
                  </span>
                </div>

                <div>
                  <strong>
                    {property.baths || 0}
                  </strong>

                  <span>
                    Bathrooms
                  </span>
                </div>

                <div>
                  <strong>
                    {formattedArea}
                  </strong>

                  <span>
                    Square Feet
                  </span>
                </div>

                <div>
                  <strong>
                    {property.propertyType}
                  </strong>

                  <span>
                    Property
                  </span>
                </div>

              </div>

              {/* ABOUT */}
              <section className="property-details-section">
                <h2>
                  About this property
                </h2>

                <p>
                  {property.description}
                </p>
              </section>

              {/* FEATURES */}
              {property.features?.length >
                0 && (
                <section className="property-details-section">

                  <h2>
                    Property features
                  </h2>

                  <div className="property-details-features">
                    {property.features.map(
                      (
                        feature,
                        index
                      ) => (
                        <div
                          key={`${feature}-${index}`}
                        >
                          <span>
                            ✓
                          </span>

                          {feature}
                        </div>
                      )
                    )}
                  </div>

                </section>
              )}

            </div>

            {/* SIDEBAR */}
            <aside className="property-details-sidebar">

              <div className="property-owner-card">

                <span className="property-owner-label">
                  INTERESTED IN THIS PROPERTY?
                </span>

                {/* OWNER */}
                <div className="property-owner-profile">

                  <div className="property-owner-avatar">
                    {property.ownerName
                      ?.charAt(0)
                      .toUpperCase() ||
                      "S"}
                  </div>

                  <div>
                    <strong>
                      {property.ownerName ||
                        "Property Owner"}
                    </strong>

                    <span>
                      Verified StayNest Owner
                    </span>
                  </div>

                </div>

                {/* REQUEST SUCCESS */}
                {requestSent ? (
                  <div className="property-request-success">

                    <div>
                      ✓
                    </div>

                    <strong>
                      Request Sent
                    </strong>

                    <p>
                      The owner will receive
                      your request shortly.
                    </p>

                    <Link to="/dashboard/requests">
                      View My Requests
                    </Link>

                  </div>
                ) : (
                  <div className="property-owner-actions">

                    {/* CONTACT OWNER */}
                    <button
                      type="button"
                      className="property-contact-button"
                      onClick={
                        handleContactOwner
                      }
                      disabled={
                        requestSubmitting
                      }
                    >
                      {requestSubmitting
                        ? "Sending..."
                        : "Contact Owner"}
                    </button>

                    {/* SCHEDULE VISIT */}
                    <button
                      type="button"
                      className="property-visit-button"
                      onClick={
                        handleScheduleVisit
                      }
                      disabled={
                        requestSubmitting
                      }
                    >
                      Schedule a Visit
                    </button>

                  </div>
                )}

                <div className="property-owner-note">
                  <span>
                    ●
                  </span>

                  Response usually within
                  24 hours
                </div>

              </div>

              {/* SAFETY */}
              <div className="property-details-safety">

                <strong>
                  StayNest Safety
                </strong>

                <p>
                  Never send money before
                  viewing a property and
                  verifying the owner.
                </p>

              </div>

            </aside>

          </section>

        </div>
      </main>

      {/* VISIT MODAL */}
      {showVisitModal && (
        <div
          className="property-modal-overlay"
          onClick={() =>
            !requestSubmitting &&
            setShowVisitModal(false)
          }
        >

          <div
            className="property-visit-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}
            <div className="property-modal-header">

              <div>
                <span>
                  SCHEDULE A VISIT
                </span>

                <h2>
                  Visit this property
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  !requestSubmitting &&
                  setShowVisitModal(false)
                }
                disabled={
                  requestSubmitting
                }
              >
                ×
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={
                handleVisitSubmit
              }
              className="property-visit-form"
            >

              {/* DATE */}
              <label>
                Preferred date

                <input
                  type="date"
                  value={visitDate}
                  onChange={(event) =>
                    setVisitDate(
                      event.target.value
                    )
                  }
                  required
                  disabled={
                    requestSubmitting
                  }
                />
              </label>

              {/* TIME */}
              <label>
                Preferred time

                <input
                  type="time"
                  value={visitTime}
                  onChange={(event) =>
                    setVisitTime(
                      event.target.value
                    )
                  }
                  required
                  disabled={
                    requestSubmitting
                  }
                />
              </label>

              {/* MESSAGE */}
              <label>
                Message

                <span>
                  Optional
                </span>

                <textarea
                  rows="4"
                  placeholder="Anything you'd like the owner to know?"
                  value={visitMessage}
                  onChange={(event) =>
                    setVisitMessage(
                      event.target.value
                    )
                  }
                  disabled={
                    requestSubmitting
                  }
                />
              </label>

              {/* SUBMIT */}
              <button
                type="submit"
                className="property-modal-submit"
                disabled={
                  requestSubmitting
                }
              >
                {requestSubmitting
                  ? "Sending..."
                  : "Send Viewing Request"}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default PropertyDetails;