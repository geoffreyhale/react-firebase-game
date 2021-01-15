import firebase, { db } from '../../firebase.js';

export const updateUser = ({ uid, user }) => {
  // old
  const userRef = firebase.database().ref('users/' + uid);
  userRef.update({
    ...user,
    lastLogin: firebase.database.ServerValue.TIMESTAMP,
  });
  const joinedRef = firebase.database().ref('users/' + uid + '/joined');
  joinedRef.once('value', (snapshot) => {
    const joined = snapshot.val();
    if (!joined) {
      joinedRef.set(firebase.database.ServerValue.TIMESTAMP);
    }
  });
  // new
  db.collection('users')
    .doc(uid)
    .update({
      ...user,
      lastLogin: firebase.firestore.FieldValue.serverTimestamp(), //TODO this serverTimestamp is different than the realtime database unix number
    });
};
