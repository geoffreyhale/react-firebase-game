// const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = 'react-firebase-2020-aecbd';

const myId = 'asdfjkl';
const theirId = 'zxcvbnm';
const myAuth = { uid: myId };

function getDatabase(auth = null) {
  return firebase
    .initializeTestApp({
      databaseName: MY_PROJECT_ID,
      auth: auth,
    })
    .database();
}

function getAdminDatabase() {
  return firebase
    .initializeAdminApp({
      databaseName: MY_PROJECT_ID,
    })
    .database();
}

function resetDatabase() {
  return getAdminDatabase().ref().set(null);
}

beforeEach(async () => {
  await resetDatabase();
});

describe('Database', () => {
  describe('Users', () => {
    it('User can read', async () => {
      await firebase.assertSucceeds(
        getDatabase(myAuth).ref('users').once('value', null)
      );
    });
    describe('Only self can write', async () => {
      it('Cannot overwrite all users', async () => {
        await firebase.assertFails(
          getDatabase().ref('users').set({ foo: 'bar' })
        );
      });
      it('Can not write other', async () => {
        await firebase.assertFails(
          getDatabase(myAuth)
            .ref('users/' + theirId)
            .set({ foo: 'bar' })
        );
      });
      it('Can write self', async () => {
        await firebase.assertSucceeds(
          getDatabase(myAuth)
            .ref('users/' + myId)
            .set({ foo: 'bar' })
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
        getAdminDatabase()
          .ref('users/' + myId)
          .set({ isPremium: true });
        await firebase.assertSucceeds(
          getDatabase(myAuth).ref('posts/').once('value', null)
        );
      });
    });
    describe('Only can write own posts', () => {
      it('Cannot overwrite all posts', async () => {
        await firebase.assertFails(
          getDatabase(myAuth).ref('posts').set({ foo: 'bar' })
        );
      });
      //TODO flaky, tends to fail first run, then pass most
      it("Cannot write other user's post", async () => {
        const admin = getAdminDatabase();
        const theirPostId = admin.ref('posts').push().key;
        admin.ref('posts/' + theirPostId).set({ userId: theirId });
        await firebase.assertFails(
          getDatabase(myAuth)
            .ref('posts/' + theirPostId)
            .set({ foo: 'bar' })
        );
      });
      it('Can write own new post', async () => {
        const db = getDatabase(myAuth);
        const myPostId = db.ref('posts').push().key;
        await firebase.assertSucceeds(
          db.ref('posts/' + myPostId).set({ foo: 'bar' })
        );
      });
      it('Cannot write new post if no auth', async () => {
        const db = getDatabase();
        const myPostId = db.ref('posts').push().key;
        await firebase.assertFails(
          db.ref('posts/' + myPostId).set({ foo: 'bar' })
        );
      });
      it('Can overwrite own existing post', async () => {
        const admin = getAdminDatabase();
        const myPostId = admin.ref('posts').push().key;
        admin.ref('posts/' + myPostId).set({ userId: myId });
        await firebase.assertSucceeds(
          getDatabase(myAuth)
            .ref('posts/' + myPostId)
            .set({ foo: 'bar' })
        );
      });
    });
    describe('Seen, Tags, Upvote', () => {
      let db = null;
      let theirPostId = null;
      const randomTagsKeyForMyId = 'randomTagsKeyForMyId';
      const randomTagsKeyForTheirId = 'randomTagsKeyForTheirId';
      beforeEach(async () => {
        const admin = getAdminDatabase();
        theirPostId = admin.ref('posts').push().key;
        await admin.ref('posts/' + theirPostId).set({
          userId: theirId,
          tags: {
            randomTagsKeyForMyId: { userId: myId },
            randomTagsKeyForTheirId: { userId: theirId },
          },
        });
        db = getDatabase(myAuth);
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
    // TODO improve this section
    describe('Modality', () => {
      let db = null;
      let myPostId = null;
      let theirPostId = null;
      beforeEach(async () => {
        const admin = getAdminDatabase();
        theirPostId = admin.ref('posts').push().key;
        await admin.ref('posts/' + theirPostId).set({
          userId: theirId,
          modality: {
            name: 'healthyrelating',
            votes: {},
          },
        });
        myPostId = admin.ref('posts').push().key;
        await admin.ref('posts/' + myPostId).set({
          userId: myId,
          modality: {
            name: 'healthyrelating',
            votes: { theirId: true },
          },
        });
        db = getDatabase(myAuth);
      });
      it('Can write modality vote on other user post', async () => {
        await firebase.assertSucceeds(
          db.ref('posts/' + theirPostId + '/modality/votes/' + myId).set(true)
        );
      });
      it('Cannot write someone else modality vote');
      // TODO
      it.skip('Cannot write modality vote on own post', async () => {
        await firebase.assertFails(
          db.ref('posts/' + myPostId + '/modality/votes/' + myId).set(true)
        );
      });
    });
  });
  describe('Notifications', () => {});
  describe('Games', () => {});
});

after(async () => {
  await resetDatabase();
});
