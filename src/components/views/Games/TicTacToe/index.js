import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { AppContext } from '../../../AppProvider';
import firebase, { auth } from '../../../firebase.js';
import { getUsers } from '../../../../api/index';
import { UserPhoto } from '../../../shared/User';

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
    {mostRecent && mostRecent.userId ? (
      <UserPhoto uid={mostRecent.userId} size={45} />
    ) : null}
  </div>
);

const penteSet = (value) => {
  firebase.database().ref('games/tictactoe/pente').set(value);
};

const penteBoardUpdate = ({ i, j, uid }) => {
  const boardRef = firebase.database().ref('games/tictactoe/board');
  boardRef.once('value', (snapshot) => {
    const board = snapshot.val();

    [
      [i - 1, j + 1, i - 2, j + 2, i - 3, j + 3],
      [i - 1, j - 1, i - 2, j - 2, i - 3, j - 3],
      [i - 1, j - 0, i - 2, j - 0, i - 3, j - 0],
      [i + 1, j - 1, i + 2, j - 2, i + 3, j - 3],
      [i + 1, j - 0, i + 2, j - 0, i + 3, j - 0],
      [i + 1, j + 1, i + 2, j + 2, i + 3, j + 3],
      [i - 0, j - 1, i - 0, j - 2, i - 0, j - 3],
      [i - 0, j + 1, i - 0, j + 2, i - 0, j + 3],
    ].forEach(([i1, j1, i2, j2, i3, j3]) => {
      if (
        board[i1] &&
        board[i1][j1] &&
        board[i1][j1].userId &&
        board[i1][j1].userId != uid
      ) {
        const oneAwayUserId = board[i1][j1].userId;
        if (board[i2] && board[i2][j2] && board[i2][j2].userId) {
          if (oneAwayUserId == board[i2][j2].userId) {
            if (board[i3] && board[i3][j3] && board[i3][j3].userId == uid) {
              firebase
                .database()
                .ref(`games/tictactoe/board/${i1}/${j1}`)
                .set('');
              firebase
                .database()
                .ref(`games/tictactoe/board/${i2}/${j2}`)
                .set('');
            }
          }
        }
      }
    });
  });
};

export default class TicTacToe extends Component {
  constructor() {
    super();
    this.state = { board: [], users: {}, mostRecent: {} };
    this.expandBoard = this.expandBoard.bind(this);
    this.reduceBoard = this.reduceBoard.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.save = this.save.bind(this);
  }

  static contextType = AppContext;
  user = () => this.context.user;

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
        getUsers((users) =>
          this.setState({
            users,
          })
        );
      }
    });
  }

  handleClickCell(i, j) {
    const tictactoeBoardCellRef = firebase
      .database()
      .ref(`games/tictactoe/board/${i}/${j}`);

    tictactoeBoardCellRef.once('value', (snapshot) => {
      const existingCell = snapshot.val();
      const cellOccupiedByOther =
        existingCell &&
        existingCell.userId &&
        existingCell.userId !== this.user().uid;
      const cellOccupiedBySelf =
        existingCell && existingCell.userId === this.user().uid;

      if (cellOccupiedByOther) {
        return;
      }

      const cell = {
        userId: this.user().uid,
        photoURL: this.user().photoURL,
      };
      if (cellOccupiedBySelf) {
        tictactoeBoardCellRef.set('');
      } else {
        tictactoeBoardCellRef.set(cell);
      }

      const mostRecentRef = firebase
        .database()
        .ref(`games/tictactoe/mostRecent`);
      mostRecentRef.set({
        userId: this.user().uid,
        photoURL: this.user().photoURL,
        i: i,
        j: j,
      });
    });

    penteBoardUpdate({ i, j, uid: this.user().uid });
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
                            style={{
                              border:
                                this.state.mostRecent.i === i &&
                                this.state.mostRecent.j === j
                                  ? '2px solid deepskyblue'
                                  : null,
                            }}
                          >
                            {cell.userId ? (
                              <UserPhoto uid={cell.userId} size={45} />
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
                          {userId ? <UserPhoto uid={userId} size={48} /> : null}
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
