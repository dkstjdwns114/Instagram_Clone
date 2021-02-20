import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

import AuthContext from "../../context/auth-context";
import Backdrop from "../Backdrop/Backdrop";
import Modal from "../Modal/Modal";

import "./MainNavigation.css";

const mainNavigation = (props) => {
  return (
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
                      <label className="icons-button" htmlFor="create-media">
                        <span className="icon5"></span>
                      </label>
                      <Link to="/" className="icons-button">
                        <span className="icon6"></span>
                      </Link>
                      <span className="icons-button">
                        <span className="icon7">
                          <div className="select-box">
                            <div className="select-box__current" tabIndex="1">
                              <div className="select-box__value">
                                <input
                                  className="select-box__input"
                                  type="radio"
                                  defaultChecked
                                />
                                <p className="select-box__input-text"></p>
                              </div>
                            </div>
                            <ul className="select-box__list">
                              {context.token ? (
                                <>
                                  <Link to={"/profile/" + context.userName}>
                                    <li>
                                      <label
                                        className="select-box__option"
                                        aria-hidden="aria-hidden"
                                      >
                                        프로필
                                      </label>
                                    </li>
                                  </Link>
                                  <li onClick={context.logout}>
                                    <label
                                      className="select-box__option"
                                      aria-hidden="aria-hidden"
                                    >
                                      로그아웃
                                    </label>
                                  </li>
                                </>
                              ) : (
                                <Link to="/auth">
                                  <li>
                                    <label
                                      className="select-box__option"
                                      aria-hidden="aria-hidden"
                                    >
                                      로그인
                                    </label>
                                  </li>
                                </Link>
                              )}
                            </ul>
                          </div>
                        </span>
                      </span>
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
};

export default mainNavigation;
