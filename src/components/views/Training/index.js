import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { getPosts } from '../../../api';
import { AppContext } from '../../AppProvider';
import Spinner from '../../shared/Spinner';
import { UserPhoto } from '../../shared/User';
import { availableModalities } from '../../shared/Modalities';
import MODALITIES from '../../shared/Modalities/MODALITIES';
import PostsFeed from '../../shared/PostsFeed';
import PremiumFeature from '../../shared/PremiumFeature';

//TODO add feed of modality posts that user has not voted on
//TODO add feeds of best examples
//TODO allow post submissions from this page

const UserModalityScoreCardInline = ({
  loadingPosts,
  uid,
  userModalityPostsCount,
  userModalityYesCount,
  userModalityNoCount,
}) => (
  <span
    className="user-modality float-right"
    style={{ display: 'inline-flex' }}
  >
    <span className="ml-4">
      <div style={{ textAlign: 'center' }}>
        {loadingPosts ? <Spinner size="sm" /> : userModalityPostsCount}
      </div>
    </span>
    <span className="ml-4">
      <div style={{ textAlign: 'center' }}>
        {loadingPosts ? (
          <Spinner size="sm" />
        ) : (
          `${userModalityYesCount}` // (${userModalityYesPercentage}%)`
        )}
      </div>
    </span>
    <span className="ml-4">
      <div style={{ textAlign: 'center' }}>
        {loadingPosts ? (
          <Spinner size="sm" />
        ) : (
          `${userModalityNoCount}` // (${userModalityNoPercentage}%)`
        )}
      </div>
    </span>
  </span>
);

const UserModalityScoreCard = ({
  loadingPosts,
  uid,
  userModalityPostsCount,
  userModalityYesCount,
  userModalityNoCount,
}) => (
  <ListGroup horizontal className="user-modality">
    <ListGroup.Item>
      <UserPhoto uid={uid} />
    </ListGroup.Item>
    <ListGroup.Item>
      <div>
        <strong>Posts</strong>
      </div>
      <div style={{ textAlign: 'center' }}>
        {loadingPosts ? <Spinner size="sm" /> : userModalityPostsCount}
      </div>
    </ListGroup.Item>
    <ListGroup.Item>
      <div>
        <strong>Yes</strong>
      </div>
      <div style={{ textAlign: 'center' }}>
        {loadingPosts ? (
          <Spinner size="sm" />
        ) : (
          `${userModalityYesCount}` // (${userModalityYesPercentage}%)`
        )}
      </div>
    </ListGroup.Item>
    <ListGroup.Item>
      <div>
        <strong>No</strong>
      </div>
      <div style={{ textAlign: 'center' }}>
        {loadingPosts ? (
          <Spinner size="sm" />
        ) : (
          `${userModalityNoCount}` // (${userModalityNoPercentage}%)`
        )}
      </div>
    </ListGroup.Item>
  </ListGroup>
);

const postsWithModalityArrayFromPostsArray = ({
  posts = [],
  modalityKey = null,
}) =>
  posts.filter((post) => post.modality && post.modality.name === modalityKey);

const UserModality = ({
  posts: postsObject,
  loadingPosts,
  modalityKey,
  render,
}) => {
  const { user } = useContext(AppContext);

  if (!postsObject || typeof postsObject !== 'object') {
    return null;
  }

  const posts = postsWithModalityArrayFromPostsArray({
    posts: postsObject,
    modalityKey,
  });

  const userModalityPostsCount =
    posts && typeof posts === 'object' && Object.keys(posts).length;

  //TODO add tests for this monster
  const { yesCount: userModalityYesCount, noCount: userModalityNoCount } =
    posts && typeof posts === 'object'
      ? Object.values(posts).reduce(
          (acc, post) => {
            return {
              yesCount:
                acc.yesCount +
                (post.modality && post.modality.votes
                  ? Object.entries(post.modality.votes).filter(
                      ([key, vote]) => key !== user.uid && vote === true
                    ).length
                  : 0),
              noCount:
                acc.noCount +
                (post.modality && post.modality.votes
                  ? Object.entries(post.modality.votes).filter(
                      ([key, vote]) => key !== user.uid && vote === false
                    ).length
                  : 0),
            };
          },
          { yesCount: 0, noCount: 0 }
        )
      : {};

  // const userModalityVoteCount = userModalityYesCount + userModalityNoCount;
  // const userModalityYesPercentage = Math.round(
  //   (userModalityYesCount / userModalityVoteCount) * 100
  // );
  // const userModalityNoPercentage = Math.round(
  //   (userModalityNoCount / userModalityVoteCount) * 100
  // );

  return render({
    loadingPosts,
    uid: user.uid,
    userModalityPostsCount,
    userModalityYesCount,
    userModalityNoCount,
  });
};

