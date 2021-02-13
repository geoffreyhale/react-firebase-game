import React from 'react';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Tabs from 'react-bootstrap/Tabs';
import friendlyTimestamp from '../../shared/friendlyTimestamp';
import { AppContext } from '../../AppProvider';
import { getPosts, getUsersRealtimeDatabase } from '../../../api/index';
import getMillisFromDifferingTypes from '../../shared/getMillisFromDifferingTypes';
import Spinner from '../../shared/Spinner';
import { isPremium, User } from '../../shared/User';
import Accounting from './Accounting';
import Funnel from './Funnel';
import Posts from './Posts';

export default class Admin extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: {},
      users: {},
      sortKey: 'lastOnline',
    };
  }

  static contextType = AppContext;
  user = () => this.context.user;
  users = () => this.context.users;

  componentDidMount() {
    // lastOnline lives in realtime database
    getUsersRealtimeDatabase((users) => {
      this.setState({
        users,
      });
    });
    getPosts((posts) => {
      this.setState({ posts });
    });
  }

  sort(propertyName) {
    this.setState({
      sortKey: propertyName,
    });
  }

  render() {
    if (!this.user() || !this.users()) {
      return <Spinner />;
    }
    if (!this.user().admin) {
      return <>Access Denied</>;
    }

    const users = this.users();

    // merge lastOnline from state
    Object.entries(users).forEach(([key, user]) => {
      if (this.state.users && this.state.users[user.uid]) {
        users[key].lastOnline = this.state.users[user.uid].lastOnline;
      }
    });

    Object.values(users).forEach((user) => {
      if (users[user.uid]) {
        // TODO in db: convert joined to object type
        users[user.uid].joined = getMillisFromDifferingTypes(
          users[user.uid].joined
        );
        // TODO in db: delete number/string lastLogins from db, only keep object versions; or convert
        users[user.uid].lastLogin = getMillisFromDifferingTypes(
          users[user.uid].lastLogin
        );
        users[user.uid].isPremium = isPremium({
          premium: users[user.uid].premium,
        });
      }
    });

    const usersArray = Object.values(users);

    const sortKey = this.state.sortKey;
    if (sortKey) {
      usersArray.sort((a, b) => {
        if (!a[sortKey]) {
          return 1;
        }
        if (!b[sortKey]) {
          return -1;
        }
        if (typeof a[sortKey] === 'string') {
          return a[sortKey].localeCompare(b[sortKey]);
        }
        if (typeof a[sortKey] === 'number') {
          return b[sortKey] - a[sortKey];
        }
      });
    }

    return (
      <Card>
        <Card.Body>
          <Card.Title>Admin Dashboard</Card.Title>
          <div style={{ display: 'inline-block' }} className="mb-3">
            <Posts posts={this.state.posts} />
          </div>
          <Tabs defaultActiveKey="users" className="mb-3">
            <Tab eventKey="users" title="Users">
              <Card className={'mt-3'}>
                <Card.Body>
                  <Funnel usersArray={usersArray} />
                </Card.Body>
              </Card>
              <Card className={'mt-3'}>
                <Card.Body>
                  <Table bordered hover size="sm">
                    <thead>
                      <tr>
                        <td onClick={() => this.sort('uid')}>uid</td>
                        <td onClick={() => this.sort('displayName')}>
                          displayName
                        </td>
                        <td onClick={() => this.sort('email')}>email</td>
                        <td onClick={() => this.sort('lastOnline')}>
                          lastOnline
                        </td>
                        <td onClick={() => this.sort('lastLogin')}>
                          lastLogin
                        </td>
                        <td onClick={() => this.sort('joined')}>joined</td>
                      </tr>
                    </thead>
                    <tbody>
                      {usersArray.map((user) => {
                        return (
                          <tr key={user.uid}>
                            <td>{user.uid}</td>
                            <td>
                              <User
                                uid={user.uid}
                                displayName={user.displayName}
                              />
                            </td>
                            <td>{user.email}</td>
                            <td>{friendlyTimestamp(user.lastOnline)}</td>
                            <td>{friendlyTimestamp(user.lastLogin)}</td>
                            <td>{friendlyTimestamp(user.joined)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="posts" title="Posts">
              <Posts posts={this.state.posts} />
            </Tab>
            <Tab eventKey="accounting" title="Accounting">
              <Accounting users={this.state.users} />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    );
  }
}
