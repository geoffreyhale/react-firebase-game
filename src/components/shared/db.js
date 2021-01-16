import firebase, { db } from '../../firebase.js';

export const getUser = (uid, callback) => {
  db.collection('users')
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const user = doc.data();
        callback(user);
      } else {
        console.error('No such document!');
      }
    });
};

export const getUsers = (callback) => {
  const users = [];
  db.collection('users')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        users[user.uid] = user;
      });
      callback(users);
    });
};

export const getUsersLastOnline = (callback) => {
  const usersRef = firebase.database().ref('users');
  usersRef.once('value', (snapshot) => {
    const users = snapshot.val();
    callback(users);
  });
};

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
