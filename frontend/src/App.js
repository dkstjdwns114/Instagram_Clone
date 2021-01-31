import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth";
import TimelinePage from "./pages/Timeline";
import SavedPage from "./pages/Saved";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";

import "./App.css";

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  componentDidMount() {
    let token = localStorage.getItem("access_token");
    let userId = localStorage.getItem("userId");
    this.setState({ token: token, userId: userId });
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
    localStorage.setItem("access_token", token);
    localStorage.setItem("userId", userId);
  };

  logout = () => {
    this.setState({ token: null, userId: null });
    localStorage.removeItem("access_token");
    localStorage.removeItem("userId");
  };

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {this.state.token && <Redirect from="/" to="/timeline" exact />}
              {this.state.token && (
                <Redirect from="/auth" to="/timeline" exact />
              )}
              {!this.state.token && <Route path="/auth" component={AuthPage} />}
              <Route path="/timeline" component={TimelinePage} />
              {this.state.token && (
                <Route path="/saved" component={SavedPage} />
              )}
              {!this.state.token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
