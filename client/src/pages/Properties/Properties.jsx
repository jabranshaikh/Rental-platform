import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { useProperties } from "../../context/PropertiesContext";

import "./Properties.css";

function Properties() {
  const {
    properties,
    loading,
    error,
  } = useProperties();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [listingType, setListingType] =
    useState("All");

  const [propertyType, setPropertyType] =
    useState("All");

  // ==============================
  // FILTER PROPERTIES
  // ==============================

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const search =
        searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        property.title
          ?.toLowerCase()
          .includes(search) ||
        property.location
          ?.toLowerCase()
          .includes(search) ||
        property.propertyType
          ?.toLowerCase()
          .includes(search);

      const matchesListingType =
        listingType === "All" ||
        property.listingType === listingType;

      const matchesPropertyType =
        propertyType === "All" ||
        property.propertyType === propertyType;

      return (
        matchesSearch &&
        matchesListingType &&
        matchesPropertyType
      );
    });
  }, [
    properties,
    searchTerm,
    listingType,
    propertyType,
  ]);

  // ==============================
  // CLEAR FILTERS
  // ==============================

  const clearFilters = () => {
    setSearchTerm("");
    setListingType("All");
    setPropertyType("All");
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="properties-loading">
        <div>
          <h2>Loading properties...</h2>

          <p>
            Please wait while we fetch the
            latest listings.
          </p>
        </div>
      </div>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error) {
    return (
      <div className="properties-loading">
        <div>
          <h2>Unable to load properties</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  // ==============================
  // PAGE
  // ==============================

  return (
    <div className="properties-page">

      <Navbar />

      <main className="properties-main">

        <div className="properties-container">

          {/* ==============================
              HERO
          ============================== */}

          <section className="properties-hero">

            <div className="properties-hero-content">

              <span className="properties-eyebrow">
                FIND YOUR NEXT PLACE
              </span>

              <h1>
                Find a place
                <br />
                <span>you'll love.</span>
              </h1>

              <p>
                Discover beautiful homes,
                apartments, and villas in the
                locations you love.
              </p>

            </div>

            <div className="properties-hero-decoration">

              <div className="hero-circle hero-circle-one" />

              <div className="hero-circle hero-circle-two" />

            </div>

          </section>

          {/* ==============================
              SEARCH AREA
          ============================== */}

          <section className="properties-search-panel">

            <div className="properties-search-box">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
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
                placeholder="Search by location, property name..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="properties-search-divider" />

            {/* LISTING TYPE */}

            <div className="properties-filter">

              <span>LISTING</span>

              <select
                value={listingType}
                onChange={(event) =>
                  setListingType(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Listings
                </option>

                <option value="Rent">
                  For Rent
                </option>

                <option value="Sale">
                  For Sale
                </option>

              </select>

            </div>

            {/* PROPERTY TYPE */}

            <div className="properties-filter">

              <span>PROPERTY TYPE</span>

              <select
                value={propertyType}
                onChange={(event) =>
                  setPropertyType(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Types
                </option>

                <option value="House">
                  Houses
                </option>

                <option value="Apartment">
                  Apartments
                </option>

                <option value="Villa">
                  Villas
                </option>

                <option value="Studio">
                  Studios
                </option>

                <option value="Commercial">
                  Commercial
                </option>

              </select>

            </div>

          </section>

          {/* ==============================
              RESULTS HEADER
          ============================== */}

          <section className="properties-results">

            <div>

              <span className="properties-results-label">
                AVAILABLE PROPERTIES
              </span>

              <h2>
                Explore our listings
              </h2>

            </div>

            <div className="properties-results-count">

              <strong>
                {filteredProperties.length}
              </strong>

              <span>
                {filteredProperties.length === 1
                  ? "property"
                  : "properties"}{" "}
                found
              </span>

            </div>

          </section>

          {/* ==============================
              CLEAR FILTERS
          ============================== */}

          {(searchTerm ||
            listingType !== "All" ||
            propertyType !== "All") && (

            <div className="properties-clear">

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear all filters
              </button>

            </div>

          )}

          {/* ==============================
              PROPERTY GRID
          ============================== */}

          {filteredProperties.length > 0 ? (

            <section className="properties-grid">

              {filteredProperties.map(
                (property) => (

                  <PropertyCard
                    key={
                      property._id ||
                      property.id
                    }
                    property={property}
                  />

                )
              )}

            </section>

          ) : (

            <section className="properties-empty">

              <div className="properties-empty-icon">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >

                  <path d="M3 10.5 12 3l9 7.5" />

                  <path d="M5 9.5V21h14V9.5" />

                  <path d="M9 21v-6h6v6" />

                </svg>

              </div>

              <h2>
                No properties found
              </h2>

              <p>
                Try adjusting your search or
                filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
              >
                Reset Search
              </button>

            </section>

          )}

          {/* ==============================
              BOTTOM CTA
          ============================== */}

          <section className="properties-bottom-cta">

            <div>

              <span>
                LOOKING FOR SOMETHING SPECIFIC?
              </span>

              <h2>
                Your next home might be
                <br />
                closer than you think.
              </h2>

            </div>

            <Link
              to="/"
              className="properties-cta-button"
            >
              Back to Home
            </Link>

          </section>

        </div>

      </main>

      {/* ==============================
          FOOTER
      ============================== */}

      <footer className="properties-footer">

        <div className="properties-footer-brand">

          Stay<span>Nest</span>

          <p>
            Find a place you'll love to come
            home to.
          </p>

        </div>

        <span>
          © 2026 StayNest. All rights reserved.
        </span>

      </footer>

    </div>
  );
}

export default Properties;