import { createPost, getUser, updateUser } from '../../api';
import firebase, { auth, provider } from '../firebase.js';

//TODO
const doNewUserStuff = ({ uid }) => {
  // createPost({
  //   content: 'This post was auto-generated the first time I ever logged in.',
  //   uid,
  //   room: 'general',
  // });
};

export const login = (callback) => {
  auth.signInWithPopup(provider).then((result) => {
    // even if is new user, is already created in authorization db by here
    const {
      displayName,
      email,
      metadata: { a: creationTimestamp },
      photoURL,
      uid,
    } = result.user;

    // does user exist yet in firestore users ?
    getUser(uid, (user) => {
      // TODO if uid does not exist in firestore users, create it and do newbie announcement stuff
      if (!user) {
        doNewUserStuff({ uid });
      }
    });

    // this creates or updates firestore users
    updateUser(
      {
        uid,
        user: {
          displayName,
          email,
          photoURL,
          joined: new Date(parseInt(creationTimestamp)),
          lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
        },
      },
      () =>
        getUser(uid, (user) => {
          callback && typeof callback === 'function' && callback(user);
        })
    );
  });
};

export const logoff = (callback) => {
  auth.signOut().then(() => {
    callback && typeof callback === 'function' && callback();
  });
};
