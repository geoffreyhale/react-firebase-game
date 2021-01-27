import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { AppContext } from '../AppProvider';
import { getUser } from '../shared/db';
import friendlyTimestamp from '../shared/friendlyTimestamp';
import UserPhoto from '../shared/UserPhoto';
import Spinner from '../shared/Spinner';
import getMillisFromDifferingTypes from '../shared/getMillisFromDifferingTypes';
import Posts from '../Posts';

export default class UserProfile extends React.Component {
  constructor() {
    super();
    this.state = { user: {} };
  }

  static contextType = AppContext;
  user = () => this.context.user;

  componentDidMount() {
    getUser(this.user().uid, (user) => {
      this.setState({ user });
    });
  }

  render() {
    const { user } = this.state;
    return (
      <Card>
        <Card.Body>
          <Row>
            <Col>
              <UserPhoto uid={user.uid} presence={user.presence} size={96} />
              <Card.Title>{user.displayName}</Card.Title>
              <ListGroup>
                <ListGroup.Item>
                  <strong>Last Online: </strong>
                  {friendlyTimestamp(user.lastOnline)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Last Login: </strong>
                  {friendlyTimestamp(
                    getMillisFromDifferingTypes(user.lastLogin)
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Joined: </strong>
                  {friendlyTimestamp(getMillisFromDifferingTypes(user.joined))}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col>
              {user && user.uid ? <Posts uid={user.uid} /> : <Spinner />}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}
