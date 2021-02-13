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
const modalityPointsReceivedFromOthers = ({ posts, uid }) => {
  let modalityPointsReceivedFromOthers = null;
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
  return modalityPointsReceivedFromOthers;
};

// TODO this is inefficient, calls getsPosts, calls it without orderBy filter
const upvotesReceivedFromOthers = ({ posts, uid }) => {
  let upvotesReceivedFromOthers = null;
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
  return upvotesReceivedFromOthers;
};

// TODO this is inefficient, calls getsPosts, calls it without orderBy filter
const directRepliesReceivedFromOthers = ({ posts, uid }) => {
  let directRepliesReceivedFromOthers = null;
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
  return directRepliesReceivedFromOthers;
};

// TODO this is inefficient, calls getsPosts, calls it without orderBy filter
const repliesUpvotedByRecipient = ({ posts, uid }) => {
  let repliesUpvotedByRecipient = null;
  if (posts && typeof posts === 'object') {
    const otherUsersPosts = Object.entries(posts)
      .filter(([id, post]) => post.userId !== uid && !post.deleted)
      .map(([id, post]) => {
        post.id = id;
        return post;
      });
    repliesUpvotedByRecipient += Object.values(posts).filter((post) => {
      const otherUsersPost = otherUsersPosts.find(
        (otherUserPost) => otherUserPost.id === post.replyToId
      );
      return (
        post.userId === uid &&
        !post.deleted &&
        otherUsersPost &&
        typeof post.upvote === 'object' &&
        Object.keys(post.upvote).includes(otherUsersPost.userId)
      );
    }).length;
  }
  return repliesUpvotedByRecipient;
};

const ScoreListGroupItem = ({ title, value, variant }) => (
  <ListGroup.Item key={title} variant={variant}>
    <strong>{title}:</strong> {value}
  </ListGroup.Item>
);

/**
 * Profiling
 * With before: 23s
 * Without before: 10s/11s
 * With after refactor: 10s
 */
class UserStats extends React.Component {
  constructor() {
    super();
    this.state = { posts: {} };
  }

  componentDidMount() {
    getPosts((posts) => this.setState({ posts }));
  }

  render() {
    const { uid } = this.props.user;
    const { posts } = this.state;

    const modalityPointsReceivedFromOthersScore = modalityPointsReceivedFromOthers(
      { posts, uid }
    );
    const upvotesReceivedFromOthersScore = upvotesReceivedFromOthers({
      posts,
      uid,
    });
    const directRepliesReceivedFromOthersScore = directRepliesReceivedFromOthers(
      { posts, uid }
    );
    const repliesUpvotedByRecipientScore = repliesUpvotedByRecipient({
      posts,
      uid,
    });

    const xBookScore =
      modalityPointsReceivedFromOthersScore * 10 +
      upvotesReceivedFromOthersScore +
      directRepliesReceivedFromOthersScore +
      repliesUpvotedByRecipientScore;

    return (
      <ListGroup>
        <ScoreListGroupItem
          title="xBook Score"
          value={xBookScore}
          variant="light"
        />
        <ScoreListGroupItem
          title="Modality Points Received From Others"
          value={modalityPointsReceivedFromOthersScore}
        />
        <ScoreListGroupItem
          title="Upvotes Received From Others"
          value={upvotesReceivedFromOthersScore}
        />
        <ScoreListGroupItem
          title="Replies Received From Others"
          value={directRepliesReceivedFromOthersScore}
        />
        <ScoreListGroupItem
          title="Replies Upvoted By Recipient"
          value={repliesUpvotedByRecipientScore}
        />
      </ListGroup>
    );
  }
}

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
