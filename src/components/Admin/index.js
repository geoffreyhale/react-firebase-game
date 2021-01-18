import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import friendlyTimestamp from '../shared/friendlyTimestamp';
import { AppContext } from '../AppProvider';
import { getUsers, getUsersLastOnline } from '../shared/db';

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

  componentDidMount() {
    if (this.user().admin) {
      getUsers((users) => {
        console.log(users);
        // firestore uses time objects instead of the old millisecond strings from realtime
        Object.keys(users).forEach((key) => {
          users[key].lastLogin = getMillisFromDifferingTypes(
            users[key].lastLogin
          );
          users[key].joined = getMillisFromDifferingTypes(users[key].joined);
        });
        // lastOnline lives in realtime database
        getUsersLastOnline((realtimeUsers) => {
          Object.keys(users).forEach((key) => {
            users[key].lastOnline =
              realtimeUsers[key] && realtimeUsers[key].lastOnline
                ? realtimeUsers[key].lastOnline
                : users[key].lastOnline;
          });
          this.setState({
            users,
          });
        });
      });
    }
  }
  sort(propertyName) {
    this.setState({
      sortKey: propertyName,
    });
  }
  render() {
    if (!this.user().admin) {
      return <>Loading or Access Denied</>;
    }

    const properties = [
      { name: 'uid' },
      { name: 'displayName' },
      { name: 'email' },
      { name: 'lastOnline', display: 'friendlyTimestamp' },
      { name: 'lastLogin', display: 'friendlyTimestamp' },
      { name: 'joined', display: 'friendlyTimestamp' },
    ];

    const sortKey = this.state.sortKey;
    const users = Object.entries(this.state.users).sort((a, b) => {
      if (!a[1][sortKey]) {
        return 1;
      }
      if (!b[1][sortKey]) {
        return -1;
      }
      if (typeof a[1][sortKey] === 'string') {
        return a[1][sortKey].localeCompare(b[1][sortKey]);
      }
      if (typeof a[1][sortKey] === 'number') {
        return b[1][sortKey] - a[1][sortKey];
      }
    });

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
              {users.map(([i, user]) => (
                <tr key={i}>
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
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  }
}
