import firebase, { db } from '../components/firebase.js';
import { isPremium } from '../components/shared/User';

const postRef = (postId) => firebase.database().ref('posts/' + postId);
export const postsRef = () => firebase.database().ref('posts');
const notificationUserPostRef = ({ uid, postId }) =>
  firebase.database().ref('notifications/' + uid + '/' + postId);
const notificationsRef = ({ uid }) =>
  firebase.database().ref('notifications/' + uid);
const upvoteUserRef = ({ postId, uid }) =>
  firebase.database().ref('posts/' + postId + '/upvote/' + uid);
const upvoteRef = ({ postId }) =>
  firebase.database().ref('posts/' + postId + '/upvote');

export const getEvent = ({ eventId }, callback) => {
  db.collection('events')
    .doc(eventId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const event = doc.data();
        event.id = doc.id;
        callback(event);
      }
    });
};
export const updateEvent = (id, { description }, callback) => {
  db.collection('events')
    .doc(id)
    .update({
      description,
    })
    .then(() => {
      callback && typeof callback === 'function' && callback();
    });
};

export const setModalityVote = ({ postId, vote, uid }) => {
  postRef(postId).child('modality').child('votes').child(uid).set(vote);
};

export const addTag = ({ postId, content, successCallback, uid }) => {
  const key = postRef(postId).child('tags').push().key;
  postRef(postId)
    .child('tags')
    .child(key)
    .update({
      type: content,
      userId: uid,
    })
    .then(successCallback());
};

//TODO refactor someday
export const removeTag = ({ postId, content, uid }) => {
  postRef(postId)
    .child('tags')
    .once('value', (snapshot) => {
      const tags = snapshot.val();
      const tag =
        tags &&
        typeof tags === 'object' &&
        Object.entries(tags).filter(
          ([key, tag]) => tag.userId === uid && tag.type === content
        );
      if (tag && tag.length === 1) {
        const tagKey = tag[0][0];
        postRef(postId).child('tags').child(tagKey).remove();
      }
    });
};

// post w id postId received a reply
// add a notification for the user who authored the post
const addNotifications = ({ postId, uid }) => {
  postRef(postId)
    .once('value')
    .then((snapshot) => {
      const post = snapshot.val();
      const postUserId = post.userId;
      if (postUserId === uid) {
        // do not notify user of post from themselves
        return;
      }
      notificationUserPostRef({ uid: postUserId, postId }).update({
        [uid]: firebase.database.ServerValue.TIMESTAMP,
      });
    });
};

// TODO get rid of old count notifiations and should always require userId here
export const removeNotification = ({ postId, uid, userId = null }) => {
  if (userId) {
    notificationsRef({ uid }).child(postId).child(userId).remove();
  } else {
    notificationsRef({ uid }).child(postId).remove();
  }
};

export const editPost = ({ id, content, successCallback }) => {
  postRef(id)
    .update({
      content,
    })
    .then(() => {
      successCallback();
    });
};

export const createPost = ({
  content,
  replyToId,
  successCallback,
  uid,
  room,
  modality,
}) => {
  if (!room) {
    console.error('createPost must receive value for room');
    return;
  }
  const post = {
    content,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    userId: uid,
    replyToId: replyToId,
    room: room,
    modality: { name: modality },
  };
  //hacky fix to prevent replies from having a modality
  if (replyToId) {
    delete post.modality;
  }
  const key = postsRef().push().key;
  postsRef()
    .child(key)
    .update(post)
    .then(replyToId && addNotifications({ postId: replyToId, uid }))
    .then(successCallback());
  toggleUpvote({ postId: key, uid });
};

export const deletePost = ({ postId }) => {
  const postRef = postsRef().child(postId);
  postsRef()
    .orderByChild('replyToId')
    .equalTo(postId)
    .once('value', (snapshot) => {
      const replies = snapshot.val();
      if (!replies) {
        postRef.remove();
      } else {
        postRef.update({ deleted: true });
      }
      // decrementNotifications({ postId: replyToId, myUserId }); // TODO
    });
};

export const getPosts = (callback) => {
  postsRef().once('value', (snapshot) => {
    const posts = snapshot.val();
    callback(posts);
  });
};

