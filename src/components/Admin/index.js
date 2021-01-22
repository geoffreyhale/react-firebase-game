import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import friendlyTimestamp from '../shared/friendlyTimestamp';
import { AppContext } from '../AppProvider';
import { getUsersRealtimeDatabase } from '../shared/db';
import Spinner from 'react-bootstrap/Spinner';

const getMillisFromDifferingTypes = (lastLogin) =>
  typeof lastLogin === 'object' ? lastLogin.toMillis() : lastLogin;

export default class Admin extends React.Component {
  constructor() {
    super();
    this.state = {
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
  }

  sort(propertyName) {
    this.setState({
      sortKey: propertyName,
    });
  }

  render() {
    if (!this.user() || !this.users()) {
      return (
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
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
      <Card>
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
    );
  }
}
