import React, { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
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

const NewUserLurkerCard = ({ displayName }) => (
  <LurkingCard>
    <Card.Title>Join The Conversation</Card.Title>
    <p>Welcome to xBook, {displayName}!</p>
    <p>This community thrives on conversation.</p>
    <p>We'd love to hear a bit about you and how you're feeling.</p>
  </LurkingCard>
);

const LurkerLurkerCard = ({ displayName }) => (
  <LurkingCard>
    <Card.Title>Join The Conversation</Card.Title>
    <p>We're glad you're back, {displayName}!</p>
    <p>
      This community thrives on conversation. We'd love to hear how you're
      feeling and what you've been up to since we last heard from you.
    </p>
  </LurkingCard>
);

export const NoLurkerBlock = ({ children }) => {
  const { user } = useContext(AppContext);
  const [lurkingStatus, setLurkingStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isLurker({ userId: user.uid }, (lurkingStatus) => {
      setLurkingStatus(lurkingStatus);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (lurkingStatus === LURKER.NEW) {
    return <NewUserLurkerCard displayName={user.displayName} />;
  }

  if (lurkingStatus === LURKER.YES) {
    return <LurkerLurkerCard displayName={user.displayName} />;
  }

  return children;
};