export const getRooms = (callback) => {
  const rooms = {};
  db.collection('rooms')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        rooms[doc.id] = doc.data();
        rooms[doc.id].id = doc.id;
      });
      callback(rooms);
    });
};

const getModalityPostsArrayForUser = ({ uid }, callback) => {
  getPosts((posts) => {
    const modalityPosts = Object.values(posts).filter(
      (post) => post.userId === uid && post.modality
    );
    callback(modalityPosts);
  });
};

const getMostRecentModalityPostForUser = ({ uid }, callback) => {
  getModalityPostsArrayForUser({ uid }, (modalityPostsArray) => {
    const mostRecentModalityPost =
      modalityPostsArray.length > 0 &&
      modalityPostsArray.reduce((prev, current) =>
        prev.timestamp > current.timestamp ? prev : current
      );
    callback(mostRecentModalityPost);
  });
};

export const getMostRecentModalityPostTimestampForUser = (
  { uid },
  callback
) => {
  getModalityPostsArrayForUser({ uid }, (modalityPostsArray) => {
    const mostRecentModalityPostTimestamp =
      modalityPostsArray.length > 0 &&
      Math.max.apply(
        Math,
        modalityPostsArray.map((post) => post.timestamp)
      );
    callback(mostRecentModalityPostTimestamp);
  });
};

export const getUser = (uid, callback) => {
  db.collection('users')
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const user = doc.data();
        user.uid = doc.id;
        firebase
          .database()
          .ref('users/' + user.uid)
          .once('value', (snapshot) => {
            const realtimeUser = snapshot.val();
            const mergedUser = Object.assign(user, realtimeUser);
            mergedUser.isPremium = isPremium({ premium: mergedUser.premium });
            callback(mergedUser);
          });
      } else {
        console.error('User not found! uid: ', uid);
      }
    });
};

export const getUserByUsername = ({ username }, callback) => {
  db.collection('users')
    .where('username', '==', username)
    .get()
    .then((querySnapshot) => {
      const uidMatchesForUsername = [];
      querySnapshot.forEach((doc) => {
        uidMatchesForUsername.push(doc.id);
      });
      if (uidMatchesForUsername.length === 1) {
        getUser(uidMatchesForUsername[0], callback);
      } else {
        callback(false);
      }
    });
};

export const getAccounting = (callback) => {
  const accounting = {};
  db.collection('accounting')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        accounting[doc.id] = doc.data();
        accounting[doc.id].id = doc.id;
      });
      callback(accounting);
    });
};

export const getUsers = (callback) => {
  const users = {};
  db.collection('users')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        users[doc.id] = doc.data();
        users[doc.id].uid = doc.id;
        users[doc.id].isPremium = isPremium({ premium: users[doc.id].premium });
      });
      callback(users);
    });
};

export const getUsersRealtimeDatabase = (callback) => {
  const usersRef = firebase.database().ref('users');
  usersRef.once('value', (snapshot) => {
    const users = snapshot.val();
    callback(users);
  });
};

export const updateUser = ({ uid, user }, then) => {
  db.collection('users').doc(uid).set(user, { merge: true });
  then();
};

export const updateUsername = ({ uid, username }, callback) => {
  getUserByUsername({ username }, (userWithUsernameAlreadyExists) => {
    if (!userWithUsernameAlreadyExists) {
      db.collection('users')
        .doc(uid)
        .update({ username: username })
        .then(() => {
          typeof callback === 'function' && callback(true);
        });
    } else {
      callback(false);
    }
  });
};

export const toggleUpvote = ({ postId, uid }) => {
  upvoteUserRef({ postId, uid })
    .once('value')
    .then((snapshot) => {
      const upvoteExists = !!snapshot.val();
      if (upvoteExists) {
        upvoteUserRef({ postId, uid }).remove();
      } else {
        upvoteUserRef({ postId, uid }).set(
          firebase.database.ServerValue.TIMESTAMP
        );
      }
    });
};

export const hasMyUpvote = ({ postId, uid }, callback) => {
  upvoteUserRef({ postId, uid }).on('value', (snapshot) => {
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
