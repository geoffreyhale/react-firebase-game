import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import firebase, { auth } from '../../../firebase.js';

import './index.css';

const BoardButtons = ({ board, expandBoard, reduceBoard }) => (
  <div style={{ display: 'inline-block' }}>
    <Button
      style={{ borderRadius: '2rem' }}
      onClick={expandBoard}
      disabled={board.length >= 19 && true}
    >
      +
    </Button>
    <Button
      style={{ borderRadius: '2rem' }}
      onClick={reduceBoard}
      variant="danger"
      disabled={board.length <= 3 && true}
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

const MostRecent = ({ mostRecent }) => (
  <div>
    Most Recent Move By:{' '}
    {mostRecent && mostRecent.photoURL ? (
      <img src={mostRecent.photoURL} alt="user" style={{ height: 45 }} />
    ) : null}
  </div>
);

export default class TicTacToe extends Component {
  constructor() {
    super();
    this.state = { board: [], users: {} };
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
            board: tictactoe.board,
            mostRecent: tictactoe.mostRecent,
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
    const tictactoeBoardCellRef = firebase
      .database()
      .ref(`games/tictactoe/board/${i}/${j}`);
    tictactoeBoardCellRef.once('value', (snapshot) => {
      const cell = snapshot.val();
      if (cell && cell.userId && cell.userId !== this.props.user.uid) {
        return;
      } else if (cell && cell.userId === this.props.user.uid) {
        tictactoeBoardCellRef.set('');
        const mostRecentRef = firebase
          .database()
          .ref(`games/tictactoe/mostRecent`);
        mostRecentRef.set(cell);
      } else {
        const cell = {
          userId: this.props.user.uid,
          photoURL: this.props.user.photoURL,
        };
        tictactoeBoardCellRef.set(cell);
        const mostRecentRef = firebase
          .database()
          .ref(`games/tictactoe/mostRecent`);
        mostRecentRef.set(cell);
      }
    });
  }
  save(board) {
    const tictactoeBoardRef = firebase.database().ref(`games/tictactoe/board`);
    tictactoeBoardRef.update(board);
  }
  expandBoard() {
    const board = this.state.board;
    if (board.length >= 19) {
      return;
    }
    // add cell to end of each row
    board.forEach((row, i) => {
      board[i].push('');
    });
    // add new row
    board.push(new Array(this.state.board[0].length).fill(''));
    this.save(board);
  }
  reduceBoard() {
    const board = this.state.board;
    if (board.length <= 3) {
      return;
    }
    // remove last row
    board[board.length - 1].fill(null);
    // remove cell from end of each row
    board.forEach((row, i) => {
      board[i].pop();
    });
    this.save(board);
  }
  resetGame() {
    const board = this.state.board;
    for (let i = 0; i < board.length; i++) {
      board[i].fill('');
    }
    this.save(board);
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
            {` Size: ${this.state.board.length} x ${this.state.board.length}`}
            <div className="ml-2">
              <BoardButtons
                board={this.state.board}
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
                {this.state.board.map((row, i) => {
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
            <MostRecent mostRecent={this.state.mostRecent} />
            <Card.Title>Count</Card.Title>
            <Table>
              <tbody>
                {Object.entries(count(this.state.board))
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
