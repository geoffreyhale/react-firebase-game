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

//TODO this calls getPosts every time the selected modality changes and rerenders this
const UserModality = () => {
  const { user, modality: contextModalityKey } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState({});

  useEffect(() => {
    getPosts((posts) => {
      const userModalityPosts = Object.values(posts).filter(
        (post) =>
          post.userId === user.uid &&
          post.modality &&
          post.modality.name === contextModalityKey
      );
      setPosts(userModalityPosts);
      setLoading(false);
    });
  }, []);

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

  return (
    <ListGroup horizontal className="my-3">
      <ListGroup.Item>
        <UserPhoto uid={user.uid} />
      </ListGroup.Item>
      <ListGroup.Item>
        <div>
          <strong>Posts</strong>
        </div>
        <div style={{ textAlign: 'center' }}>
          {loading ? <Spinner /> : userModalityPostsCount}
        </div>
      </ListGroup.Item>
      <ListGroup.Item>
        <div>
          <strong>Yes</strong>
        </div>
        <div style={{ textAlign: 'center' }}>
          {loading ? (
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
          {loading ? (
            <Spinner />
          ) : (
            `${userModalityNoCount}` // (${userModalityNoPercentage}%)`
          )}
        </div>
      </ListGroup.Item>
    </ListGroup>
  );
};

const Modalities = () => {
  const { modality: contextModalityKey, setModality } = useContext(AppContext);

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
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col sm={8} className="col-main">
            {modalityToShow && (
              <>
                <h2>{modalityToShow.title}</h2>
                <UserModality key={contextModalityKey} />
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
