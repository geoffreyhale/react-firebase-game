import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { UserPhoto } from '../../shared/User';
import firebase from '../../firebase';
import Spinner from '../../shared/Spinner';
import { AppContext } from '../../AppProvider';

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

  static contextType = AppContext;
  users = () => this.context.users;

  componentDidMount() {
    let users = this.users();
    if (this.props.room === 'healthyrelating') {
      users = Object.keys(users)
        .filter((key) => users[key].isPremium)
        .reduce((res, key) => ((res[key] = users[key]), res), {});
    }

    firebase
      .database()
      .ref('users')
      .on('value', (snapshot) => {
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
    const size = this.props.size || 96;
    return (
      <Card>
        <Card.Body>
          {this.props.title && <Card.Title>{this.props.title}</Card.Title>}
          <div
            style={{
              // display: 'inline-block',
              float: 'left',
              height: size,
              width: size,
              verticalAlign: 'middle',
              backgroundColor: '#209cee',
            }}
          >
            <span
              className="ml-1"
              style={{
                color: 'whitesmoke',
                fontWeight: 900,
                fontSize: (size * 20) / 48,
              }}
            >
              {usersArray.length}
            </span>
          </div>
          {usersArray.map((user, i) => (
            <div
              style={{
                // display: 'inline-block',
                float: 'left',
              }}
            >
              <UserPhoto
                uid={user.uid}
                size={user.isPremium ? size : size / 2}
                presence={user.presence}
              />
            </div>
          ))}
        </Card.Body>
      </Card>
    );
  }
}
