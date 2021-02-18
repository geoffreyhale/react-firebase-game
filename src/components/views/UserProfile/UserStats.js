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

const ScoreListGroupItem = ({ description, title, value, variant }) => (
  <ListGroup.Item key={title} variant={variant}>
    <OverlayTrigger placement="top" overlay={<Tooltip>{description}</Tooltip>}>
      <strong>{title}:</strong>
    </OverlayTrigger>{' '}
    {value}
  </ListGroup.Item>
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
    const { uid } = this.props.user;
    const { posts } = this.state;

    if (!posts || typeof posts !== 'object') {
      return (
        <ListGroup>
          <Spinner />
        </ListGroup>
      );
    }

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
    const uniqueDaysPostedScore = uniqueDaysPosted({ posts, uid });
    const modalityVotesSubmittedForOthersScore = modalityVotesSubmittedForOthers(
      { posts, uid }
    );

    const xBookScore =
      modalityPointsReceivedFromOthersScore * 10 +
      upvotesReceivedFromOthersScore +
      directRepliesReceivedFromOthersScore +
      repliesUpvotedByRecipientScore +
      uniqueDaysPostedScore +
      modalityVotesSubmittedForOthersScore * 5;

    return (
      <ListGroup>
        <ScoreListGroupItem
          description="modality * 10 + upvotes + replies + replies upvoted + days posted + modalityVotesSubmittedForOthersScore * 5"
          title="Score"
          value={xBookScore}
          variant="light"
        />
        <ScoreListGroupItem
          description="Modality Points Received From Others"
          title="Modality"
          value={modalityPointsReceivedFromOthersScore}
        />
        <ScoreListGroupItem
          description="Upvotes Received From Others"
          title="Upvotes"
          value={upvotesReceivedFromOthersScore}
        />
        <ScoreListGroupItem
          description="Replies Received From Others"
          title="Replies"
          value={directRepliesReceivedFromOthersScore}
        />
        <ScoreListGroupItem
          description="Replies Upvoted By Recipient"
          title="Recipient Upvotes"
          value={repliesUpvotedByRecipientScore}
        />
        <ScoreListGroupItem
          description="Unique Days Posted"
          title="Days Posted"
          value={uniqueDaysPostedScore}
        />
        <ScoreListGroupItem
          description="Modality Votes Submitted For Others"
          title="Modality Votes Submitted"
          value={modalityVotesSubmittedForOthersScore}
        />
      </ListGroup>
    );
  }
}
export default UserStats;
