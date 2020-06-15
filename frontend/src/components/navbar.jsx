import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default function Navbar({ user }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">Darbu Paieska v1</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <NavLink className="nav-item nav-link" to="/jobs">Jobs</NavLink>
          {!user &&
            <>
              <NavLink className="nav-item nav-link" to="/login">Login</NavLink>
              <NavLink className="nav-item nav-link" to="/register">Register</NavLink>
            </>}
          {user &&
            <>
              <NavLink className="nav-item nav-link" to="/profile">{user.email}</NavLink>
              <NavLink className="nav-item nav-link" to="/logout">Logout</NavLink>
              <NavLink className="nav-item nav-link" to="/posts">Saved posts</NavLink>
            </>
          }
        </div>
      </div>
    </nav>
  )
}
