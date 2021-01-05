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
    tictactoeCellRef.set({
      userId: this.props.user.uid,
      photoURL: this.props.user.photoURL,
    });
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

    const tictactoeRef = firebase.database().ref(`games/tictactoe`);
    tictactoeRef.update(tictactoe);
  }
  reduceBoard() {
    const tictactoe = this.state.tictactoe;
    if (tictactoe.length <= 3) {
      return;
    }
    // remove last row
    tictactoe[tictactoe.length - 1].forEach((cell, i) => {
      tictactoe[tictactoe.length - 1][i] = null;
    });
    // remove cell from end of each row
    tictactoe.forEach((row, i) => {
      tictactoe[i].pop();
    });
    const tictactoeRef = firebase.database().ref(`games/tictactoe`);
    tictactoeRef.update(tictactoe);
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
            <BoardButtons
              tictactoe={this.state.tictactoe}
              expandBoard={this.expandBoard}
              reduceBoard={this.reduceBoard}
            />
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <table id="tictactoe" style={{ display: 'inline-block' }}>
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
            <BoardButtons
              tictactoe={this.state.tictactoe}
              expandBoard={this.expandBoard}
              reduceBoard={this.reduceBoard}
            />
          </Card.Body>
        </Card>
      </>
    );
  }
}
