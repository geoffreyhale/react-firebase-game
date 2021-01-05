import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import firebase, { auth } from '../../../firebase.js';

import './index.css';

const BoardButtons = ({ tictactoe, expandBoard, reduceBoard }) => (
  <div style={{ display: 'inline-block' }}>
    <Button
      style={{ borderRadius: '2rem' }}
      onClick={expandBoard}
      disabled={tictactoe.length >= 19 && true}
    >
      +
    </Button>
    <Button
      style={{ borderRadius: '2rem' }}
      onClick={reduceBoard}
      variant="danger"
      disabled={tictactoe.length <= 3 && true}
    >
      -
    </Button>
  </div>
);

const count = (tictactoe) => {
  const count = {};
  tictactoe.forEach((row, i) => {
    tictactoe[i].forEach((cell, j) => {
      count[cell.userId] ? (count[cell.userId] += 1) : (count[cell.userId] = 1);
    });
  });
  return count;
};

export default class TicTacToe extends Component {
  constructor() {
    super();
    this.state = { tictactoe: [], users: {} };
    this.expandBoard = this.expandBoard.bind(this);
    this.reduceBoard = this.reduceBoard.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.save = this.save.bind(this);
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const tictactoeRef = firebase.database().ref('games/tictactoe');
        tictactoeRef.on('value', (snapshot) => {
          let tictactoe = snapshot.val();
          this.setState({
            tictactoe: tictactoe,
          });
        });
        const usersRef = firebase.database().ref('users');
        usersRef.once('value', (snapshot) => {
          this.setState({
            users: snapshot.val(),
          });
        });
      }
    });
  }
  handleClickCell(i, j) {
    const tictactoeCellRef = firebase
      .database()
      .ref(`games/tictactoe/${i}/${j}`);
    tictactoeCellRef.once('value', (snapshot) => {
      const cell = snapshot.val();
      if (cell && cell.userId && cell.userId !== this.props.user.uid) {
        return;
      } else if (cell && cell.userId === this.props.user.uid) {
        tictactoeCellRef.set('');
      } else {
        tictactoeCellRef.set({
          userId: this.props.user.uid,
          photoURL: this.props.user.photoURL,
        });
      }
    });
  }
  save(tictactoe) {
    const tictactoeRef = firebase.database().ref(`games/tictactoe`);
    tictactoeRef.update(tictactoe);
  }
  expandBoard() {
    const tictactoe = this.state.tictactoe;
    if (tictactoe.length >= 19) {
      return;
    }
    // add cell to end of each row
    tictactoe.forEach((row, i) => {
      tictactoe[i].push('');
    });
    // add new row
    tictactoe.push(new Array(this.state.tictactoe[0].length).fill(''));
    this.save(tictactoe);
  }
  reduceBoard() {
    const tictactoe = this.state.tictactoe;
    if (tictactoe.length <= 3) {
      return;
    }
    // remove last row
    tictactoe[tictactoe.length - 1].fill(null);
    // remove cell from end of each row
    tictactoe.forEach((row, i) => {
      tictactoe[i].pop();
    });
    this.save(tictactoe);
  }
  resetGame() {
    const tictactoe = this.state.tictactoe;
    for (let i = 0; i < tictactoe.length; i++) {
      tictactoe[i].fill('');
    }
    this.save(tictactoe);
  }
  render() {
    return (
      <>
        <Card>
          <Card.Body>
            <h2 style={{ marginBottom: 0 }}>
              Tic-tac-toe{' '}
              <small className="text-muted">(public chaos board)</small>
            </h2>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            {` Size: ${this.state.tictactoe.length} x ${this.state.tictactoe.length}`}
            <div className="ml-2">
              <BoardButtons
                tictactoe={this.state.tictactoe}
                expandBoard={this.expandBoard}
                reduceBoard={this.reduceBoard}
              />
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <table id="tictactoe">
              <tbody>
                {this.state.tictactoe.map((row, i) => {
                  const emptyFixedRow = Array.from(row, (item) =>
                    typeof item === 'undefined' ? '' : item
                  );
                  return (
                    <tr key={i}>
                      {emptyFixedRow.map((cell, j) => {
                        return (
                          <td
                            key={j}
                            onClick={() => this.handleClickCell(i, j)}
                          >
                            {cell.photoURL ? (
                              <img
                                src={cell.photoURL}
                                alt="user"
                                style={{ height: 45 }}
                              />
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Count</Card.Title>
            <Table>
              <tbody>
                {Object.entries(count(this.state.tictactoe))
                  .sort((a, b) => b[1] - a[1])
                  .map((count, index) => {
                    const userId = count[0];
                    const amount = count[1];
                    return (
                      <tr>
                        <td>
                          {userId &&
                          this.state.users[userId] &&
                          this.state.users[userId].photoURL ? (
                            <img
                              src={this.state.users[userId].photoURL}
                              alt="user"
                              style={{ height: 48 }}
                            />
                          ) : null}
                        </td>
                        <td>{amount}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        <div className="mt-5 float-right">
          <Button onClick={this.resetGame} variant="danger" size="sm">
            Reset Game
          </Button>
        </div>
      </>
    );
  }
}
