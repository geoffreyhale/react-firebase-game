import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { withRouter } from 'react-router';
import { AppContext } from '../AppProvider';
import { getUser } from '../shared/db';
import friendlyTimestamp from '../shared/friendlyTimestamp';
import { UserPhoto } from '../shared/User';
import Spinner from '../shared/Spinner';
import getMillisFromDifferingTypes from '../shared/getMillisFromDifferingTypes';
import Posts from '../Posts';
import PremiumFeature from '../shared/PremiumFeature';

class UserProfile extends React.Component {
  constructor() {
    super();
    this.state = { user: {} };
  }

  static contextType = AppContext;
  user = () => this.context.user;

  componentDidMount() {
    if (!this.user().isPremium) {
      return;
    }
    const { userId } = this.props.match.params;
    getUser(userId, (user) => {
      this.setState({ user });
    });
  }

  render() {
    if (!this.user().isPremium) {
      return <PremiumFeature featureName={'Viewing user profiles '} />;
    }

    const { user } = this.state;
    return (
      <Card>
        <Card.Body>
          <Row>
            <Col md={6}>
              <UserPhoto uid={user.uid} presence={user.presence} size={96} />
              <Card.Title className="mt-3">{user.displayName}</Card.Title>
              <ListGroup>
                <ListGroup.Item>
                  <strong>Last Online: </strong>
                  {friendlyTimestamp(user.lastOnline)}
                </ListGroup.Item>
                {/* <ListGroup.Item>
                  <strong>Last Login: </strong>
                  {friendlyTimestamp(
                    getMillisFromDifferingTypes(user.lastLogin)
                  )}
                </ListGroup.Item> */}
                <ListGroup.Item>
                  <strong>Joined: </strong>
                  {friendlyTimestamp(getMillisFromDifferingTypes(user.joined))}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              {user && user.uid ? <Posts uid={user.uid} /> : <Spinner />}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default withRouter(UserProfile);
