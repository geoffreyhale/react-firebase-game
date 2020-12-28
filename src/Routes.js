import React from 'react';
import { Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Game from './components/Game';
import Groups from './components/Groups';
import Home from './components/Home';

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/game">
        <Game />
      </Route>
      <Route path="/groups">
        <Groups />
      </Route>
    </Switch>
  );
};

export default Routes;
