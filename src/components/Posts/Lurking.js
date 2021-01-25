import React from 'react';
import Card from 'react-bootstrap/Card';
import firebase from '../firebase.js';

export const isLurker = ({ userId, callback }) => {
  let postedRecently = false;
  firebase
    .database()
    .ref('posts')
    .orderByChild('userId')
    .equalTo(userId)
    .on('value', (postsSnapshot) => {
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
      }
      callback(!postedRecently);
    });
};

export const NoLurking = ({ userDisplayName }) => (
  <Card bg="secondary" text="white" className="mt-3">
    <Card.Body>
      <Card.Title>Please post to continue</Card.Title>
      {userDisplayName && <p>{userDisplayName},</p>}
      <p>Welcome back!</p>
      <p>You haven't posted in over 3 days. We miss you!</p>
      <p>
        xBook is testing a "no lurking" policy to encourage participation and
        increase safety of its active community members.
      </p>
      <p>Please share an update about yourself to rejoin the conversation.</p>
    </Card.Body>
  </Card>
);
