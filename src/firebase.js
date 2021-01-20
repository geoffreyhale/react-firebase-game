import firebase from 'firebase';
const config = {
  apiKey: 'AIzaSyC301BeuAVDII84J7K0mq7AUJjUMgwRWYo',
  authDomain: 'react-firebase-2020-aecbd.firebaseapp.com',
  databaseURL: 'https://react-firebase-2020-aecbd-default-rtdb.firebaseio.com',
  projectId: 'react-firebase-2020-aecbd',
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
// https://stackoverflow.com/a/43727675/1438029
provider.setCustomParameters({
  prompt: 'select_account',
});
export const auth = firebase.auth();
export default firebase;

export const db = firebase.firestore();
