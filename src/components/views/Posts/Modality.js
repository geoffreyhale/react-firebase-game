import React, { useContext } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { AppContext } from '../../AppProvider';
import { setModalityVote } from '../../../api';

export const WriteDescription = (
  <>
    <p>
      You get to select a modality that you'd like to practice and for which
      you'd like to receive votes and feedback from the community. Ultimately,
      we want you to get to learn, train, and determine together whether you are
      meeting your community standards for healthy relating.
    </p>
    <p>
      In the future, points you receive from your peers on your successful
      attempts at healthy relating modalities can be used to determine
      elegibility for more benefits and features like safer rooms for more
      vulnerable topics and depth of connection, moderator and VIP privileges.
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

export const MODALITIES = Object.freeze({
  healthyrelating: {
    title: 'Healthy Relating',
    description: (
      <p>
        Usually, this is where you can read more information about the selected
        healthy relating <strong>modality</strong>. [This is a test; 'Healthy
        Relating' is not really a "modality".]
      </p>
    ),
  },
});

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
