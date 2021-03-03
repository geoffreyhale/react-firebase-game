import { getUser, processInviteCode, updateUser } from '../../api';
import firebase, { auth, provider } from '../firebase.js';

//TODO oof, tests ?
const handleInviteCodeStuff = ({ uid }) => {
  const localStorageKey = 'inviteCode';
  const inviteCode = window.localStorage.getItem(localStorageKey);
  inviteCode &&
    processInviteCode(
      { uid, inviteCode },
      window.localStorage.removeItem(localStorageKey)
    );
};

export const login = (callback) => {
  auth.signInWithPopup(provider).then((result) => {
    // even if this is a new user, result.user is already created in authorization db by here
    const {
      displayName,
      email,
      metadata: { a: creationTimestamp },
      photoURL,
      uid,
    } = result.user;

    // does user exist yet in firestore users ?
    getUser(uid, (user) => {
      const isNewUser = !user;

      // this creates or updates the firestore user
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

      if (isNewUser) {
        handleInviteCodeStuff({ uid });
        //TODO newbie announcement and other new user stuff
      }
    });
  });
};

export const logoff = (callback) => {
  auth.signOut().then(() => {
    callback && typeof callback === 'function' && callback();
  });
};
