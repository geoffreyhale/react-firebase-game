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

/**
 * TODO
 * - better indicators when it's your turn
 * - optional beginner mode indicate 4-in-a-row and/or 3-in-a-row-unanswered
 * - cleanup janky ui
 * - sit down to play (enables deeper features)
 * - user uid instead of userId
 */

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

const capture2Ref = () => firebase.database().ref(`games/tictactoe/capture2`);
const Capture2Toggle = ({ value }) => {
  return (
    <>
      <input
        id="capture2"
        type="checkbox"
        checked={!!value}
        onChange={() => capture2Ref().set(!value)}
      />
      <label htmlFor="capture2" className="ml-2">
        Capture 2
      </label>
    </>
  );
};

const Log = ({ log, showCount }) =>
  log &&
  typeof log === 'object' && (
    <table>
      {Object.values(log)
        .sort((a, b) => b.t - a.t)
        .slice(0, showCount)
        .map((entry) => (
          <tr>
            <td>{entry.t}</td>
            <td style={{ textAlign: 'right' }}>
              ({friendlyTimestamp(entry.t, ' ago')}):
            </td>
            <td>{entry.msg}</td>
          </tr>
        ))}
      {Object.keys(log).length > showCount && (
        <tr>
          <td>...</td>
        </tr>
      )}
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
  let captureOccurred = false;
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
        board[i1][j1].userId !== uid
      ) {
        const oneAwayUserId = board[i1][j1].userId;
        if (board[i2] && board[i2][j2] && board[i2][j2].userId) {
          if (oneAwayUserId === board[i2][j2].userId) {
            if (board[i3] && board[i3][j3] && board[i3][j3].userId === uid) {
              cellRef(i1, j1).set('');
              cellRef(i2, j2).set('');
              captureOccurred = true;
            }
          }
        }
      }
    });
  });
  return captureOccurred;
};

// TODO this can many ways be optimized
const getArrayOfArraysOfFiveInARowCells = (board) => {
  const winningCells = [];
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      [
        [i, j, i - 1, j - 1, i - 2, j - 2, i - 3, j - 3, i - 4, j - 4],
        [i, j, i - 0, j - 1, i - 0, j - 2, i - 0, j - 3, i - 0, j - 4],
        [i, j, i + 1, j - 1, i + 2, j - 2, i + 3, j - 3, i + 4, j - 4],
        [i, j, i - 1, j - 0, i - 2, j - 0, i - 3, j - 0, i - 4, j - 0],
        [i, j, i - 1, j - 1, i - 2, j - 2, i - 3, j - 3, i - 4, j - 4],
        [i, j, i - 1, j + 1, i - 2, j + 2, i - 3, j + 3, i - 4, j + 4],
        [i, j, i + 1, j + 1, i + 2, j + 2, i + 3, j + 3, i + 4, j + 4],
        [i, j, i + 1, j - 0, i + 2, j - 0, i + 3, j - 0, i + 4, j - 0],
      ].forEach(([i0, j0, i1, j1, i2, j2, i3, j3, i4, j4]) => {
        const cellIsOccupiedWithUid0 =
          board[i0] && board[i0][j0] && board[i0][j0].userId;
        const cellIsOccupiedWithUid1 =
          board[i1] && board[i1][j1] && board[i1][j1].userId;
        const cellIsOccupiedWithUid2 =
          board[i2] && board[i2][j2] && board[i2][j2].userId;
        const cellIsOccupiedWithUid3 =
          board[i3] && board[i3][j3] && board[i3][j3].userId;
        const cellIsOccupiedWithUid4 =
          board[i4] && board[i4][j4] && board[i4][j4].userId;
        if (
          cellIsOccupiedWithUid0 &&
          cellIsOccupiedWithUid1 &&
          cellIsOccupiedWithUid2 &&
          cellIsOccupiedWithUid3 &&
          cellIsOccupiedWithUid4 &&
          cellIsOccupiedWithUid0 === cellIsOccupiedWithUid1 &&
          cellIsOccupiedWithUid0 === cellIsOccupiedWithUid2 &&
          cellIsOccupiedWithUid0 === cellIsOccupiedWithUid3 &&
          cellIsOccupiedWithUid0 === cellIsOccupiedWithUid4
        ) {
          winningCells.push([
            { i: i0, j: j0 },
            { i: i1, j: j1 },
            { i: i2, j: j2 },
            { i: i3, j: j3 },
            { i: i4, j: j4 },
          ]);
        }
      });
    });
  });
  return winningCells;
};

export default class TicTacToe extends Component {
  constructor() {
    super();
    this.state = {
      board: [],
      users: {},
      mostRecent: {},
      log: {},
      capture2: null,
    };
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
          const { board, mostRecent } = tictactoe;
          const arrayOfArraysOfFiveInARowCells = getArrayOfArraysOfFiveInARowCells(
            board
          );

          board.forEach((row, i) =>
            row.forEach((cell, j) => {
              //TODO don't use empty strings anymore as placeholders for empty cells
              if (typeof board[i][j] === 'object') {
                board[i][j].isAWinningCell =
                  arrayOfArraysOfFiveInARowCells &&
                  !!arrayOfArraysOfFiveInARowCells.some(
                    (arrayOfFiveInARowCells) =>
                      arrayOfFiveInARowCells.some(
                        (winningCell) =>
                          winningCell.i === i && winningCell.j === j
                      )
                  );
              }
            })
          );

          this.setState({
            board,
            mostRecent,
          });
        });
        logRef().on('value', (snapshot) => {
          const log = snapshot.val();
          this.setState({
            log,
          });
        });
        capture2Ref().on('value', (snapshot) => {
          const capture2 = snapshot.val();
          this.setState({
            capture2,
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
      };
      if (cellOccupiedBySelf) {
        cellRef(i, j).set('');
        addLog(`${this.user().displayName} removed ${i},${j}`);
      } else {
        cellRef(i, j).set(cell);
        addLog(`${this.user().displayName} put ${i},${j}`);

        if (this.state.capture2) {
          const captureOccured = penteBoardUpdate({
            i,
            j,
            uid: this.user().uid,
          });
          captureOccured && addLog(`${this.user().displayName} captured 2`);
        }
      }

      mostRecentRef().set({
        userId: this.user().uid,
        i: i,
        j: j,
      });
    });
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
            <Capture2Toggle value={this.state.capture2} />
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div style={{ display: 'inline-block' }}>
              <table id="tictactoe">
                <tbody>
                  {this.state.board.map((row, i) => {
                    const emptyFixedRow = Array.from(row, (item) =>
                      typeof item === 'undefined' ? '' : item
                    );
                    return (
                      <tr key={i}>
                        {emptyFixedRow.map((cell, j) => {
                          const { mostRecent } = this.state;
                          const thisCellIsMostRecent =
                            mostRecent &&
                            mostRecent.i === i &&
                            mostRecent.j === j;
                          return (
                            <td
                              key={j}
                              onClick={() => this.handleClickCell(i, j)}
                              className={
                                (thisCellIsMostRecent ? 'most-recent' : null) +
                                ' ' +
                                (cell.isAWinningCell ? 'win' : null)
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
            </div>
            <div
              className="ml-3"
              style={{ display: 'inline-block', verticalAlign: 'top' }}
            >
              <Log
                log={this.state.log}
                showCount={(this.state.board.length * 39) / 19}
              />
            </div>
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
