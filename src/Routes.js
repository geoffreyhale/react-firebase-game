import React, { useContext } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import Scorekeeper from './components/Scorekeeper';
import IncrementalClickerGame from './components/Games/IncrementalClicker';
import Chess from './components/Games/Chess';
import TicTacToe from './components/Games/TicTacToe';
import Groups from './components/Groups';
import Post from './components/Post';
import Posts from './components/Posts';
import Admin from './components/Admin';
import { AppContext } from './components/AppProvider';

const Routes = () => {
  const { user } = useContext(AppContext);
  const location = useLocation();
  return (
    <Switch>
      {user
        ? [
            <Route exact path="/" key="/">
              <Posts />
            </Route>,
            <Route
              path="/incremental-clicker-game"
              key="/incremental-clicker-game"
            >
              <IncrementalClickerGame />
            </Route>,
            <Route path="/groups" key="/groups">
              <Groups />
            </Route>,
            <Route path="/tictactoe" key="/tictactoe">
              <TicTacToe />
            </Route>,
            <Route path="/chess" key="/chess">
              <Chess />
            </Route>,
            <Route path="/admin" key="/admin">
              <Admin />
            </Route>,
            // https://ui.dev/react-router-v4-pass-props-to-components/
            <Route
              path="/post/:postId"
              key={location.pathname}
              render={(props) => <Post {...props} />}
            />,
          ]
        : null}
      [
      <Route path="/scorekeeper" key="/scorekeeper">
        <Scorekeeper />
      </Route>
      ]
    </Switch>
  );
};

export default Routes;
