import React, { Component } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../context/auth-context";

import "./css/Reset.css";
import "./css/Common.css";
import "./css/Auth.css";

const signupStyle = {
  height: "600px"
};

class AuthPage extends Component {
  state = {
    isExist: false,
    isLogin: true,
    isWrong: false,
    isActiveBtn: false
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.nicknameEl = React.createRef();
    this.fullnameEl = React.createRef();
  }

  redColorInputOnChangeHandler = () => {
    this.removeRedText();
    this.isActiveBtnSetHandler();
  };

  isActiveBtnSetHandler = () => {
    if (
      this.state.isLogin &&
      this.emailEl.current.value === "" &&
      this.passwordEl.current.value === ""
    ) {
      this.setState({ isActiveBtn: false });
      return;
    }
    if (
      this.state.isLogin &&
      this.emailEl.current.value !== "" &&
      this.passwordEl.current.value !== ""
    ) {
      this.setState({ isActiveBtn: true });
      return;
    }
    if (
      !this.state.isLogin &&
      this.emailEl.current.value === "" &&
      this.passwordEl.current.value === "" &&
      this.nicknameEl.current.value === "" &&
      this.fullnameEl.current.value === ""
    ) {
      this.setState({ isActiveBtn: true });
      return;
    }
    if (
      !this.state.isLogin &&
      this.emailEl.current.value !== "" &&
      this.passwordEl.current.value !== "" &&
      this.nicknameEl.current.value !== "" &&
      this.fullnameEl.current.value !== ""
    ) {
      this.setState({ isActiveBtn: true });
      return;
    }
  };

  switchModelHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  removeRedText = () => {
    this.setState({ isWrong: false, isExist: false });
  };

  submitHandler = (e) => {
    e.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
            userName
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    };

    if (!this.state.isLogin) {
      const username = this.nicknameEl.current.value
        .toLowerCase()
        .replaceAll(" ", "");

      const full_name = this.fullnameEl.current.value
        .toLowerCase()
        .replaceAll(" ", "");

      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!, $username: String!, $full_name: String!) {
            createUser(userInput: {email: $email, password: $password, username: $username, full_name: $full_name}) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password,
          username: username,
          full_name: full_name
        }
      };
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          this.setState({ isWrong: true });
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.createUser === null) {
          this.setState({ isExist: true });
          return;
        }
        this.setState({ isLogin: true });
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration,
            resData.data.login.userName
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="wrap">
        <div className="container">
          <div
            className="login_inner"
            style={this.state.isLogin ? null : signupStyle}
          >
            <header className="login_header">
              <h1>
                <span className="header_tit">로고</span>
                <Link to="#" className="page_move">
                  <img
                    src="https://res.cloudinary.com/anstagram123/image/upload/v1613730289/anstagram/AnstagramLogo_uvski8.png"
                    alt="main_logo"
                  />
                </Link>
              </h1>
            </header>

            <form className="login_form" onSubmit={this.submitHandler}>
              <div className="input_box">
                <input
                  id="email"
                  type="email"
                  placeholder="이메일"
                  ref={this.emailEl}
                  onChange={this.redColorInputOnChangeHandler}
                />
              </div>
              {!this.state.isLogin && (
                <>
                  <div className="input_box">
                    <input
                      type="text"
                      id="full_name"
                      ref={this.fullnameEl}
                      placeholder="성명"
                      onChange={this.isActiveBtnSetHandler}
                    />
                  </div>
                  <div className="input_box">
                    <input
                      type="text"
                      id="nickname"
                      placeholder="닉네임"
                      ref={this.nicknameEl}
                      onChange={this.redColorInputOnChangeHandler}
                    />
                  </div>
                </>
              )}
              <div className="input_box">
                <input
                  id="password"
                  type="password"
                  placeholder="비밀번호"
                  ref={this.passwordEl}
                  onChange={this.redColorInputOnChangeHandler}
                />
              </div>
              {this.state.isWrong && this.state.isLogin && (
                <div className="alt_text">
                  <span>아이디 또는 비밀번호를 확인하세요</span>
                </div>
              )}
              {this.state.isExist && !this.state.isLogin && (
                <p className="alt_text">
                  이미 존재하는 이메일 또는 닉네임 입니다.
                </p>
              )}
              {this.state.isLogin && this.state.isActiveBtn && (
                <div className="button_box">
                  <button type="submit" className="active-btn">
                    <span>로그인</span>
                  </button>
                </div>
              )}
              {this.state.isLogin && !this.state.isActiveBtn && (
                <div className="button_box">
                  <button type="submit" className="btn" disabled="disabled">
                    <span>로그인</span>
                  </button>
                </div>
              )}
              {!this.state.isLogin && this.state.isActiveBtn && (
                <div className="button_box">
                  <button type="submit" className="active-btn">
                    <span>회원가입</span>
                  </button>
                </div>
              )}
              {!this.state.isLogin && !this.state.isActiveBtn && (
                <div className="button_box">
                  <button type="submit" className="btn" disabled="disabled">
                    <span>회원가입</span>
                  </button>
                </div>
              )}
            </form>
            <div className="password_forget">
              {this.state.isLogin ? (
                <span className="hover-link" onClick={this.switchModelHandler}>
                  회원가입
                </span>
              ) : (
                <span className="hover-link" onClick={this.switchModelHandler}>
                  로그인
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AuthPage;
