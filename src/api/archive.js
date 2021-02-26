import firebase, { db } from '../components/firebase.js';
import { postsRef } from './';

/**
 * Groups
 */
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

/**
 * Modalities
 */
//2021-02-25
export const copyPostModalityIntoPostModalitiesForAllPosts = () => {
  postsRef().once('value', (snapshot) => {
    const posts = snapshot.val();
    Object.entries(posts).forEach(([id, post]) => {
      if (post.modality) {
        postRef(id)
          .child('modalities')
          .child(post.modality.name)
          .set(post.modality);
        postRef(id).child('modality').remove();
      }
    });
  });
};

/**
 * Rooms
 */
export const overwriteRoomForAllPostsWithoutRoom = () => {
  firebase
    .database()
    .ref('posts')
    .once('value', (snapshot) => {
      const posts = snapshot.val();
      Object.keys(posts).forEach((key) => {
        const post = posts[key];
        if (!post.room) {
          firebase
            .database()
            .ref('posts/' + key + '/room')
            .set('general');
        }
      });
    });
};

/**
 * Users
 */
const deleteUidFromFirestoreUsers = ({ users }) => {
  Object.keys(users).forEach((key) => {
    const user = users[key];
    const userRef = db.collection('users').doc(key);
    userRef
      .update({
        uid: firebase.firestore.FieldValue.delete(),
      })
      .then(() => {
        console.log('deleted uid for key: ', key);
      });
  });
};
