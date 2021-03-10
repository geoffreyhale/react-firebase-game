import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Card from 'react-bootstrap/Card';
import Jumbotron from 'react-bootstrap/Jumbotron';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Tooltip from 'react-bootstrap/Tooltip';
import { AppContext } from '../../AppProvider';
import { setModalityVote } from '../../../api';
import MODALITIES from './MODALITIES';

export const availableModalities = Object.entries(MODALITIES)
  .filter(([key, MODALITY]) => MODALITY.available)
  .map(([key, MODALITY]) => {
    const modality = MODALITY;
    modality.key = key;
    return modality;
  })
  .sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { ignorePunctuation: true })
  );

const PreSelectDescription = (
  <p>Select a modality that you'd like to learn about or practice.</p>
);

const WriteDescription = () => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <>
      <p>You have selected a modality that you'd like to learn and practice.</p>
      {collapsed ? (
        <p>
          <span
            onClick={() => setCollapsed(false)}
            style={{ fontWeight: 600, cursor: 'pointer' }}
          >
            See More
          </span>
        </p>
      ) : (
        <>
          <p>Read the description below.</p>
          <p>Then, write and submit a post.</p>
          <p>
            Other users will provide feedback and vote on your proficiency in
            the modality
          </p>
          <p>
            You get real practice, real feedback, and earn proficiency points in
            the modality. Proficiency points can be used to determine
            eligibility for safer, deeper relating rooms.
          </p>
        </>
      )}
    </>
  );
};

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

export const SelectModality = ({ navigate = false }) => {
  const { modality, setModality } = useContext(AppContext);
  const history = useHistory();
  const arrayOfAvailableModalities = Object.entries(MODALITIES)
    .filter(([key, MODALITY]) => MODALITY.available)
    .sort(
      ([aKey, a], [bKey, b]) =>
        a.title &&
        b.title &&
        a.title.localeCompare(b.title, undefined, { ignorePunctuation: true })
    );

  if (!arrayOfAvailableModalities || !arrayOfAvailableModalities.length > 0) {
    return null;
  }

  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={modality ? MODALITIES[modality].title : 'Select Modality'}
      variant={modality ? 'warning' : 'outline-warning'}
    >
      {arrayOfAvailableModalities.map(([key, MODALITY]) => (
        <Dropdown.Item
          key={key}
          as="div" //"button" would trigger onSubmit
          onClick={() => {
            const newModality = modality === key ? null : key;
            if (navigate) {
              newModality
                ? history.push(`/training/${newModality}`)
                : history.push(`/training`);
            } else {
              setModality(newModality);
            }
          }}
          active={modality === key}
        >
          {MODALITY.title}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

const ModalityDescription = () => {
  const { modality: modalityKey } = useContext(AppContext);
  const modality = MODALITIES[modalityKey];

  if (!modality) return null;

  return (
    <>
      <h3>{modality.title}</h3>
      {modality.description}
    </>
  );
};

// TODO better component name wtf does this do
export const Modality = () => {
  const { modality: modalityKey } = useContext(AppContext);
  const modality = MODALITIES[modalityKey];

  return (
    <>
      <Card>
        <Card.Header>Modality Trainer</Card.Header>
        <Card.Body>
          {!modality && (
            <Card bg="light" className="mb-3">
              <Card.Body>{PreSelectDescription}</Card.Body>
            </Card>
          )}
          <SelectModality />
          {modality && (
            <Jumbotron className="mt-3">
              <WriteDescription />
            </Jumbotron>
          )}
          <ModalityDescription />
        </Card.Body>
      </Card>
    </>
  );
};

const ModalityVotingButton = ({
  modalityVotes,
  value,
  children,
  postId,
  modalityName,
}) => {
  const {
    user: { isPremium, uid },
  } = useContext(AppContext);
  const isCurrentVote = modalityVotes && modalityVotes[uid] === value;
  // TODO more sophisticated canVote
  const canVote = isPremium === true;

  const VotingButton = (
    <Button
      variant={isCurrentVote ? 'warning' : 'outline-warning'}
      onClick={() =>
        setModalityVote({
          postId,
          uid,
          vote: isCurrentVote ? null : value,
          modalityName,
        })
      }
      disabled={!canVote}
    >
      {children}
      <Badge variant="secondary" className="ml-2">
        {modalityVotes
          ? Object.values(modalityVotes).filter((vote) => vote === value).length
          : 0}
      </Badge>
    </Button>
  );

  if (canVote) {
    return VotingButton;
  }
  return (
    <>
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>Premium Feature</Tooltip>}
      >
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            cursor: 'not-allowed',
            zIndex: 2,
          }}
        />
      </OverlayTrigger>
      {VotingButton}
    </>
  );
};

export const ModalityVotingBooth = ({ modality, postId }) => {
  const history = useHistory();

  if (!MODALITIES[modality.name]) {
    return null;
  }
  const { title, description } = MODALITIES[modality.name];

  return (
    <ButtonGroup>
      <Button
        variant="warning"
        onClick={() => {
          history.push(`/training/${modality.name}`);
        }}
      >
        {title}
        <span className="ml-3">
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Popover>
                <Popover.Title as={'h3'}>What is {title}?</Popover.Title>
                <Popover.Content>
                  {description}
                  {VoteDescription}
                </Popover.Content>
              </Popover>
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </OverlayTrigger>
        </span>
      </Button>
      <ModalityVotingButton
        modalityVotes={modality.votes}
        value={true}
        postId={postId}
        modalityName={modality.name}
      >
        yes
      </ModalityVotingButton>
      <ModalityVotingButton
        modalityVotes={modality.votes}
        value={false}
        postId={postId}
        modalityName={modality.name}
      >
        not quite
      </ModalityVotingButton>
    </ButtonGroup>
  );
};

export default Modality;
