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
                <span>로고z</span>
                <Link to="login.html">
                  <img
                    src="./img/1600px-Instagram_logo.svg.png"
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
                    <Link to="">
                      <i className="fas fa-compass"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="">
                      <i className="fas fa-heart"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="">
                      <i className="fas fa-user-circle"></i>
                    </Link>
                  </li>
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
