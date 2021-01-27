import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import firebase from '../firebase.js';

export const LURKER = Object.freeze({
  YES: 'yes',
  NO: 'no',
  NEW: 'new',
});

export const isLurker = ({ userId, callback }) => {
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

export const NoLurking = ({ lurkerStatus, userDisplayName }) => {
  if (lurkerStatus === LURKER.YES) {
    return (
      <Card bg="primary" text="white" className="mt-3">
        <Card.Body>
          <Card.Title>
            {userDisplayName ? (
              <>Welcome back, {userDisplayName}!</>
            ) : (
              <>Welcome back!</>
            )}
          </Card.Title>
          <p>
            You haven't posted in a few days. Please share an update about
            yourself to rejoin the conversation. We miss you!
          </p>
          <p>
            This participation requirement helps promote meaningful connections
            and safety in the active community in accordance with our "no
            lurking" policy.
          </p>
          <p>
            Once you've posted, you'll be welcome to browse and reply to posts
            as usual.
          </p>
        </Card.Body>
      </Card>
    );
  } else if (lurkerStatus === LURKER.NEW) {
    return (
      <Card bg="primary" text="white" className="mt-3">
        <Card.Body>
          <Card.Title>
            {userDisplayName ? <>Welcome, {userDisplayName}!</> : <>Welcome!</>}
          </Card.Title>
          <p>Please introduce yourself to join the conversation.</p>
          <p>
            This participation requirement helps initiate meaningful connections
            and promotes safety in the active community in accordance with our
            "no lurking" policy.
          </p>
          <p>
            Once you've posted, you'll be welcome to browse{' '}
            <Link to="/r/general" style={{ color: 'white', fontWeight: 600 }}>
              r/general
            </Link>{' '}
            and reply to posts as much as you like.
          </p>
        </Card.Body>
      </Card>
    );
  } else {
    console.error(
      'Lurker should not reach this code point.  Check parent logic or refactor.'
    );
  }
};
