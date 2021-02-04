import React from 'react';
import Button from 'react-bootstrap/Button';
import firebase, { db } from '../firebase.js';

const consoleLogUsersWithGroups = () => {
  console.log('Looking for users with groups...');
  db.collection('users')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        user.uid = doc.id;
        if (user.groups) {
          console.log('firestore: ', user.uid);
        }
      });
    });
  firebase
    .database()
    .ref('users')
    .once('value', (snapshot) => {
      const users = snapshot.val();
      Object.entries(users).forEach(([uid, user]) => {
        if (user.groups) {
          console.log('database: ', uid);
        }
      });
    });
  console.log('...Done looking for users with groups.');
};

const UsersWithGroupsButton = () => (
  <Button variant="info" onClick={consoleLogUsersWithGroups}>
    console.log Users with Groups
  </Button>
);

export default UsersWithGroupsButton;
