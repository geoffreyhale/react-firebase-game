import React from 'react';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { AppContext } from '../../AppProvider';
import {
  getAccounting,
  getPosts,
  getUsersRealtimeDatabase,
} from '../../../api/index';
import getMillisFromDifferingTypes from '../../shared/getMillisFromDifferingTypes';
import Spinner from '../../shared/Spinner';
import { isPremium } from '../../shared/User';
import Accounting, { AccountingMiniCard } from './Accounting';
import Funnel from './Funnel';
import { PostsMiniCard, PostsPerDay } from './Posts';
import { Users, UsersTable } from './Users';

export default class Admin extends React.Component {
  constructor() {
    super();
    this.state = {
      accounting: {},
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
    getAccounting((accounting) =>
      this.setState({
        accounting,
      })
    );
  }

  sort(propertyName) {
    this.setState({
      sortKey: propertyName,
    });
  }

  render() {
    if (!this.user() || !this.users()) {
      return <Spinner size="lg" />;
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
      <Card className="mt-3">
        <Card.Body>
          <Card.Title>Admin</Card.Title>
          <Tabs defaultActiveKey="overview" className="my-3">
            <Tab eventKey="overview" title="Overview">
              <div style={{ display: 'inline-block' }}>
                <Card>
                  <Card.Body>
                    <Card.Title>Users</Card.Title>
                    <Users usersArray={usersArray} posts={this.state.posts} />
                  </Card.Body>
                </Card>
              </div>
              <div className="ml-3" style={{ display: 'inline-block' }}>
                <Card>
                  <Card.Body>
                    <Card.Title>Posts</Card.Title>
                    <PostsMiniCard posts={this.state.posts} />
                  </Card.Body>
                </Card>
              </div>
              <div className="ml-3" style={{ display: 'inline-block' }}>
                <Card>
                  <Card.Body>
                    <Card.Title>Accounting</Card.Title>
                    <AccountingMiniCard
                      accounting={this.state.accounting}
                      users={this.state.users}
                    />
                  </Card.Body>
                </Card>
              </div>
            </Tab>
            <Tab eventKey="users" title="Users">
              <Card className={'mt-3'}>
                <Card.Body>
                  <Card.Title>Users</Card.Title>
                  <Users usersArray={usersArray} posts={this.state.posts} />
                </Card.Body>
              </Card>
              <Card className={'mt-3'}>
                <Card.Body>
                  <Funnel usersArray={usersArray} posts={this.state.posts} />
                </Card.Body>
              </Card>
              <Card className={'mt-3'}>
                <Card.Body>
                  <UsersTable
                    setSort={(propertyName) => this.sort(propertyName)}
                    usersArray={usersArray}
                  />
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="posts" title="Posts">
              <Card className={'mt-3'}>
                <Card.Body>
                  <Card.Title>Posts</Card.Title>
                  <PostsMiniCard posts={this.state.posts} />
                </Card.Body>
              </Card>
              <div className={'mt-3'}>
                <PostsPerDay posts={this.state.posts} />
              </div>
            </Tab>
            <Tab eventKey="accounting" title="Accounting">
              <Card className={'mt-3'}>
                <Card.Body>
                  <Card.Title>Accounting</Card.Title>
                  <AccountingMiniCard
                    accounting={this.state.accounting}
                    users={this.state.users}
                  />
                </Card.Body>
              </Card>
              <div className={'mt-3'}>
                <Accounting
                  accounting={this.state.accounting}
                  users={this.state.users}
                />
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    );
  }
}
