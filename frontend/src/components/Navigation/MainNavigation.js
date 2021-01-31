import React from "react";
import { NavLink, Link } from "react-router-dom";

import "./MainNavigation.css";

const mainNavigation = () => (
  <header className="main-navigation">
    <div className="main-navigation__logo">
      <Link to="/">
        <h1>InstagramClone</h1>
      </Link>
    </div>
    <nav className="main-navigation__items">
      <ul>
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
        <li>
          <NavLink to="/timeline">Timeline</NavLink>
        </li>
        <li>
          <NavLink to="/saved">Saved</NavLink>
        </li>
        <li>
          <button onClick={null}>Logout</button>
        </li>
      </ul>
    </nav>
  </header>
);

export default mainNavigation;
