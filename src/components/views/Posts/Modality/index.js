import React, { useContext } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import Jumbotron from 'react-bootstrap/Jumbotron';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { AppContext } from '../../../AppProvider';
import { setModalityVote } from '../../../../api';
import MODALITIES from './MODALITIES';

export const WriteDescription = (
  <>
    <p>
      You have selected a modality that you'd like to learn and practice. Read
      the description below. Write and submit a post. Other users provide
      feedback and vote on your proficiency in the modality. You get real
      practice, real feedback, and earn proficiency points in the modality.
      Proficiency points can be used to determine eligibility for safer, deeper
      relating rooms.
    </p>
  </>
);

const VoteDescription = (
  <>
    <p>
      Ultimately, we want you to <strong>vote</strong> on whether this user's
      post is a successful attempt at this, their selected modality. In this
      way, you get to learn, train, and determine together whether your
      community meets your standards for healthy relating.
    </p>
    <p>
      After voting, don't forget to join the conversation by replying to the
      post. If the user failed to meet your standards for the modality, help
      them; let's get better together!
    </p>
  </>
);

export const ModalityCard = ({ modalityKey }) => {
  const modality = MODALITIES[modalityKey];
  if (!modality) return null;
  return (
    <Card border="warning">
      <Card.Body>
        <Jumbotron>{WriteDescription}</Jumbotron>
        <h3>{modality.title}</h3>
        {modality.description}
      </Card.Body>
    </Card>
  );
};

export const Modality = ({ modality, postId }) => {
  const { user } = useContext(AppContext);
  const { uid } = user;
  const myExistingVote = modality.votes ? modality.votes[uid] : null;

  return (
    <ButtonGroup>
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={
          <Popover>
            <Popover.Title as={'h3'}>
              What is {MODALITIES[modality.name].title}?
            </Popover.Title>
            <Popover.Content>
              {MODALITIES[modality.name].description}
              {VoteDescription}
            </Popover.Content>
          </Popover>
        }
      >
        <Button variant="warning">{MODALITIES[modality.name].title}</Button>
      </OverlayTrigger>
      <Button
        variant={myExistingVote === true ? 'warning' : 'outline-warning'}
        onClick={() =>
          setModalityVote({
            postId,
            uid,
            vote: myExistingVote === true ? null : true,
          })
        }
      >
        yes
        <Badge variant="secondary" className="ml-2">
          {modality.votes
            ? Object.values(modality.votes).filter((vote) => vote === true)
                .length
            : 0}
        </Badge>
      </Button>
      <Button
        variant={myExistingVote === false ? 'warning' : 'outline-warning'}
        onClick={() =>
          setModalityVote({
            postId,
            uid,
            vote: myExistingVote === false ? null : false,
          })
        }
      >
        no
        <Badge variant="secondary" className="ml-2">
          {modality.votes
            ? Object.values(modality.votes).filter((vote) => vote === false)
                .length
            : 0}
        </Badge>
      </Button>
    </ButtonGroup>
  );
};
