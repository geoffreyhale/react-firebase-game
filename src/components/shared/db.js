import firebase, { db } from '../../firebase.js';

const postsRef = () => firebase.database().ref('posts');

export const createNewPost = (
  newPostContent,
  replyToId,
  successCallback,
  myUserId
) => {
  const key = postsRef().push().key;
  postsRef()
    .child(key)
    .update({
      content: newPostContent,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      userId: myUserId,
      replyToId: replyToId,
    })
    .then(successCallback());
};

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
  db.collection('users').doc(uid).update(user);
};
