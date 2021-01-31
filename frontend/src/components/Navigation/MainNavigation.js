import React from "react";
import { NavLink, Link } from "react-router-dom";

import AuthContext from "../../context/auth-context";

import "./MainNavigation.css";

const mainNavigation = (props) => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <Link to="/">
              <h1>InstagramClone</h1>
            </Link>
          </div>
          <nav className="main-navigation__items">
            <ul>
              {!context.token && (
                <li>
                  <NavLink to="/auth">Authenticate</NavLink>
                </li>
              )}

              <li>
                <NavLink to="/timeline">Timeline</NavLink>
              </li>
              {context.token && (
                <>
                  <li>
                    <NavLink to="/saved">Saved</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
