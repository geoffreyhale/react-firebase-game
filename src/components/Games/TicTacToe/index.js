import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
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

export default class TicTacToe extends Component {
  constructor() {
    super();
    this.state = { tictactoe: [], users: {} };
    this.expandBoard = this.expandBoard.bind(this);
    this.reduceBoard = this.reduceBoard.bind(this);
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
        {/* <div className="mt-5 float-right">
          <Button onClick={this.resetGame} variant="danger" size="sm">
            Reset Game
          </Button>
        </div> */}
      </>
    );
  }
}
