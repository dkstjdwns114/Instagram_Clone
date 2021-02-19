import React from "react";
import { NavLink, Link } from "react-router-dom";

import AuthContext from "../../context/auth-context";

import "./MainNavigation.css";

const mainNavigation = (props) => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header className="header">
          <div className="header_wrap">
            <div className="inner">
              <h1 className="logo">
                <span>로고</span>
                <Link to="/">
                  <img
                    src="https://res.cloudinary.com/anstagram123/image/upload/v1613730289/anstagram/AnstagramLogo_uvski8.png"
                    alt="main_logo"
                  />
                </Link>
              </h1>
              <div className="input_box">
                <input type="text" placeholder="검색" id="search" />
              </div>
              <nav className="nav">
                <ul className="link_list">
                  <li>
                    <Link to="/">
                      <i className="fas fa-compass"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="/">
                      <i className="fas fa-heart"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to={"/profile/" + context.userName}>
                      <i className="fas fa-user-circle"></i>
                    </Link>
                  </li>
                  {context.token ? (
                    <li>
                      <button onClick={context.logout}>Logout</button>
                    </li>
                  ) : (
                    <li>
                      <NavLink to="/auth">Authenticate</NavLink>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
