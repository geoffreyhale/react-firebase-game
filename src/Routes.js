import React from 'react';
import { Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Scorekeeper from './components/Scorekeeper';
import Game from './components/Game';
import Groups from './components/Groups';
import Home from './components/Home';

const Routes = ({ user }) => {
  return (
    <Switch>
      {user
        ? [
            <Route exact path="/" key="/">
              <Home />
            </Route>,
            <Route path="/game" key="game">
              <Game />
            </Route>,
            <Route path="/groups" key="groups">
              <Groups />
            </Route>,
          ]
        : null}
      [
      <Route path="/scorekeeper" key="scorekeeper">
        <Scorekeeper />
      </Route>
      ]
    </Switch>
  );
};

export default Routes;
