import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Scorekeeper from './components/Scorekeeper';
import Game from './components/Games/Game';
import Groups from './components/Groups';
import Posts from './components/Posts';

const Routes = ({ user }) => {
  return (
    <Switch>
      {user
        ? [
            <Route exact path="/" key="/">
              <Posts user={user} />
            </Route>,
            <Route path="/game" key="game">
              <Game user={user} />
            </Route>,
            <Route path="/groups" key="groups">
              <Groups user={user} />
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
