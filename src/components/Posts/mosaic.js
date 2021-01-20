import React, { Component } from 'react';
// import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import { getUsers } from '../shared/db';
import UserPhoto from '../shared/UserPhoto';

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
      this.setState({
        users: shuffle(Object.values(users).map((user) => user.photoURL)),
      });
    });
  }
  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title>
            Community Mosaic
            {/* {' '}<Badge variant="secondary">
              {Object.keys(this.state.users).length}
            </Badge> */}
          </Card.Title>
          <div
            style={{
              display: 'inline-block',
              height: 48,
              width: 48,
              verticalAlign: 'middle',
              backgroundColor: 'grey',
              color: 'whitesmoke',
              fontWeight: 900,
            }}
          >
            {Object.keys(this.state.users).length}
          </div>
          {Object.values(this.state.users).map((photoURL, i) =>
            photoURL ? <UserPhoto key={i} src={photoURL} size={48} /> : null
          )}
        </Card.Body>
      </Card>
    );
  }
}
