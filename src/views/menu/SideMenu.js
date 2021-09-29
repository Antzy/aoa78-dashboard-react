import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { REQUEST_STATUS } from "../../Common/constants";
import { signOut } from "../../models/firebase";
import styles from "./dashboard.css";

import "bootstrap-icons/font/bootstrap-icons.css";

export default function SideMenu() {
  const renderMenuItem = (title, path, iconClass) => {
    return (
      <li className="nav-item">
        <NavLink to={path} exact={true} className="nav-link">
          <span className="feather feather-home" style={{ fontSize: "1rem" }}>
            <i className={iconClass}></i>
          </span>
          {title}
        </NavLink>
      </li>
    );
  };

  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Request Status</span>
        </h6>
        <ul className="nav flex-column">
          {renderMenuItem(
            REQUEST_STATUS.PENDING_APPROVAL,
            "/pending-approval",
            "bi bi-file-earmark-plus"
          )}
          {renderMenuItem(
            REQUEST_STATUS.IN_PROGRESS,
            "/in-progress",
            "bi bi-file-earmark-medical"
          )}
          {renderMenuItem(
            REQUEST_STATUS.COMPLETED,
            "/completed",
            "bi bi-file-earmark-check"
          )}
          {renderMenuItem(
            REQUEST_STATUS.REJECTED,
            "/rejected",
            "bi bi-file-earmark-x"
          )}
        </ul>
        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Search</span>
        </h6>
        <ul className="nav flex-column">
          {renderMenuItem("Search Requests", "/requests-search", "bi bi-search")}
        </ul>
      </div>
    </nav>
  );
}
