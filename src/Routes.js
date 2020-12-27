import React from 'react';
import { Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Game from './components/Game';

const Routes = () => {
  return (
    <Switch>
      <Route path="/game">
        <Game />
      </Route>
    </Switch>
  );
};

export default Routes;
