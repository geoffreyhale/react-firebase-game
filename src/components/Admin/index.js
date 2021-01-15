import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import firebase, { auth } from '../../firebase.js';
import friendlyTimestamp from '../shared/friendlyTimestamp';
import { AppContext } from '../AppProvider';

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
      firebase
        .database()
        .ref('users')
        .on('value', (usersSnapshot) => {
          this.setState({
            users: usersSnapshot.val(),
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
      // { name: 'photoURL' },
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
                <td key="userId"></td>
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
              {users.map(([userId, user]) => (
                <tr key={userId}>
                  <td key="userId">{userId}</td>
                  {properties.map((property) => (
                    <td key={property.name}>
                      {property.display === 'friendlyTimestamp'
                        ? friendlyTimestamp(user[property.name])
                        : user[property.name]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  }
}
