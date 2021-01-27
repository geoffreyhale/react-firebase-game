import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import friendlyTimestamp from '../shared/friendlyTimestamp';
import { AppContext } from '../AppProvider';
import { getPosts, getUsersRealtimeDatabase } from '../shared/db';
import Spinner from '../shared/Spinner';
import isPremium from '../shared/isPremium';
import Funnel from './Funnel';

const Posts = ({ posts }) => {
  Object.keys(posts).map((key) => {
    posts[key].id = key;
  });
  const count = Object.keys(posts).length;
  const postsWithNoRoom = Object.values(posts).filter((post) => !post.room);
  const countNoRoom = postsWithNoRoom.length;
  return (
    <Card>
      <Card.Body>
        <Card.Title>Posts</Card.Title>
        <div>count: {count}</div>
        <div>orphans (undefined room): {countNoRoom}</div>
        {postsWithNoRoom.map((post) => (
          <div>id: {post.id}</div>
        ))}
        <Card></Card>
      </Card.Body>
    </Card>
  );
};

const getMillisFromDifferingTypes = (lastLogin) =>
  typeof lastLogin === 'object' ? lastLogin.toMillis() : lastLogin;

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

    const properties = [
      { name: 'uid' },
      { name: 'displayName' },
      { name: 'email' },
      { name: 'lastOnline', display: 'friendlyTimestamp' },
      { name: 'lastLogin', display: 'friendlyTimestamp' },
      { name: 'joined', display: 'friendlyTimestamp' },
    ];

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
      <>
        <Posts posts={this.state.posts} />
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
                  {properties.map((property) => (
                    <td
                      key={property.name}
                      onClick={() => this.sort(property.name)}
                    >
                      {property.name}
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usersArray.map((user) => {
                  return (
                    <tr key={user.uid}>
                      {properties.map((property) => {
                        const value = user[property.name];
                        return (
                          <td key={property.name}>
                            {property.display === 'friendlyTimestamp'
                              ? friendlyTimestamp(value)
                              : value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </>
    );
  }
}
