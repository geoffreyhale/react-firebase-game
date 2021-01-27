import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { getUsers } from '../shared/db';
import { UserPhoto } from '../shared/User';
import firebase from '../firebase';
import Spinner from '../shared/Spinner';

// Fisher-Yates (aka Knuth) Shuffle
// https://stackoverflow.com/a/2450976/1438029
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default class Mosaic extends Component {
  constructor() {
    super();
    this.state = {
      users: {},
    };
  }
  componentDidMount() {
    getUsers((users) => {
      const usersRef = firebase.database().ref('users');
      usersRef.on('value', (snapshot) => {
        const usersRD = snapshot.val();
        Object.keys(usersRD).forEach((uid) => {
          if (users[uid]) {
            users[uid].lastOnline = usersRD[uid].lastOnline;
            users[uid].presence = usersRD[uid].presence;
          }
        });
        this.setState({
          users,
        });
      });
    }, true);
  }
  render() {
    // TODO prioritize recently online and premium users in sort
    const usersArray = shuffle(
      Object.values(this.state.users).map((user) => user)
    );
    if (!usersArray || usersArray.length === 0) {
      return <Spinner />;
    }
    // TODO test and fix this sort
    /**
     * 1. online (presence)
     * 2. premium
     * 3. lastOnline
     */
    usersArray.sort((a, b) => {
      if (a.presence !== 'online' && b.presence !== 'online') {
        // neither are online:
        // use premium, else use lastOnline
        if (!a.premium) {
          return 1;
        }
        if (!b.premium) {
          return -1;
        }
        // neither online, both premium:
        // use lastOnline
        return b.lastOnline - a.lastOnline;
      }
      if (a.presence !== 'online') {
        return 1;
      }
      if (b.presence !== 'online') {
        return -1;
      }
      // both are online:
      // use premium, else use lastOnline
      if (!a.premium) {
        return 1;
      }
      if (!b.premium) {
        return -1;
      }
      // both online, both premium:
      // use lastOnline
      return b.lastOnline - a.lastOnline;
    });
    return (
      <Card>
        <Card.Body>
          {/* <Card.Title>Community Mosaic</Card.Title> */}
          <div
            style={{
              display: 'inline-block',
              height: 48,
              width: 48,
              verticalAlign: 'middle',
              backgroundColor: '#209cee',
            }}
          >
            <span
              className="ml-1"
              style={{
                color: 'whitesmoke',
                fontWeight: 900,
                fontSize: 20,
              }}
            >
              {usersArray.length}
            </span>
          </div>
          {usersArray.map((user, i) => (
            <UserPhoto uid={user.uid} size={48} presence={user.presence} />
          ))}
        </Card.Body>
      </Card>
    );
  }
}
