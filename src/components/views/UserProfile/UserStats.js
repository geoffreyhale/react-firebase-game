import isSameDay from 'date-fns/isSameDay';
import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { getPosts } from '../../../api/index';
import Spinner from '../../shared/Spinner';

const modalityPointsReceivedFromOthers = ({ posts, uid }) => {
  let modalityPointsReceivedFromOthers = null;
  Object.values(posts)
    .filter(
      (post) =>
        post.userId === uid &&
        post.modality &&
        !post.deleted &&
        post.modality.votes &&
        typeof post.modality.votes === 'object'
    )
    .forEach((post) => {
      modalityPointsReceivedFromOthers += Object.entries(
        post.modality.votes
      ).filter(([key, vote]) => key !== uid && vote === true).length;
    });
  return modalityPointsReceivedFromOthers;
};

const upvotesReceivedFromOthers = ({ posts, uid }) => {
  let upvotesReceivedFromOthers = null;
  Object.values(posts)
    .filter(
      (post) =>
        post.userId === uid &&
        post.upvote &&
        typeof post.upvote === 'object' &&
        !post.deleted
    )
    .forEach((post) => {
      upvotesReceivedFromOthers += Object.entries(post.upvote).filter(
        ([key, vote]) => key !== uid
      ).length;
    });
  return upvotesReceivedFromOthers;
};

const directRepliesReceivedFromOthers = ({ posts, uid }) => {
  let directRepliesReceivedFromOthers = null;
  const userPostsIds = Object.entries(posts)
    .filter(([id, post]) => post.userId === uid && !post.deleted)
    .map(([id, post]) => id);
  directRepliesReceivedFromOthers += Object.values(posts).filter(
    (post) =>
      post.userId !== uid &&
      !post.deleted &&
      userPostsIds.includes(post.replyToId)
  ).length;
  return directRepliesReceivedFromOthers;
};

const repliesUpvotedByRecipient = ({ posts, uid }) => {
  let repliesUpvotedByRecipient = null;
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
  return repliesUpvotedByRecipient;
};

const uniqueDaysPosted = ({ posts, uid }) => {
  const uniqueDays = [];
  const userPosts = Object.values(posts)
    .filter((post) => post.userId === uid && !post.deleted)
    .forEach((post) => {
      if (
        !uniqueDays.some((timestamp) => isSameDay(timestamp, post.timestamp))
      ) {
        uniqueDays.push(post.timestamp);
      }
    });
  return uniqueDays.length;
};

const modalityVotesSubmittedForOthers = ({ posts, uid }) => {
  return Object.values(posts).filter(
    (post) =>
      post.userId !== uid &&
      !post.deleted &&
      post.modality &&
      post.modality.votes &&
      typeof post.modality.votes === 'object' &&
      Object.keys(post.modality.votes).includes(uid)
  ).length;
};

const getXBookScore = ({ scores }) =>
  scores.modalityPointsReceivedFromOthers * 10 +
  scores.upvotesReceivedFromOthers +
  scores.directRepliesReceivedFromOthers +
  scores.repliesUpvotedByRecipient +
  scores.uniqueDaysPosted +
  scores.modalityVotesSubmittedForOthers * 5;

const getScores = ({ uid, posts }) => {
  const scores = {};
  scores.modalityPointsReceivedFromOthers = modalityPointsReceivedFromOthers({
    posts,
    uid,
  });
  scores.upvotesReceivedFromOthers = upvotesReceivedFromOthers({
    posts,
    uid,
  });
  scores.directRepliesReceivedFromOthers = directRepliesReceivedFromOthers({
    posts,
    uid,
  });
  scores.repliesUpvotedByRecipient = repliesUpvotedByRecipient({
    posts,
    uid,
  });
  scores.uniqueDaysPosted = uniqueDaysPosted({
    posts,
    uid,
  });
  scores.modalityVotesSubmittedForOthers = modalityVotesSubmittedForOthers({
    posts,
    uid,
  });
  scores.score = getXBookScore({ scores });
  return scores;
};

export const getScoresByUid = ({ uids, posts }) => {
  const scores = {};
  uids.forEach((uid) => {
    scores[uid] = getScores({ uid, posts });
  });
  return scores;
};

const ScoreListGroupItem = ({ description, title, value, variant }) => (
  <ListGroup.Item key={title} variant={variant}>
    <OverlayTrigger placement="top" overlay={<Tooltip>{description}</Tooltip>}>
      <strong>{title}:</strong>
    </OverlayTrigger>{' '}
    {value}
  </ListGroup.Item>
);

export const UserScoreListGroup = ({ scores }) => (
  <ListGroup>
    <ScoreListGroupItem
      description="modality * 10 + upvotes + replies + replies upvoted + days posted + modalityVotesSubmittedForOthersScore * 5"
      title="Score"
      value={scores.score}
      variant="light"
    />
    <ScoreListGroupItem
      description="Modality Points Received From Others"
      title="Modality"
      value={scores.modalityPointsReceivedFromOthers}
    />
    <ScoreListGroupItem
      description="Upvotes Received From Others"
      title="Upvotes"
      value={scores.upvotesReceivedFromOthers}
    />
    <ScoreListGroupItem
      description="Replies Received From Others"
      title="Replies"
      value={scores.directRepliesReceivedFromOthers}
    />
    <ScoreListGroupItem
      description="Replies Upvoted By Recipient"
      title="Recipient Upvotes"
      value={scores.repliesUpvotedByRecipient}
    />
    <ScoreListGroupItem
      description="Unique Days Posted"
      title="Days Posted"
      value={scores.uniqueDaysPosted}
    />
    <ScoreListGroupItem
      description="Modality Votes Submitted For Others"
      title="Modality Votes Submitted"
      value={scores.modalityVotesSubmittedForOthers}
    />
  </ListGroup>
);

class UserStats extends React.Component {
  constructor() {
    super();
    this.state = { posts: null };
  }

  componentDidMount() {
    getPosts((posts) => this.setState({ posts }));
  }

  render() {
    const { uid } = this.props;
    const { posts } = this.state;

    if (!posts || typeof posts !== 'object') {
      return (
        <ListGroup>
          <Spinner />
        </ListGroup>
      );
    }

    return <UserScoreListGroup scores={getScores({ uid, posts })} />;
  }
}
export default UserStats;
