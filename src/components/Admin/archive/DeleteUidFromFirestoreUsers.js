import firebase, { db } from '../../firebase.js';

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

const DeleteUidFromFirestoreUsers = () => (
  <button
    onClick={() => deleteUidFromFirestoreUsers({ users: this.state.users })}
  >
    Delete UID from Firestore Users
  </button>
);
export default DeleteUidFromFirestoreUsers;
