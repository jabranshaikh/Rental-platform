import { Link } from "react-router-dom";

import DashboardSidebar from "../../components/Dashboard/DashboardSidebar";

import { useRequests } from "../../context/RequestsContext";

import "./MyRequests.css";

function MyRequests() {
  const {
    requests,
    removeRequest,
    clearRequests,
  } = useRequests();

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

  return (
    <div className="my-requests-page">
      <DashboardSidebar />

      <main className="my-requests-main">
        {/* HEADER */}
        <header className="my-requests-header">
          <div>
            <p className="my-requests-eyebrow">
              YOUR ACTIVITY
            </p>

            <h1>My Requests</h1>

            <p className="my-requests-description">
              Keep track of your property viewing and
              contact requests.
            </p>
          </div>

          <Link
            to="/properties"
            className="my-requests-browse-button"
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

        {/* TOOLBAR */}
        <div className="my-requests-toolbar">
          <div>
            <strong>{requests.length}</strong>

            <span>
              {requests.length === 1
                ? " Request"
                : " Requests"}
            </span>
          </div>

          {requests.length > 0 && (
            <button
              type="button"
              onClick={clearRequests}
              className="clear-requests-button"
            >
              Clear All
            </button>
          )}
        </div>

        {/* REQUESTS */}
        {requests.length > 0 ? (
          <div className="requests-list">
            {requests.map((request) => (
              <article
                className="request-card"
                key={request.id}
              >
                {/* ICON */}
                <div className="request-card-icon">
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

                {/* CONTENT */}
                <div className="request-card-content">
                  <div className="request-card-top">
                    <div>
                      <span className="request-type">
                        {request.type ||
                          "Property Request"}
                      </span>

                      <h2>
                        {request.title}
                      </h2>
                    </div>

                    <span
                      className={`request-status ${request.status
                        ?.toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  {/* PROPERTY */}
                  <p className="request-property">
                    {request.propertyTitle}
                  </p>

                  {/* LOCATION */}
                  {request.location && (
                    <div className="request-location">
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
                        {request.location}
                      </span>
                    </div>
                  )}

                  {/* VISIT DETAILS */}
                  {request.type ===
                    "Property Viewing" && (
                    <div className="request-visit-details">
                      <div className="request-detail-box">
                        <span className="request-detail-label">
                          PREFERRED DATE
                        </span>

                        <strong>
                          {formatDate(
                            request.preferredDate
                          )}
                        </strong>
                      </div>

                      <div className="request-detail-box">
                        <span className="request-detail-label">
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

                  {/* MESSAGE */}
                  {request.message && (
                    <div className="request-message">
                      <span className="request-detail-label">
                        MESSAGE
                      </span>

                      <p>
                        {request.message}
                      </p>
                    </div>
                  )}

                  {/* FOOTER */}
                  <div className="request-card-footer">
                    <span className="request-date">
                      Submitted{" "}
                      {formatDate(
                        request.createdAt
                      )}
                    </span>

                    <button
                      type="button"
                      className="remove-request-button"
                      onClick={() =>
                        removeRequest(request.id)
                      }
                    >
                      Cancel Request
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="requests-empty-state">
            <div className="requests-empty-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16v16H4z" />
                <path d="M8 8h8" />
                <path d="M8 12h8" />
                <path d="M8 16h5" />
              </svg>
            </div>

            <h2>No requests yet</h2>

            <p>
              When you contact an owner or schedule a
              property visit, your requests will appear
              here.
            </p>

            <Link
              to="/properties"
              className="requests-empty-button"
            >
              Explore Properties
            </Link>
          </div>
        )}

        {/* FOOTER */}
        <footer className="my-requests-footer">
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

export default MyRequests;