import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { AppContext } from '../AppProvider';
import { getUser } from '../shared/db';
import friendlyTimestamp from '../shared/friendlyTimestamp';
import UserPhoto from '../shared/UserPhoto';
import { getMillisFromDifferingTypes } from '../Admin';

export default class UserProfile extends React.Component {
  constructor() {
    super();
    this.state = { user: {} };
  }

  static contextType = AppContext;
  user = () => this.context.user;
  users = () => this.context.users;

  componentDidMount() {
    getUser(this.user().uid, (user) => {
      this.setState({ user });
    });
  }

  render() {
    const { user } = this.state;
    // console.log(user);
    return (
      <Card>
        <Card.Body>
          <UserPhoto uid={user.uid} size={96} />
          <Card.Title>{user.displayName}</Card.Title>
          <ListGroup>
            {/* <ListGroup.Item>
              <strong>Last Online: </strong>
              {friendlyTimestamp(user.lastOnline)}
            </ListGroup.Item> */}
            <ListGroup.Item>
              <strong>Last Login: </strong>
              {friendlyTimestamp(getMillisFromDifferingTypes(user.lastLogin))}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Joined: </strong>
              {friendlyTimestamp(getMillisFromDifferingTypes(user.joined))}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    );
  }
}
