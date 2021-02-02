// Unit testing security rules with the Firebase Emulator Suite
// https://www.youtube.com/watch?v=VDulvfBpzZE

const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = 'test-test-eb641';
const myId = 'asdfjkl;';
const theirId = 'zxcvbnm,./';
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
});

describe('xbk.io', () => {
  it('Understands basic addition', () => {
    assert.equal(2 + 2, 4);
  });

  it('Can read from read-only collection', async () => {
    const db = getFirestore(null);
    const testDoc = db.collection('readonly').doc('testDoc');
    await firebase.assertSucceeds(testDoc.get());
  });

  it('Cannot write to read-only collection', async () => {
    const db = getFirestore(null);
    const testDoc = db.collection('readonly').doc('testDoc2');
    await firebase.assertFails(testDoc.set({ foo: 'bar' }));
  });

  it('Can write to a user document with the same ID as our user', async () => {
    const db = getFirestore(myAuth);
    const testDoc = db.collection('users').doc(myId);
    await firebase.assertSucceeds(testDoc.set({ foo: 'bar' }));
  });

  it('Can write to a user document with the same ID as our user', async () => {
    const db = getFirestore(myAuth);
    const testDoc = db.collection('users').doc(theirId);
    await firebase.assertFails(testDoc.set({ foo: 'bar' }));
  });

  it('Can query posts marked public', async () => {
    const db = getFirestore(null);
    const testQuery = db
      .collection('posts')
      .where('visibility', '==', 'public');
    await firebase.assertSucceeds(testQuery.get());
  });

  it('Can query our own posts', async () => {
    const db = getFirestore(myAuth);
    const testQuery = db.collection('posts').where('authorId', '==', myId);
    await firebase.assertSucceeds(testQuery.get());
  });

  it('Can read a single public post', async () => {
    const admin = getAdminFirestore();
    const postId = 'public_post';
    const setupDoc = admin.collection('posts').doc(postId);
    await setupDoc.set({ authorId: theirId, visibility: 'public' });

    const db = getFirestore(null);
    const testRead = db.collection('posts').doc(postId);
    await firebase.assertSucceeds(testRead.get());
  });

  it('Can read a private post belonging to the user', async () => {
    const admin = getAdminFirestore();
    const postId = 'my_post';
    const setupDoc = admin.collection('posts').doc(postId);
    await setupDoc.set({ authorId: myId, visibility: 'private' });

    const db = getFirestore(myAuth);
    const testRead = db.collection('posts').doc(postId);
    await firebase.assertSucceeds(testRead.get());
  });

  it('Cannot read a private post belonging to another user', async () => {
    const admin = getAdminFirestore();
    const postId = 'my_post';
    const setupDoc = admin.collection('posts').doc(postId);
    await setupDoc.set({ authorId: myId, visibility: 'private' });

    const db = getFirestore(null);
    const testRead = db.collection('posts').doc(postId);
    await firebase.assertFails(testRead.get());
  });
});

after(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
