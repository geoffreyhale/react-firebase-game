import React from 'react';
import firebase, { db } from '../firebase';

export default class Sandbox extends React.Component {
  constructor() {
    super();
    this.createExampleData = this.createExampleData.bind(this);
    this.overwriteFirestoreDbWithFirebaseDatabaseUsersData = this.overwriteFirestoreDbWithFirebaseDatabaseUsersData.bind(
      this
    );
  }

  createExampleData() {
    db.collection('users')
      .add({
        first: 'Ada',
        last: 'Lovelace',
        born: 1815,
      })
      .then(function (docRef) {
        console.log('Document written with ID: ', docRef.id);
      })
      .catch(function (error) {
        console.error('Error adding document: ', error);
      });
    db.collection('users')
      .add({
        first: 'Alan',
        middle: 'Mathison',
        last: 'Turing',
        born: 1912,
      })
      .then(function (docRef) {
        console.log('Document written with ID: ', docRef.id);
      })
      .catch(function (error) {
        console.error('Error adding document: ', error);
      });
  }

  overwriteFirestoreDbWithFirebaseDatabaseUsersData() {
    firebase
      .database()
      .ref('users/')
      .once('value', (snapshot) => {
        const users = snapshot.val();
        const userArrayWithUids = Object.entries(users).map(([key, user]) => {
          user.uid = key;
          return user;
        });
        userArrayWithUids.forEach((user) => {
          db.collection('users').doc(user.uid).set(user);
        });
      });
  }

  componentDidMount() {
    // this.overwriteFirestoreDbWithFirebaseDatabaseUsersData()

    db.collection('users')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`);
        });
      });
  }

  render() {
    return 'sandbox';
  }
}
