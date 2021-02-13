import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { withRouter } from 'react-router';
import { AppContext } from '../../AppProvider';
import { getPosts, getUser } from '../../../api/index';
import friendlyTimestamp from '../../shared/friendlyTimestamp';
import { UserPhoto } from '../../shared/User';
import Spinner from '../../shared/Spinner';
import getMillisFromDifferingTypes from '../../shared/getMillisFromDifferingTypes';
import Posts from '../Posts';
import PremiumFeature from '../../shared/PremiumFeature';

const UserProfilePhotoBanner = ({ user }) => (
  <Card>
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

// TODO this is inefficient, calls getsPosts, calls it without orderBy filter
const modalityPointsReceivedFromOthers = ({ uid }) => {
  let modalityPointsReceivedFromOthers = null;
  getPosts((posts) => {
    posts &&
      typeof posts === 'object' &&
      Object.values(posts)
        .filter((post) => post.userId === uid && post.modality && !post.deleted)
        .forEach((post) => {
          if (post.modality.votes && typeof post.modality.votes === 'object') {
            const trueVotesFromOthers = Object.entries(
              post.modality.votes
            ).filter(([key, vote]) => key !== uid && vote === true);
            modalityPointsReceivedFromOthers += trueVotesFromOthers.length;
          }
        });
  });
  return modalityPointsReceivedFromOthers;
};

// TODO this is inefficient, calls getsPosts, calls it without orderBy filter
const upvotesReceivedFromOthers = ({ uid }) => {
  let upvotesReceivedFromOthers = null;
  getPosts((posts) => {
    posts &&
      typeof posts === 'object' &&
      Object.values(posts)
        .filter((post) => post.userId === uid && post.upvote && !post.deleted)
        .forEach((post) => {
          if (typeof post.upvote === 'object') {
            const upvotesFromOthers = Object.entries(post.upvote).filter(
              ([key, vote]) => key !== uid
            );
            upvotesReceivedFromOthers += upvotesFromOthers.length;
          }
        });
  });
  return upvotesReceivedFromOthers;
};

// TODO this is inefficient, calls getsPosts, calls it without orderBy filter
const directRepliesReceivedFromOthers = ({ uid }) => {
  let directRepliesReceivedFromOthers = null;
  getPosts((posts) => {
    if (posts && typeof posts === 'object') {
      const userPostsIds = Object.entries(posts)
        .filter(([id, post]) => post.userId === uid && !post.deleted)
        .map(([id, post]) => id);
      directRepliesReceivedFromOthers += Object.values(posts).filter(
        (post) =>
          post.userId !== uid &&
          !post.deleted &&
          userPostsIds.includes(post.replyToId)
      ).length;
    }
  });
  return directRepliesReceivedFromOthers;
};

const UserStats = ({ user }) => {
  return (
    <ListGroup>
      <ListGroup.Item key="modality">
        <strong>Modality Points Received From Others: </strong>
        {modalityPointsReceivedFromOthers({ uid: user.uid })}
      </ListGroup.Item>
      <ListGroup.Item key="upvotes">
        <strong>Upvotes Received From Others: </strong>
        {upvotesReceivedFromOthers({ uid: user.uid })}
      </ListGroup.Item>
      <ListGroup.Item key="replies">
        <strong>Replies Received From Others: </strong>
        {directRepliesReceivedFromOthers({ uid: user.uid })}
      </ListGroup.Item>
    </ListGroup>
  );
};

const UserProfileTimes = ({ user }) => (
  <ListGroup>
    <ListGroup.Item>
      <strong>Last Online: </strong>
      {friendlyTimestamp(user.lastOnline)}
    </ListGroup.Item>
    {/* <ListGroup.Item>
      <strong>Last Login: </strong>
      {friendlyTimestamp(getMillisFromDifferingTypes(user.lastLogin))}
    </ListGroup.Item> */}
    <ListGroup.Item>
      <strong>Joined: </strong>
      {friendlyTimestamp(getMillisFromDifferingTypes(user.joined))}
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
    getUser(userId, (user) => {
      document.title = `${user.displayName} | xBook`;
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
          <Row className="mb-4">
            <Col style={{ textAlign: 'center' }}>
              <UserProfilePhotoBanner user={user} />
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-4">
              <div className="mb-4">
                <UserStats user={user} />
              </div>
              <UserProfileTimes user={user} />
            </Col>
            <Col md={6}>
              {user && user.uid ? (
                <Posts userFeedUid={user.uid} />
              ) : (
                <Spinner />
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default withRouter(UserProfile);
