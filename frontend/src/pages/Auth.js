import React, { Component } from "react";

import "./css/Auth.css";
import AuthContext from "../context/auth-context";

class AuthPage extends Component {
  state = {
    isExist: false,
    isLogin: true,
    isWrong: false
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.nicknameEl = React.createRef();
  }

  switchModelHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
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

      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!, $username: String!) {
            createUser(userInput: {email: $email, password: $password, username: $username}) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password,
          username: username
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
        if (this.state.isLogin) {
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
      <form className="auth-form" onSubmit={this.submitHandler}>
        <h2>{this.state.isLogin ? "Login" : "Signup"}</h2>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        {!this.state.isLogin && (
          <div className="form-control">
            <label htmlFor="nickname">nickname</label>
            <input type="text" id="nickname" ref={this.nicknameEl} />
          </div>
        )}
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        {this.state.isExist && (
          <p className="redText">이미 존재하는 이메일 또는 닉네임 입니다.</p>
        )}
        {this.state.isWrong && (
          <p className="redText">아이디 또는 비밀번호를 확인하세요!</p>
        )}
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchModelHandler}>
            Switch to {this.state.isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
