import React, { useContext } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Scorekeeper from './components/Scorekeeper';
import IncrementalClickerGame from './components/Games/IncrementalClicker';
import Chess from './components/Games/Chess';
import TicTacToe from './components/Games/TicTacToe';
import Community from './components/Community';
import Groups from './components/Groups';
import PostPage from './components/PostPage';
import Posts from './components/Posts';
import Admin from './components/Admin';
import Sandbox from './components/Sandbox';
import About from './components/About';
import { AppContext } from './components/AppProvider';

const Routes = () => {
  const { user } = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();

  if (location.pathname === '/') {
    history.push('/posts');
  }

  return (
    <Switch>
      {user
        ? [
            // <Route exact path="/" key="/">

            // </Route>,
            <Route path="/posts" key="/posts">
              <Posts />
            </Route>,
            <Route path="/about" key="/about">
              <About />
            </Route>,
            <Route path="/Community" key="/Community">
              <Community />
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
              render={(props) => <PostPage {...props} />}
            />,
          ]
        : null}
      [
      <Route path="/scorekeeper" key="/scorekeeper">
        <Scorekeeper />
      </Route>
      ,
      <Route path="/sandbox" key="/sandbox">
        <Sandbox />
      </Route>
      , ]
    </Switch>
  );
};

export default Routes;
