import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase, { auth } from '../../firebase.js';
import { Link } from 'react-router-dom';

export default class Groups extends Component {
  constructor() {
    super();
    this.state = {
      groups: {},
      newGroupName: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.createNewGroup = this.createNewGroup.bind(this);
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user }, () => {
          const uid = this.state.user && this.state.user.uid;
          const userRef = firebase.database().ref('users/' + uid);
          userRef.on('value', (snapshot) => {
            let user = snapshot.val();
            this.setState({
              groups: user && user.groups ? user.groups : {},
            });
          });
        });
      }
    });
  }
  handleChange(event) {
    this.setState({ newGroupName: event.target.value });
  }
  createNewGroup(e) {
    e.preventDefault();
    const uid = this.state.user && this.state.user.uid;
    const userRef = firebase.database().ref('users/' + uid);
    const key = userRef.child('groups').push().key;
    userRef
      .child('groups/' + key)
      .update({ name: this.state.newGroupName })
      .then(() => {
        userRef.once('value').then((snapshot) => {
          this.setState({ groups: snapshot.val() && snapshot.val().groups });
        });
      });
  }
  render() {
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>Groups</Card.Title>
            <table>
              <tbody>
                {Object.entries(this.state.groups).map(([key, value]) => {
                  return (
                    <tr>
                      <td>
                        <Link to={key}>{value.name}</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Actions</Card.Title>
            <div>
              <Form onSubmit={this.createNewGroup}>
                <Form.Group controlId="newGroupName">
                  <Form.Control
                    type="text"
                    placeholder="Group Name"
                    value={this.state.newGroupName}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={this.state.newGroupName === ''}
                >
                  Create New Group
                </Button>
              </Form>
            </div>
          </Card.Body>
        </Card>
      </>
    );
  }
}
