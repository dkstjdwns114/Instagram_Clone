import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth";
import TimelinePage from "./pages/Timeline";
import ProfileDetail from "./pages/ProfileDetail";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";
import PostDetail from "./pages/PostDetail";

import TestPage from "./pages/Test";
import EditAccount from "./pages/EditAccount";

class App extends Component {
  state = {
    token: null,
    userId: null,
    userName: null
  };

  componentDidMount() {
    let token = localStorage.getItem("access_token");
    let userId = localStorage.getItem("userId");
    let userName = localStorage.getItem("userName");
    this.setState({ token: token, userId: userId, userName: userName });
  }

  login = (token, userId, tokenExpiration, userName) => {
    this.setState({ token: token, userId: userId, userName: userName });
    localStorage.setItem("access_token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);
  };

  logout = () => {
    this.setState({ token: null, userId: null });
    localStorage.removeItem("access_token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
  };

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            userName: this.state.userName,
            login: this.login,
            logout: this.logout
          }}
        >
          <MainNavigation />
          <Switch>
            {this.state.token && <Redirect from="/" to="/timeline" exact />}
            {this.state.token && <Redirect from="/auth" to="/timeline" exact />}
            {!this.state.token && <Route path="/auth" component={AuthPage} />}
            <Route path="/timeline" component={TimelinePage} />
            <Route path="/test" component={TestPage} />
            <Route path="/p/:id" component={PostDetail} />
            <Route path="/profile/:username" component={ProfileDetail} />
            <Route path="/accounts/edit" component={EditAccount} />
            {/* 로그인 안되어있을경우 튕겨내는 코드 */}
            {this.state.token && <></>}
            {this.state.token && <Route path="/test" component={TestPage} />}
            {!this.state.token && <Redirect to="/auth" exact />}
          </Switch>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
