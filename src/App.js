import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Welcome from "./components/Welcome/Welcome";
import Login from "./container/LoginContainer/Login";
import MoneyContainer from "./container/MoneyContainer/MoneyContainer";
import FormContainer from "./container/MoneyContainer/FormContainter/PassbookForm";
import DetailContainer from './container/MoneyContainer/DetailContainer/PassbookDetail';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Welcome} />
        <Route path="/login" exact component={Login} />
        <Route path="/home" exact component={MoneyContainer} />
        <Route path="/form" exact component={FormContainer} />
        <Route path="/detail" exact component={DetailContainer} />
      </Switch>
    );
  }
}

export default App;
