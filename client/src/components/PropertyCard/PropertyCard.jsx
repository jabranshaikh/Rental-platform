import { Link } from "react-router-dom";

import { useSavedProperties } from "../../context/SavedPropertiesContext";

import "./PropertyCard.css";

function PropertyCard({ property }) {
  const {
    isSaved,
    toggleSaveProperty,
  } = useSavedProperties();

  // MongoDB uses _id
  // Old/local properties may use id
  const propertyId =
    property._id || property.id;

  const saved = isSaved(propertyId);

  const handleSave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    toggleSaveProperty(property);
  };

  return (
    <article className="property-card">

      {/* IMAGE */}
      <div className="property-card-image-wrapper">

        <img
          src={
            property.image ||
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
          }
          alt={property.title}
          className="property-card-image"
        />

        <div className="property-card-image-overlay" />

        {/* TOP BADGES */}
        <div className="property-card-top">

          <span className="property-card-listing-badge">
            For {property.listingType}
          </span>

          <button
            type="button"
            className={
              saved
                ? "property-card-save saved"
                : "property-card-save"
            }
            onClick={handleSave}
            aria-label={
              saved
                ? "Remove from saved"
                : "Save property"
            }
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
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.8 8.7c0 5.2-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
            </svg>
          </button>

        </div>

        {/* STATUS */}
        <div className="property-card-status">

          <span
            className={
              property.status === "Available"
                ? "status-dot available"
                : "status-dot reserved"
            }
          />

          {property.status}

        </div>

      </div>

      {/* CONTENT */}
      <div className="property-card-content">

        {/* PROPERTY TYPE */}
        <div className="property-card-type">
          {property.propertyType}
        </div>

        {/* TITLE + PRICE */}
        <div className="property-card-heading">

          <h3>
            {property.title}
          </h3>

          <div className="property-card-price">

            {property.priceLabel ||
              `PKR ${Number(
                property.price || 0
              ).toLocaleString()}`}

            {property.listingType ===
              "Rent" && (
              <span>
                / month
              </span>
            )}

          </div>

        </div>

        {/* LOCATION */}
        <div className="property-card-location">

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
            {property.location}
          </span>

        </div>

        {/* STATS */}
        <div className="property-card-stats">

          <div>
            <strong>
              {property.beds}
            </strong>

            <span>
              Beds
            </span>
          </div>

          <div>
            <strong>
              {property.baths}
            </strong>

            <span>
              Baths
            </span>
          </div>

          <div>
            <strong>
              {property.area
                ? Number(
                    property.area
                  ).toLocaleString()
                : "0"}
            </strong>

            <span>
              Sq Ft
            </span>
          </div>

        </div>

        {/* VIEW PROPERTY */}
        <Link
          to={`/properties/${propertyId}`}
          className="property-card-button"
        >
          <span>
            View Property
          </span>

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

      </div>

    </article>
  );
}

export default PropertyCard;