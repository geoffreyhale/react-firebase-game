import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import firebase, { auth } from '../../firebase.js';

export default class Admin extends React.Component {
  constructor() {
    super();
    this.state = {
      users: {},
      user: {},
    };
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = this.props.user && this.props.user.uid;
        firebase
          .database()
          .ref('users/' + uid)
          .on('value', (snapshot) => {
            this.setState(
              {
                user: snapshot.val(),
              },
              () => {
                if (this.state.user.admin) {
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
            );
          });
      }
    });
  }
  render() {
    const propertyNames = [
      'displayName',
      'email',
      // 'photoURL',
      'joined',
      'lastLogin',
      'lastOnline',
    ];
    return this.state.user.admin ? (
      <Card>
        <Card.Body>
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <td key="userId"></td>
                {propertyNames.map((propertyName) => (
                  <td key={propertyName}>{propertyName}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(this.state.users)
                // .sort((a, b) => a[0] - b[0])
                .map(([userId, user]) => (
                  <tr key={userId}>
                    <td key="userId">{userId}</td>
                    {propertyNames.map((propertyName) => (
                      <td key={propertyName}>{user[propertyName]}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    ) : (
      <>Loading or Access Denied</>
    );
  }
}