const ModalityMenu = ({ loadingPosts, posts }) => {
  const { modality: contextModalityKey, setModality } = useContext(AppContext);
  return (
    <ListGroup>
      {availableModalities.map((modality) => (
        <ListGroup.Item
          action
          active={contextModalityKey === modality.key}
          onClick={() =>
            setModality(
              contextModalityKey === modality.key ? null : modality.key
            )
          }
        >
          {modality.title}
          <UserModality
            key={modality.key}
            modalityKey={modality.key}
            posts={posts}
            loadingPosts={loadingPosts}
            render={(props) => <UserModalityScoreCardInline {...props} />}
          />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

const Training = () => {
  const { user, users, modality: contextModalityKey } = useContext(AppContext);

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts((posts) => {
      const allPosts = Object.entries(posts)
        //TODO this id map should probably be handled in api/getPosts
        //TODO maybe this userDisplayName map should probably be handled more globally
        .map(([id, post]) => {
          post.id = id;
          post.userDisplayName =
            users[post.userId] && users[post.userId].displayName;
          return post;
        });
      setPosts(allPosts);
      setLoadingPosts(false);
    });
  }, []);

  const modalityToShow =
    contextModalityKey &&
    MODALITIES[contextModalityKey] &&
    MODALITIES[contextModalityKey].available
      ? MODALITIES[contextModalityKey]
      : null;

  const userPosts = posts.filter((post) => post.userId === user.uid);
  const userPostsWithAnyModality = posts.filter(
    (post) => post.userId === user.uid && post.modality
  );
  const userPostsWithThisModality = postsWithModalityArrayFromPostsArray({
    posts: userPostsWithAnyModality,
    modalityKey: contextModalityKey,
  });
  const postsWithThisModality = postsWithModalityArrayFromPostsArray({
    posts,
    modalityKey: contextModalityKey,
  }).sort((a, b) => {
    //TODO exclude votes for self
    //TODO make this modality vote count a method of post object
    const aYesVotes =
      a.modality &&
      a.modality.votes &&
      Object.values(a.modality.votes).filter((vote) => vote === true).length;
    const bYesVotes =
      b.modality &&
      b.modality.votes &&
      Object.values(b.modality.votes).filter((vote) => vote === true).length;
    if (!aYesVotes) {
      return 1;
    }
    if (!bYesVotes) {
      return -1;
    }
    return aYesVotes < bYesVotes ? 1 : -1;
  });

  return (
    <Card>
      <Card.Header>Training</Card.Header>
      <Card.Body>
        <Card.Title>Modalities</Card.Title>
        <Row>
          <Col sm={4} className="col-left mb-3">
            <ModalityMenu loadingPosts={loadingPosts} posts={userPosts} />
          </Col>
          <Col sm={8} className="col-main">
            {modalityToShow && (
              <>
                <h2>{modalityToShow.title}</h2>
                <div className="my-3">
                  <UserModality
                    key={'main' + contextModalityKey}
                    modalityKey={contextModalityKey}
                    posts={userPosts}
                    loadingPosts={loadingPosts}
                    render={(props) => <UserModalityScoreCard {...props} />}
                  />
                </div>
                <Tabs defaultActiveKey="description" className="mb-3">
                  <Tab eventKey="description" title="Description">
                    <div className="mb-3">{modalityToShow.description}</div>
                    <div className="mb-3">
                      <Card>
                        <Card.Body>
                          Practice now in premium room:{' '}
                          <Button
                            as={Link}
                            variant="link"
                            to={`/r/${modalityToShow.room}`}
                          >
                            r/{modalityToShow.room}
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>
                  </Tab>
                  <Tab
                    eventKey="my-posts"
                    title={
                      <span>
                        My Posts
                        {loadingPosts ? (
                          <Spinner size="sm" />
                        ) : (
                          <Badge variant="secondary" className="ml-2">
                            {userPostsWithThisModality.length}
                          </Badge>
                        )}
                      </span>
                    }
                  >
                    {/* TODO the vote buttons work but the post will not update live here */}
                    <PostsFeed
                      posts={userPostsWithThisModality}
                      hackHideRepliesCount={true}
                    />
                  </Tab>
                  <Tab
                    eventKey="all-posts"
                    title={
                      <span>
                        All Posts
                        {loadingPosts ? (
                          <Spinner size="sm" />
                        ) : (
                          <Badge variant="secondary" className="ml-2">
                            {postsWithThisModality.length}
                          </Badge>
                        )}
                      </span>
                    }
                  >
                    {/* TODO the vote buttons work but the post will not update live here */}
                    {user.isPremium ? (
                      <PostsFeed
                        posts={postsWithThisModality}
                        hackHideRepliesCount={true}
                      />
                    ) : (
                      <PremiumFeature />
                    )}
                  </Tab>
                </Tabs>
              </>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
export default Training;
