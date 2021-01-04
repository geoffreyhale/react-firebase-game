import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import firebase, { auth } from '../../../firebase.js';

import './index.css';

export default class TicTacToe extends Component {
  constructor() {
    super();
    this.state = { tictactoe: [], users: {} };
    this.save = this.save.bind(this);
  }
  save() {
    const tictactoeRef = firebase.database().ref('games/tictactoe');
    tictactoeRef.update(this.state.tictactoe);
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
      </>
    );
  }
}
