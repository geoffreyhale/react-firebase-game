import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { AppContext } from '../../../AppProvider';
import firebase, { auth } from '../../../firebase.js';
import { getUsers } from '../../../../api/index';
import { UserPhoto } from '../../../shared/User';
import friendlyTimestamp from '../../../shared/friendlyTimestamp';

import './index.css';

const tictactoeRef = () => firebase.database().ref('games/tictactoe');
const mostRecentRef = () =>
  firebase.database().ref(`games/tictactoe/mostRecent`);
const boardRef = () => firebase.database().ref(`games/tictactoe/board`);
const cellRef = (i, j) =>
  firebase.database().ref(`games/tictactoe/board/${i}/${j}`);
const logRef = (key = null) =>
  firebase.database().ref(`games/tictactoe/log${key ? '/' + key : ''}`);

const addLog = (msg) => {
  const key = logRef().push().key;
  logRef(key).set({ t: firebase.database.ServerValue.TIMESTAMP, msg });
};

const Log = ({ log }) =>
  log &&
  typeof log === 'object' && (
    <table>
      {Object.values(log)
        .sort((a, b) => b.t - a.t)
        .map((entry) => (
          <tr>
            <td>{entry.t}</td>
            <td style={{ textAlign: 'right' }}>
              ({friendlyTimestamp(entry.t, ' ago')}):
            </td>
            <td>{entry.msg}</td>
          </tr>
        ))}
    </table>
  );

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

const penteBoardUpdate = ({ i, j, uid }) => {
  boardRef().once('value', (snapshot) => {
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
              cellRef(i1, j1).set('');
              cellRef(i2, j2).set('');
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
    this.state = { board: [], users: {}, mostRecent: {}, log: {} };
    this.expandBoard = this.expandBoard.bind(this);
    this.reduceBoard = this.reduceBoard.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  static contextType = AppContext;
  user = () => this.context.user;

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        tictactoeRef().on('value', (snapshot) => {
          const tictactoe = snapshot.val();
          this.setState({
            board: tictactoe.board,
            mostRecent: tictactoe.mostRecent,
          });
        });
        logRef().on('value', (snapshot) => {
          const log = snapshot.val();
          this.setState({
            log,
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
    cellRef(i, j).once('value', (snapshot) => {
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
        cellRef(i, j).set('');
        addLog(`${this.user().displayName} removed ${i},${j}`);
      } else {
        cellRef(i, j).set(cell);
        addLog(`${this.user().displayName} put ${i},${j}`);
      }

      mostRecentRef().set({
        userId: this.user().uid,
        photoURL: this.user().photoURL,
        i: i,
        j: j,
      });
    });

    penteBoardUpdate({ i, j, uid: this.user().uid });
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
    boardRef().update(board);
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
    boardRef().update(board);
  }
  resetGame() {
    const board = this.state.board;
    for (let i = 0; i < board.length; i++) {
      board[i].fill('');
    }
    boardRef().update(board);
    mostRecentRef().set(null);
    logRef().set(null);
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
                            className={
                              this.state.mostRecent &&
                              this.state.mostRecent.i === i &&
                              this.state.mostRecent.j === j
                                ? 'most-recent'
                                : null
                            }
                          >
                            {cell.userId ? (
                              <UserPhoto
                                uid={cell.userId}
                                size={45}
                                roundedCircle={true}
                                noLink={true}
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
        <Log log={this.state.log} />
      </>
    );
  }
}
