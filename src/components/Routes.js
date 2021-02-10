import React, { useContext } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Scorekeeper from './views/Scorekeeper';
import IncrementalClickerGame from './views/Games/IncrementalClicker';
import Chess from './views/Games/Chess';
import TicTacToe from './views/Games/TicTacToe';
import Community from './views/Community';
import Admin from './views/Admin';
import Sandbox from './views/Sandbox';
import About from './views/About';
import Rooms from './views/Rooms';
import { AppContext } from './AppProvider';
import Page from './Page';
import UserProfile from './views/UserProfile';

const Routes = () => {
  const { user } = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();

  // redirect old post links to general post link
  if (location.pathname.startsWith('/posts/')) {
    history.push('/r/general' + location.pathname);
  }

  return (
    <Switch>
      {user && user.admin && (
        <Route
          path="/admin"
          key="/admin"
          render={(props) => (
            <Page title="Admin | xBook">
              <Admin {...props} />
            </Page>
          )}
        />
      )}
      {user && [
        <Route
          exact
          path="/"
          key={location.pathname}
          render={(props) => (
            <Page title="xBook">
              <Rooms {...props} />
            </Page>
          )}
        />,
        <Route
          exact
          path="/r/:roomId"
          key={location.pathname}
          render={(props) => (
            <Page>
              <Rooms {...props} />
            </Page>
          )}
        />,
        <Route
          path="/r/:roomId/posts/:postId"
          key={location.pathname}
          render={(props) => (
            //TODO title = post author's display name (like fb) ?
            <Page title="xBook">
              <Rooms {...props} />
            </Page>
          )}
        />,
        <Route
          path="/u/:userId"
          key={location.pathname}
          render={(props) => (
            <Page>
              <UserProfile {...props} />
            </Page>
          )}
        />,
        <Route
          path="/community"
          key="/community"
          render={(props) => (
            <Page title="Community | xBook">
              <Community {...props} />
            </Page>
          )}
        />,
        <Route
          path="/incremental-clicker-game"
          key="/incremental-clicker-game"
          render={(props) => (
            <Page title="Incremental Clicker Game | xBook">
              <IncrementalClickerGame {...props} />
            </Page>
          )}
        />,
        <Route
          path="/tictactoe"
          key="/tictactoe"
          render={(props) => (
            <Page title="Pente | xBook">
              <TicTacToe {...props} />
            </Page>
          )}
        />,
        <Route
          path="/chess"
          key="/chess"
          render={(props) => (
            <Page title="Chess | xBook">
              <Chess {...props} />
            </Page>
          )}
        />,
        <Route
          path="/scorekeeper"
          key="/scorekeeper"
          render={(props) => (
            <Page title="Score Keeper | xBook">
              <Scorekeeper {...props} />
            </Page>
          )}
        />,
      ]}
      [
      <Route
        path="/about"
        key="/about"
        render={(props) => (
          <Page title="About | xBook">
            <About {...props} />
          </Page>
        )}
      />
      ,
      <Route
        path="/sandbox"
        key="/sandbox"
        render={(props) => (
          <Page title="Sandbox | xBook">
            <Sandbox {...props} />
          </Page>
        )}
      />
      ,]
    </Switch>
  );
};

export default Routes;
