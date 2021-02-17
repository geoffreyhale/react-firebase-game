import React, { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import { getPosts } from '../../../api';
import { AppContext } from '../../AppProvider';
import Spinner from '../../shared/Spinner';
import { UserPhoto } from '../../shared/User';
import MODALITIES from '../Posts/Modality/MODALITIES';

//TODO handle premium only
//TODO allow post submissions from this page
//TODO add feed of modality posts that user has not voted on
//TODO add feeds of best examples

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
        {loadingPosts ? <Spinner /> : userModalityPostsCount}
      </div>
    </span>
    <span className="ml-4">
      <div style={{ textAlign: 'center' }}>
        {loadingPosts ? (
          <Spinner />
        ) : (
          `${userModalityYesCount}` // (${userModalityYesPercentage}%)`
        )}
      </div>
    </span>
    <span className="ml-4">
      <div style={{ textAlign: 'center' }}>
        {loadingPosts ? (
          <Spinner />
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
        {loadingPosts ? <Spinner /> : userModalityPostsCount}
      </div>
    </ListGroup.Item>
    <ListGroup.Item>
      <div>
        <strong>Yes</strong>
      </div>
      <div style={{ textAlign: 'center' }}>
        {loadingPosts ? (
          <Spinner />
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
          <Spinner />
        ) : (
          `${userModalityNoCount}` // (${userModalityNoPercentage}%)`
        )}
      </div>
    </ListGroup.Item>
  </ListGroup>
);

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

  const posts = Object.values(postsObject).filter(
    (post) => post.modality && post.modality.name === modalityKey
  );

  const userModalityPostsCount =
    posts && typeof posts === 'object' && Object.keys(posts).length;
  const [userModalityYesCount, userModalityNoCount] =
    posts &&
    typeof posts === 'object' &&
    Object.values(posts).reduce(
      ([yesCount, noCount], post) => [
        yesCount + post.modality && post.modality.votes
          ? Object.values(post.modality.votes).filter((vote) => vote === true)
              .length
          : 0,
        noCount + post.modality && post.modality.votes
          ? Object.values(post.modality.votes).filter((vote) => vote === false)
              .length
          : 0,
      ],
      [0, 0]
    );

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

const Modalities = () => {
  const { user, modality: contextModalityKey, setModality } = useContext(
    AppContext
  );

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posts, setPosts] = useState({});

  useEffect(() => {
    getPosts((posts) => {
      const userModalityPosts = Object.values(posts).filter(
        (post) => post.userId === user.uid && post.modality
      );
      setPosts(userModalityPosts);
      setLoadingPosts(false);
    });
  }, []);

  const modalityToShow =
    contextModalityKey &&
    MODALITIES[contextModalityKey] &&
    MODALITIES[contextModalityKey].available
      ? MODALITIES[contextModalityKey]
      : null;

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
          <Col sm={4} className="col-left">
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
                    posts={posts}
                    loadingPosts={loadingPosts}
                    render={(props) => (
                      <UserModalityScoreCardInline {...props} />
                    )}
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col sm={8} className="col-main">
            {modalityToShow && (
              <>
                <h2>{modalityToShow.title}</h2>
                <div className="my-3">
                  <UserModality
                    key={'main' + contextModalityKey}
                    modalityKey={contextModalityKey}
                    posts={posts}
                    loadingPosts={loadingPosts}
                    render={(props) => <UserModalityScoreCard {...props} />}
                  />
                </div>
                {modalityToShow.description}
              </>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
export default Modalities;
