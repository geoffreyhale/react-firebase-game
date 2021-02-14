// const assert = require('assert');
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
});

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
      // TODO enforce @username uniqueness
      it.skip('Cannot give themselves a username already used by another user', async () => {
        const admin = getAdminFirestore();
        const theirUserDoc = admin.collection('users').doc(theirId);
        await theirUserDoc.set({ username: 'coolusername' });

        const db = getFirestore(myAuth);
        const myUserDoc = db.collection('users').doc(myId);
        await firebase.assertSucceeds(myUserDoc.set({ foo: 'bar' }));
        await firebase.assertSucceeds(myUserDoc.set({ username: 'bar' }));
        await firebase.assertFails(
          myUserDoc.update({ username: 'coolusername' })
        );
        await firebase.assertSucceeds(myUserDoc.set({ username: 'bar' }));
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

after(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
