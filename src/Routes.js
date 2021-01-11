import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Scorekeeper from './components/Scorekeeper';
import IncrementalClickerGame from './components/Games/IncrementalClicker';
import TicTacToe from './components/Games/TicTacToe';
import Groups from './components/Groups';
import Post from './components/Post';
import Posts from './components/Posts';
import Admin from './components/Admin';

const Routes = ({ user }) => {
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
              <IncrementalClickerGame user={user} />
            </Route>,
            <Route path="/groups" key="/groups">
              <Groups user={user} />
            </Route>,
            <Route path="/tictactoe" key="/tictactoe">
              <TicTacToe user={user} />
            </Route>,
            <Route path="/admin" key="/admin">
              <Admin />
            </Route>,
            // https://ui.dev/react-router-v4-pass-props-to-components/
            <Route
              path="/post/:postId"
              key="/post"
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
