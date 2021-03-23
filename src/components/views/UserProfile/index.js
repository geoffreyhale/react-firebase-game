import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { withRouter, useHistory } from 'react-router';
import { AppContext } from '../../AppProvider';
import {
  followUser,
  getUser,
  getUserByUsername,
  unfollowUser,
} from '../../../api';
import FriendlyTimestamp from '../../shared/timestamp';
import { UserPhoto } from '../../shared/User';
import Spinner from '../../shared/Spinner';
import getMillisFromDifferingTypes from '../../shared/getMillisFromDifferingTypes';
import Posts from '../Posts';
import { PremiumFeature } from '../../shared/Premium';
import UserStats from './UserStats';

const FollowButton = ({ uid }) => {
  const { user } = useContext(AppContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  if (loading || !user || !uid) return <Spinner size="sm" />;

  if (user.uid === uid) return null;

  const following = user.following && user.following.includes(uid);

  return following ? (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={<Tooltip>following</Tooltip>}
    >
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          setLoading(true);
          unfollowUser({ myUid: user.uid, followUid: uid }, () =>
            // setLoading(false)
            history.go(0)
          );
        }}
      >
        <FontAwesomeIcon icon={faUserCheck} />
      </Button>
    </OverlayTrigger>
  ) : (
    <Button
      size="sm"
      variant="primary"
      onClick={() => {
        setLoading(true);
        followUser({ myUid: user.uid, followUid: uid }, () =>
          // setLoading(false)
          history.go(0)
        );
      }}
    >
      <FontAwesomeIcon icon={faUserPlus} /> Follow
    </Button>
  );
};

export const UserProfilePhotoBanner = ({ user }) => (
  <Card style={{ textAlign: 'center' }}>
    <Card.Img
      src={user.photoURL}
      style={{
        height: '12rem',
        objectPosition: 'middle',
        objectFit: 'cover',
        opacity: 0.1,
      }}
    />
    <Card.ImgOverlay>
      <UserPhoto
        uid={user.uid}
        presence={user.presence}
        size={96}
        roundedCircle
      />
      <Card.Title className="mt-3" style={{ fontSize: '200%' }}>
        {user.displayName}
      </Card.Title>
    </Card.ImgOverlay>
  </Card>
);

const UserProfileTimes = ({ user }) => (
  <ListGroup>
    <ListGroup.Item>
      <strong>Last Online: </strong>
      {FriendlyTimestamp(user.lastOnline)}
    </ListGroup.Item>
    {/* <ListGroup.Item>
      <strong>Last Login: </strong>
      {FriendlyTimestamp(getMillisFromDifferingTypes(user.lastLogin))}
    </ListGroup.Item> */}
    <ListGroup.Item>
      <strong>Joined: </strong>
      {FriendlyTimestamp(getMillisFromDifferingTypes(user.joined))}
    </ListGroup.Item>
  </ListGroup>
);

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
    if (userId.startsWith('@')) {
      getUserByUsername({ username: userId.substring(1) }, (user) => {
        document.title = `${user.displayName} | xBook`;
        this.setState({ user });
      });
    } else {
      getUser(userId, (user) => {
        document.title = `${user.displayName} | xBook`;
        this.setState({ user });
      });
    }
  }

  render() {
    if (!this.user().isPremium) {
      return <PremiumFeature featureName={'Viewing user profiles '} />;
    }

    const { user } = this.state;
    return (
      <Card>
        <Card.Body>
          <Row className="mb-2">
            <Col>
              <UserProfilePhotoBanner user={user} />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <span className="float-right">
                <FollowButton uid={user.uid} />
              </span>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-4">
              <div className="mb-4">
                <UserStats uid={user.uid} />
              </div>
              <UserProfileTimes user={user} />
            </Col>
            <Col md={6}>
              {user && user.uid ? (
                <Posts userFeedUid={user.uid} />
              ) : (
                <Spinner size="lg" />
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default withRouter(UserProfile);
