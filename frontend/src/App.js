import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";

import AuthPage from "./pages/Auth";
import TimelinePage from "./pages/Timeline";
import SavedPage from "./pages/Saved";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Redirect from="/" to="/auth" exact />
          <Route path="/auth" component={AuthPage} />
          <Route path="/timeline" component={TimelinePage} />
          <Route path="/saved" component={SavedPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
