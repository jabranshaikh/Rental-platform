import { useSavedProperties } from "../../context/SavedPropertiesContext";
import { useRecentlyViewed } from "../../context/RecentlyViewedContext";
import { useRequests } from "../../context/RequestsContext";

import "./DashboardStats.css";

function DashboardStats() {
  const { savedProperties } =
    useSavedProperties();

  const { recentlyViewed } =
    useRecentlyViewed();

  const { requests } =
    useRequests();

  return (
    <div className="dashboard-stats">
      {/* SAVED PROPERTIES */}
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.8 8.7c0 5.2-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
          </svg>
        </div>

        <div>
          <span className="dashboard-stat-label">
            SAVED PROPERTIES
          </span>

          <strong className="dashboard-stat-value">
            {savedProperties.length}
          </strong>

          <p>Properties you've saved</p>
        </div>
      </div>

      {/* RECENTLY VIEWED */}
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle
              cx="12"
              cy="12"
              r="3"
            />
          </svg>
        </div>

        <div>
          <span className="dashboard-stat-label">
            RECENTLY VIEWED
          </span>

          <strong className="dashboard-stat-value">
            {recentlyViewed.length}
          </strong>

          <p>Properties you've viewed</p>
        </div>
      </div>

      {/* MY REQUESTS */}
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 3h12v18H6z" />
            <path d="M9 7h6" />
            <path d="M9 11h6" />
            <path d="M9 15h4" />
          </svg>
        </div>

        <div>
          <span className="dashboard-stat-label">
            MY REQUESTS
          </span>

          <strong className="dashboard-stat-value">
            {requests.length}
          </strong>

          <p>Active rental requests</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;