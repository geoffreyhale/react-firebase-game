import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import firebase from '../../firebase.js';
import { AppContext } from '../../AppProvider';
import Spinner from '../../shared/Spinner';

export const LURKER = Object.freeze({
  YES: 'yes',
  NO: 'no',
  NEW: 'new',
});

export const isLurker = ({ userId }, callback) => {
  firebase
    .database()
    .ref('posts')
    .orderByChild('userId')
    .equalTo(userId)
    .on('value', (postsSnapshot) => {
      let postedRecently = false;
      const posts = postsSnapshot.val();
      if (posts) {
        let mostRecentTimestamp = null;
        Object.values(posts).forEach((post) => {
          mostRecentTimestamp =
            mostRecentTimestamp > post.timestamp
              ? mostRecentTimestamp
              : post.timestamp;
        });
        if (mostRecentTimestamp) {
          const millis = Date.now() - mostRecentTimestamp;
          const millis3d = 2.592e8;
          postedRecently = !!(millis < millis3d);
        }
        callback(postedRecently ? LURKER.NO : LURKER.YES);
      } else {
        callback(LURKER.NEW);
      }
    });
};

const LurkingCard = ({ children }) => (
  <Card bg="warning" text="yellow" className="mt-3">
    <Card.Body>{children}</Card.Body>
  </Card>
);

const BypassButton = ({ doBypass }) => {
  const [startingBypass, startBypass] = useState(false);
  if (startingBypass) {
    setTimeout(() => doBypass());
    return (
      <>
        <Spinner /> Loading posts...
      </>
    );
  }
  return (
    <Button
      variant="link"
      onClick={() => {
        startBypass(true);
      }}
    >
      No thanks, maybe later.
    </Button>
  );
};

const NewUserLurkerCard = ({ displayName, doBypass }) => (
  <LurkingCard>
    <Card.Title>Join The Conversation</Card.Title>
    <p>Welcome to xBook, {displayName}!</p>
    <p>This community thrives on conversation.</p>
    <p>We'd love to hear a bit about you and how you're feeling.</p>
    <p>You can use the form above to post.</p>
    <BypassButton doBypass={doBypass} />
  </LurkingCard>
);

const LurkerLurkerCard = ({ displayName, doBypass }) => (
  <LurkingCard>
    <Card.Title>Join The Conversation</Card.Title>
    <p>We're glad you're back, {displayName}!</p>
    <p>
      This community thrives on conversation. We'd love to hear how you're
      feeling and what you've been up to since we last heard from you.
    </p>
    <BypassButton doBypass={doBypass} />
  </LurkingCard>
);

export const NoLurkerBlock = ({ children }) => {
  const { user } = useContext(AppContext);
  const [lurkingStatus, setLurkingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bypass, setBypass] = useState(false);

  useEffect(() => {
    isLurker({ userId: user.uid }, (lurkingStatus) => {
      setLurkingStatus(lurkingStatus);
      setLoading(false);
    });
  }, []);

  if (bypass) {
    return children;
  }

  if (loading) {
    return <Spinner />;
  }

  if (lurkingStatus === LURKER.NEW) {
    return (
      <NewUserLurkerCard
        displayName={user.displayName}
        doBypass={() => setBypass(true)}
      />
    );
  }

  if (lurkingStatus === LURKER.YES) {
    return (
      <LurkerLurkerCard
        displayName={user.displayName}
        doBypass={() => setBypass(true)}
      />
    );
  }

  return children;
};
