import { Link } from "react-router-dom";

import DashboardSidebar from "../../components/Dashboard/DashboardSidebar";
import { useSavedProperties } from "../../context/SavedPropertiesContext";

import "./SavedProperties.css";

function SavedProperties() {
  const {
    savedProperties,
    removeSavedProperty,
    clearSavedProperties,
  } = useSavedProperties();

  return (
    <div className="saved-properties-page">
      <DashboardSidebar />

      <main className="saved-properties-main">
        {/* HEADER */}

        <header className="saved-properties-header">
          <div>
            <p className="saved-properties-eyebrow">
              YOUR COLLECTION
            </p>

            <h1>Saved Properties</h1>

            <p>
              Properties you've saved for later.
            </p>
          </div>

          <Link
            to="/properties"
            className="saved-browse-button"
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

        {/* COUNT */}

        <div className="saved-properties-toolbar">
          <span>
            {savedProperties.length}{" "}
            {savedProperties.length === 1
              ? "Property"
              : "Properties"}{" "}
            Saved
          </span>

          {savedProperties.length > 0 && (
            <button
              type="button"
              onClick={clearSavedProperties}
            >
              Clear All
            </button>
          )}
        </div>

        {/* SAVED PROPERTIES */}

        {savedProperties.length > 0 ? (
          <div className="saved-properties-grid">
            {savedProperties.map((property) => (
              <article
                className="saved-property-card"
                key={property.id}
              >
                <div className="saved-property-image">
                  <img
                    src={property.image}
                    alt={property.title}
                  />

                  <span className="saved-property-type">
                    {property.propertyType}
                  </span>

                  <button
                    type="button"
                    className="saved-remove-button"
                    onClick={() =>
                      removeSavedProperty(property.id)
                    }
                    aria-label="Remove saved property"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.8 8.7c0 5.2-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
                    </svg>
                  </button>
                </div>

                <div className="saved-property-content">
                  <div className="saved-property-price-row">
                    <span>
                      {property.priceLabel}
                    </span>

                    {property.listingType === "Rent" && (
                      <small>/ month</small>
                    )}
                  </div>

                  <h2>{property.title}</h2>

                  <div className="saved-property-location">
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

                    <span>{property.location}</span>
                  </div>

                  <div className="saved-property-stats">
                    <span>
                      {property.beds} Beds
                    </span>

                    <span>
                      {property.baths} Baths
                    </span>

                    <span>
                      {property.area.toLocaleString()} sqft
                    </span>
                  </div>

                  <Link
                    to={`/properties/${property.id}`}
                    className="saved-details-button"
                  >
                    View Details

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
            ))}
          </div>
        ) : (
          /* EMPTY STATE */

          <div className="saved-empty-state">
            <div className="saved-empty-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.8 8.7c0 5.2-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
              </svg>
            </div>

            <h2>No saved properties yet</h2>

            <p>
              When you find a property you love,
              save it here so you can easily find it
              later.
            </p>

            <Link
              to="/properties"
              className="saved-empty-button"
            >
              Explore Properties
            </Link>
          </div>
        )}

        {/* FOOTER */}

        <footer className="saved-properties-footer">
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

export default SavedProperties;