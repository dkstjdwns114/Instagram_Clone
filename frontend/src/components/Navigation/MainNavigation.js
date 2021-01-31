import React from "react";
import { NavLink } from "react-router-dom";

import "./MainNavigation.css";

const mainNavigation = () => (
  <header className="main-navigation">
    <div className="main-navigation__logo">
      <h1>EasyEvent</h1>
    </div>
    <nav className="main-navigation__items">
      <ul>
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
        <li>
          <NavLink to="/timeline">Events</NavLink>
        </li>
        <li>
          <NavLink to="/saved">Bookings</NavLink>
        </li>
        <li>
          <button onClick={null}>Logout</button>
        </li>
      </ul>
    </nav>
  </header>
);

export default mainNavigation;
