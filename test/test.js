const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = 'react-firebase-2020-aecbd';

const myId = 'asdfjkl';
const theirId = 'zxcvbnm';
const myAuth = { uid: myId };

function getFirestore(auth) {
  return firebase
    .initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth })
    .firestore();
}

function getAdminFirestore() {
  return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore();
}

beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
  await firebase
    .initializeAdminApp({
      databaseName: MY_PROJECT_ID,
    })
    .database()
    .ref()
    .set(null);
});

describe('xbk.io', () => {
  describe('Firestore', () => {
    describe('Users', () => {
      describe('Can only read specific data from other users', () => {
        it('Can read another users displayName, joined, photoURL, premium', async () => {
          const db = getFirestore(myAuth);
          const theirUserDoc = db.collection('users').doc(theirId);
          await firebase.assertSucceeds(theirUserDoc.get());
        });
        // TODO
        it.skip('Cannot read another users admin, email, lastLogin', async () => {
          const db = getFirestore(myAuth);
          const theirUserDoc = db.collection('users').doc(theirId);
          await firebase.assertFails(theirUserDoc.get());
        });
        it('Admin user can read any field from users', async () => {
          const admin = getAdminFirestore();
          const setupUserAdmin = admin.collection('users').doc(myId);
          await setupUserAdmin.set({ admin: true });

          const db = getFirestore(myAuth);
          const theirUserDoc = db.collection('users').doc(theirId);
          await firebase.assertSucceeds(theirUserDoc.get());
        });
      });
      describe('Can only write self', () => {
        it('Can write self', async () => {
          const db = getFirestore(myAuth);
          const myUserDoc = db.collection('users').doc(myId);
          await firebase.assertSucceeds(myUserDoc.set({ foo: 'bar' }));
          await firebase.assertSucceeds(myUserDoc.update({ foo: 'bar' }));
        });
        it('Cannot write other user', async () => {
          const db = getFirestore(myAuth);
          const theirUserDoc = db.collection('users').doc(theirId);
          await firebase.assertFails(theirUserDoc.set({ foo: 'bar' }));
          await firebase.assertFails(theirUserDoc.update({ foo: 'bar' }));
        });
      });
    });
    describe('Accounting', () => {
      describe('Only admin can read accounting', () => {
        it('Null cannot read accounting', async () => {
          const db = getFirestore(null);
          const testQuery = db.collection('accounting');
          await firebase.assertFails(testQuery.get());
        });
        it('I cannot read accounting', async () => {
          const db = getFirestore(myAuth);
          const testQuery = db.collection('accounting');
          await firebase.assertFails(testQuery.get());
        });
        it('Admin can accounting', async () => {
          const admin = getAdminFirestore();
          const setupUserAdmin = admin.collection('users').doc(myId);
          await setupUserAdmin.set({ admin: true });

          const db = getFirestore(myAuth);
          const testQuery = db.collection('accounting');
          await firebase.assertSucceeds(testQuery.get());
        });
      });
      describe('No one can write accounting', () => {
        it('Admin cannot write accounting', async () => {
          const admin = getAdminFirestore();
          const setupUserAdmin = admin.collection('users').doc(myId);
          await setupUserAdmin.set({ admin: true });

          const db = getFirestore(myAuth);
          const testDoc = db.collection('accounting').doc('testDoc');
          await firebase.assertFails(testDoc.set({ foo: 'bar' }));
        });
      });
    });
  });
  describe.only('Realtime database', () => {
    describe('Users', () => {
      it('User can read', async () => {
        const db = firebase
          .initializeTestApp({
            databaseName: MY_PROJECT_ID,
            auth: myAuth,
          })
          .database();
        await firebase.assertSucceeds(db.ref('users').once('value', null));
      });
      describe('Only self can write', async () => {
        it('Cannot overwrite all users', async () => {
          const db = firebase
            .initializeTestApp({
              databaseName: MY_PROJECT_ID,
            })
            .database();
          await firebase.assertFails(db.ref('users').set({ foo: 'bar' }));
        });
        it('Can not write other', async () => {
          const db = firebase
            .initializeTestApp({
              databaseName: MY_PROJECT_ID,
              auth: myAuth,
            })
            .database();
          await firebase.assertFails(
            db.ref('users/' + theirId).set({ foo: 'bar' })
          );
        });
        it('Can write self', async () => {
          const db = firebase
            .initializeTestApp({
              databaseName: MY_PROJECT_ID,
              auth: myAuth,
            })
            .database();
          await firebase.assertSucceeds(
            db.ref('users/' + myId).set({ foo: 'bar' })
          );
        });
      });
    });
    describe('Posts', () => {
      describe('Only can read posts user has access to', () => {
        // TODO need rule
        it(
          'Cannot read rooms besides general if user not premium'
          // , async () => {
          //   const admin = firebase
          //     .initializeAdminApp({ databaseName: MY_PROJECT_ID })
          //     .database();
          //   admin.ref('users/' + myId).set({ isPremium: false });
          //   const db = firebase
          //     .initializeTestApp({
          //       databaseName: MY_PROJECT_ID,
          //       auth: myAuth,
          //     })
          //     .database();
          //   await firebase.assertFails(db.ref('posts/').once('value', null));
          // }
        );
        // TODO implement this: add isPremium to realtime database
        it('Can read all posts if user is premium', async () => {
          const admin = firebase
            .initializeAdminApp({ databaseName: MY_PROJECT_ID })
            .database();
          admin.ref('users/' + myId).set({ isPremium: true });
          const db = firebase
            .initializeTestApp({
              databaseName: MY_PROJECT_ID,
              auth: myAuth,
            })
            .database();
          await firebase.assertSucceeds(db.ref('posts/').once('value', null));
        });
      });
      describe('Only can write own posts', () => {
        it('Cannot overwrite all posts', async () => {
          const db = firebase
            .initializeTestApp({
              databaseName: MY_PROJECT_ID,
              auth: myAuth,
            })
            .database();
          await firebase.assertFails(db.ref('posts').set({ foo: 'bar' }));
        });
        it("Cannot write other user's post", async () => {
          const admin = firebase
            .initializeAdminApp({ databaseName: MY_PROJECT_ID })
            .database();
          const theirPostId = admin.ref('posts').push().key;
          admin.ref('posts/' + theirPostId).set({ userId: theirId });
          const db = firebase
            .initializeTestApp({
              databaseName: MY_PROJECT_ID,
              auth: myAuth,
            })
            .database();
          await firebase.assertFails(
            db.ref('posts/' + theirPostId).set({ foo: 'bar' })
          );
        });
        it('Can write own new post', async () => {
          const db = firebase
            .initializeTestApp({
              databaseName: MY_PROJECT_ID,
              auth: myAuth,
            })
            .database();
          const myPostId = db.ref('posts').push().key;
          await firebase.assertSucceeds(
            db.ref('posts/' + myPostId).set({ foo: 'bar' })
          );
        });
        it('Cannot write new post if no auth', async () => {
          const db = firebase
            .initializeTestApp({
              databaseName: MY_PROJECT_ID,
            })
            .database();
          const myPostId = db.ref('posts').push().key;
          await firebase.assertFails(
            db.ref('posts/' + myPostId).set({ foo: 'bar' })
          );
        });
        it('Can overwrite own existing post', async () => {
          const admin = firebase
            .initializeAdminApp({ databaseName: MY_PROJECT_ID })
            .database();
          const myPostId = admin.ref('posts').push().key;
          admin.ref('posts/' + myPostId).set({ userId: myId });
          const db = firebase
            .initializeTestApp({
              databaseName: MY_PROJECT_ID,
              auth: myAuth,
            })
            .database();
          await firebase.assertSucceeds(
            db.ref('posts/' + myPostId).set({ foo: 'bar' })
          );
        });
      });
    });
    describe('Notifications', () => {});
    describe('Games', () => {});
  });
});

after(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
