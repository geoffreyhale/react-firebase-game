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
        // TODO prioritize recently online and premium users in sort
        users: shuffle(Object.values(users).map((user) => user.uid)),
      });
    }, true);
  }
  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title>Community Mosaic</Card.Title>
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
          {Object.values(this.state.users).map((uid, i) => (
            <UserPhoto key={i} uid={uid} size={48} />
          ))}
        </Card.Body>
      </Card>
    );
  }
}
