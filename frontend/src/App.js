import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import MainNavigation from "./components/Navigation/MainNavigation";

import "./App.css";

import AuthPage from "./pages/Auth";
import TimelinePage from "./pages/Timeline";
import SavedPage from "./pages/Saved";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/timeline" component={TimelinePage} />
            <Route path="/saved" component={SavedPage} />
          </Switch>
        </main>
      </BrowserRouter>
    );
  }
}

export default App;
