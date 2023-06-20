import React, { useEffect } from "react"
import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <nav className="navbar">
        <div className="logo">TMS</div>

        <ul className="nav-links">

          <div className="menu">
            <li>
              <Link to="/">User management page</Link>
            </li>
            <li>
              <Link to="/">Profile</Link>
            </li>

            <li>
              <Link to="/">Logout</Link>
            </li>
            <li>
              <Link to="/">Login</Link>
            </li>
          </div>
        </ul>
      </nav>
    </>
  );
}

export default Header