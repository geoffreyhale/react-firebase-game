import firebase, { db } from '../../firebase.js';

const postRef = (postId) => firebase.database().ref('posts/' + postId);
const postsRef = () => firebase.database().ref('posts');
const notificationsRef = ({ userId }) =>
  firebase.database().ref('notifications/' + userId);

// post w id postId received a reply
// add a notification for the user who authored the post
const addNotifications = ({ postId, myUserId }) => {
  postRef(postId)
    .once('value')
    .then((snapshot) => {
      const post = snapshot.val();
      const userId = post.userId;
      if (userId !== myUserId) {
        notificationsRef({ userId }).update({
          [postId]: firebase.database.ServerValue.increment(1),
        });
      }
    });
};

// post w id postId lost a reply
// decrement notifications for the user who authored the post
const decrementNotifications = ({ postId, myUserId }) => {
  postRef(postId)
    .once('value')
    .then((snapshot) => {
      const post = snapshot.val();
      const userId = post.userId;
      if (userId !== myUserId) {
        notificationsRef({ userId }).update({
          [postId]: firebase.database.ServerValue.increment(-1), // TODO if results in 0, remove notification
        });
      }
    });
};

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
    .then(replyToId && addNotifications({ postId: replyToId, myUserId }))
    .then(successCallback());
};

export const deletePost = ({ postId }) => {
  postsRef().child(postId).remove();
  // decrementNotifications({ postId: replyToId, myUserId }); // TODO
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
