import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import ListPage from './ListPage';
import GroupPage from './GroupPage';

const GroupsRouter = ({ user }) => {
  // The `path` lets us build <Route> paths that are
  // relative to the parent route, while the `url` lets
  // us build relative links.
  let { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <ListPage user={user} />
      </Route>
      <Route path={`${path}/:groupId`}>
        <GroupPage user={user} />
      </Route>
    </Switch>
  );
};

export default GroupsRouter;
