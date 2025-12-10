import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold text-primary">CourseMatch</span>

        <ul className="navbar-nav ms-auto d-flex flex-row">
          {/* ----------- NOT LOGGED IN ----------- */}
          {!user && (
            <>
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item mx-2">
                <Link className="nav-link" to="/about">
                  About Us
                </Link>
              </li>

              <li className="nav-item dropdown mx-2">
                <button
                  className="btn btn-link nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Account
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/login">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/register">
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </li>
            </>
          )}

          {/* ----------- LOGGED IN ----------- */}
          {user && (
            <>
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/add-subjects">
                  Add Subjects
                </Link>
              </li>

              <li className="nav-item mx-2">
                <Link className="nav-link" to="/my-subjects">
                  View Subjects
                </Link>
              </li>

              <li className="nav-item mx-2">
                <Link className="nav-link" to="/view-courses">
                  View Courses
                </Link>
              </li>

              <li className="nav-item mx-2">
                <Link className="nav-link" to="/add-profile">
                  Add Profile
                </Link>
              </li>

              <li className="nav-item mx-2">
                <button
                  className="btn btn-link nav-link"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
