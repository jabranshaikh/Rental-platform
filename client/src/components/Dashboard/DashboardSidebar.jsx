import { NavLink } from "react-router-dom";

import "./DashboardSidebar.css";

function DashboardSidebar() {
  return (
    <aside className="dashboard-sidebar">
      {/* BRAND */}
      <div className="dashboard-sidebar-brand">
        Stay<span>Nest</span>
      </div>

      {/* MY ACCOUNT */}
      <div className="dashboard-sidebar-label">
        MY ACCOUNT
      </div>

      <nav className="dashboard-sidebar-nav">
        {/* DASHBOARD */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "dashboard-nav-link active"
              : "dashboard-nav-link"
          }
          end
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

          <span>Dashboard</span>
        </NavLink>

        {/* SAVED PROPERTIES */}
        <NavLink
          to="/dashboard/saved"
          className={({ isActive }) =>
            isActive
              ? "dashboard-nav-link active"
              : "dashboard-nav-link"
          }
        >
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

          <span>Saved Properties</span>
        </NavLink>

        {/* MY REQUESTS */}
        <NavLink
          to="/dashboard/requests"
          className={({ isActive }) =>
            isActive
              ? "dashboard-nav-link active"
              : "dashboard-nav-link"
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2h12a2 2 0 0 1 2 2v16l-8-4-8 4V4a2 2 0 0 1 2-2Z" />
          </svg>

          <span>My Requests</span>
        </NavLink>
      </nav>

      {/* DIVIDER */}
      <div className="dashboard-sidebar-divider" />

      {/* EXPLORE */}
      <div className="dashboard-sidebar-label">
        EXPLORE
      </div>

      <nav className="dashboard-sidebar-nav">
        {/* BROWSE PROPERTIES */}
        <NavLink
          to="/properties"
          className="dashboard-nav-link"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
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

          <span>Browse Properties</span>
        </NavLink>
      </nav>

      {/* BOTTOM HELP */}
      <div className="dashboard-sidebar-bottom">
        <div className="dashboard-help">
          <div className="dashboard-help-icon">
            ?
          </div>

          <div>
            <strong>Need help?</strong>

            <p>
              We're here for you.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default DashboardSidebar;