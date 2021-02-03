const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = 'react-firebase-2020-aecbd';

const myId = 'asdfjkl';
const theirId = 'zxcvbnm';
const myAuth = { uid: myId };

beforeEach(async () => {
  await firebase
    .initializeAdminApp({
      databaseName: MY_PROJECT_ID,
    })
    .database()
    .ref()
    .set(null);
});

describe('Database', () => {
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
    describe('Seen, Tags, Upvote', () => {
      let db = null;
      let theirPostId = null;
      const randomTagsKeyForMyId = 'randomTagsKeyForMyId';
      const randomTagsKeyForTheirId = 'randomTagsKeyForTheirId';
      beforeEach(async () => {
        const admin = firebase
          .initializeAdminApp({ databaseName: MY_PROJECT_ID })
          .database();
        theirPostId = admin.ref('posts').push().key;
        await admin.ref('posts/' + theirPostId).set({
          userId: theirId,
          tags: {
            randomTagsKeyForMyId: { userId: myId },
            randomTagsKeyForTheirId: { userId: theirId },
          },
        });
        db = firebase
          .initializeTestApp({
            databaseName: MY_PROJECT_ID,
            auth: myAuth,
          })
          .database();
      });
      it("Can upvote another user's post", async () => {
        await firebase.assertSucceeds(
          db.ref('posts/' + theirPostId + '/upvote/' + myId).set(1234567890)
        );
      });
      it("Can not write another user's upvote", async () => {
        await firebase.assertFails(
          db.ref('posts/' + theirPostId + '/upvote/' + theirId).set(1234567890)
        );
      });
      it("Can mark another user's post as seen", async () => {
        await firebase.assertSucceeds(
          db.ref('posts/' + theirPostId + '/seen/' + myId).set(1234567890)
        );
      });
      it('Can not write seen for another user', async () => {
        await firebase.assertFails(
          db.ref('posts/' + theirPostId + '/seen/' + theirId).set(1234567890)
        );
      });
      it('Can read Seen', async () => {
        await firebase.assertSucceeds(
          db.ref('posts/' + theirPostId + '/seen/' + myId).once('value', null)
        );
      });
      it.skip("Can not read another user's Seen", async () => {
        await firebase.assertFails(
          db
            .ref('posts/' + theirPostId + '/seen/' + theirId)
            .once('value', null)
        );
      });
      it('Can add tags', async () => {
        await firebase.assertSucceeds(
          db
            .ref('posts/' + theirPostId + '/tags/' + randomTagsKeyForMyId)
            .set({ foo: 'bar' })
        );
      });
      it("Can not write another user's tag", async () => {
        await firebase.assertFails(
          db
            .ref('posts/' + theirPostId + '/tags/' + randomTagsKeyForTheirId)
            .set({ foo: 'bar' })
        );
      });
    });
  });
  describe('Notifications', () => {});
  describe('Games', () => {});
});

after(async () => {
  await firebase
    .initializeAdminApp({
      databaseName: MY_PROJECT_ID,
    })
    .database()
    .ref()
    .set(null);
});
