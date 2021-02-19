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
                <div className="social-icons header-social-icons">
                  <section className="icons-section">
                    <Link to="/" className="icons-button">
                      <span className="home"></span>
                    </Link>
                    <Link to="/" className="icons-button">
                      <span className="icon5"></span>
                    </Link>
                    <Link to="/" className="icons-button">
                      <span className="icon6"></span>
                    </Link>
                    <Link to="/" className="icons-button">
                      <span className="icon7"></span>
                    </Link>
                  </section>
                </div>
              </nav>
            </div>
          </div>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
