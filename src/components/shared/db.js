import firebase, { db } from '../../firebase.js';

const postRef = (postId) => firebase.database().ref('posts/' + postId);
const postsRef = () => firebase.database().ref('posts');
const notificationUserPostRef = ({ userId, postId }) =>
  firebase.database().ref('notifications/' + userId + '/' + postId);
const notificationsRef = ({ userId }) =>
  firebase.database().ref('notifications/' + userId);
const upvoteUserRef = ({ postId, userId }) =>
  firebase.database().ref('posts/' + postId + '/upvote/' + userId);
const upvoteRef = ({ postId }) =>
  firebase.database().ref('posts/' + postId + '/upvote');

// post w id postId received a reply
// add a notification for the user who authored the post
const addNotifications = ({ postId, myUserId }) => {
  postRef(postId)
    .once('value')
    .then((snapshot) => {
      const post = snapshot.val();
      const userId = post.userId;
      if (userId === myUserId) {
        // do not notify user of post from themselves
        return;
      }
      notificationUserPostRef({ userId, postId }).update({
        [myUserId]: firebase.database.ServerValue.TIMESTAMP,
      });
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

// TODO get rid of old count notifiations and should always require userId here
export const removeNotification = ({ postId, myUserId, userId = null }) => {
  if (userId) {
    notificationsRef({ userId: myUserId }).child(postId).child(userId).remove();
  } else {
    notificationsRef({ userId: myUserId }).child(postId).remove();
  }
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

export const toggleUpvote = ({ postId, userId }) => {
  upvoteUserRef({ postId, userId })
    .once('value')
    .then((snapshot) => {
      const upvoteExists = !!snapshot.val();
      if (upvoteExists) {
        upvoteUserRef({ postId, userId }).remove();
      } else {
        upvoteUserRef({ postId, userId }).set(
          firebase.database.ServerValue.TIMESTAMP
        );
      }
    });
};

export const hasMyUpvote = ({ postId, userId }, callback) => {
  upvoteUserRef({ postId, userId }).on('value', (snapshot) => {
    const upvoteExists = !!snapshot.val();
    callback(upvoteExists);
  });
};

export const upvoteCount = ({ postId }, callback) => {
  upvoteRef({ postId }).on('value', (snapshot) => {
    const upvotes = snapshot.val();
    callback(upvotes ? Object.keys(upvotes).length : 0);
  });
};
