import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import MODALITIES from '../../shared/Modalities/MODALITIES';
import PostsFeed from '../../shared/PostsFeed';

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

const ModalityMenu = ({ loadingPosts, modalities, userModalityPosts }) => {
  const { modality: contextModalityKey, setModality } = useContext(AppContext);
  return (
    <ListGroup>
      {modalities.map((modality) => (
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
            posts={userModalityPosts}
            loadingPosts={loadingPosts}
            render={(props) => <UserModalityScoreCardInline {...props} />}
          />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

const Training = () => {
  const { user, modality: contextModalityKey } = useContext(AppContext);

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts((posts) => {
      const allPosts = Object.entries(posts)
        // .filter(([id, post]) => post.userId === user.uid && post.modality)
        //TODO this id map should probably be handled in api/getPosts
        .map(([id, post]) => {
          post.id = id;
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

  const userModalityPosts = posts.filter(
    (post) => post.userId === user.uid && post.modality
  );

  const modalities = Object.entries(MODALITIES)
    .filter(([key, MODALITY]) => MODALITY.available)
    .map(([key, MODALITY]) => {
      const modality = MODALITY;
      modality.key = key;
      return modality;
    })
    .sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { ignorePunctuation: true })
    );

  return (
    <Card>
      <Card.Header>Training</Card.Header>
      <Card.Body>
        <Card.Title>Modalities</Card.Title>
        <Row>
          <Col sm={4} className="col-left mb-3">
            <ModalityMenu
              loadingPosts={loadingPosts}
              modalities={modalities}
              userModalityPosts={userModalityPosts}
            />
          </Col>
          <Col sm={8} className="col-main">
            {modalityToShow && (
              <>
                <h2>{modalityToShow.title}</h2>
                <div className="my-3">
                  <UserModality
                    key={'main' + contextModalityKey}
                    modalityKey={contextModalityKey}
                    posts={userModalityPosts}
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
                  <Tab eventKey="my-posts" title="My Posts">
                    <div className="mb-3">
                      {/* TODO the vote buttons work but the post will not update live here */}
                      <PostsFeed
                        posts={postsWithModalityArrayFromPostsArray({
                          posts: userModalityPosts,
                          modalityKey: contextModalityKey,
                        })}
                        hackHideRepliesCount={true}
                      />
                    </div>
                  </Tab>
                  <Tab eventKey="all-posts" title="All Posts">
                    <div className="mb-3">
                      {/* TODO the vote buttons work but the post will not update live here */}
                      <PostsFeed
                        posts={postsWithModalityArrayFromPostsArray({
                          posts,
                          modalityKey: contextModalityKey,
                        })}
                        hackHideRepliesCount={true}
                      />
                    </div>
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
