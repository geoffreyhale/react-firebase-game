import React from 'react';
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
        <ListPage />
      </Route>
      <Route path={`${path}/:groupId`}>
        <GroupPage />
      </Route>
    </Switch>
  );
};

export default GroupsRouter;
