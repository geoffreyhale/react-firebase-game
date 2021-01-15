import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { AppContext } from '../../AppProvider';
import firebase from '../../../firebase.js';

import './index.css';

const pieceHash = {
  b: '&#9821;',
  k: '&#9818;',
  n: '&#9822;',
  p: '&#9823;',
  q: '&#9819;',
  r: '&#9820;',
  B: '&#9815;',
  K: '&#9812;',
  N: '&#9816;',
  P: '&#9817;',
  Q: '&#9813;',
  R: '&#9814;',
};

const Cell = ({ cell, children, onClick }) => {
  return (
    <td
      onClick={onClick}
      style={{
        height: 64,
        width: 64,
      }}
      className={cell && cell.walkable ? 'walkable' : null}
    >
      {cell && cell.piece ? (
        pieceHash[cell.piece] ? (
          <span
            dangerouslySetInnerHTML={{ __html: pieceHash[cell.piece] }}
          ></span>
        ) : (
          cell.piece
        )
      ) : null}
    </td>
  );
};

export default class Chess extends Component {
  constructor() {
    super();
    this.state = { users: {}, cells: [], holding: null };
    this.handleClickCell = this.handleClickCell.bind(this);
    this.reset = this.reset.bind(this);
  }

  static contextType = AppContext;
  user = () => this.context.user;
  usersRef = () => firebase.database().ref('users');
  gameChessRef = () => firebase.database().ref('games/chess');

  cellsRef = () => firebase.database().ref(`games/chess/cells`);

  componentDidMount() {
    this.usersRef().once('value', (snapshot) => {
      this.setState({
        users: snapshot.val(),
      });
    });
    this.cellsRef().on('value', (snapshot) => {
      const flatCellsArray = snapshot.val()
        ? Object.entries(snapshot.val()).map(([key, cell]) => {
            cell.key = key;
            return cell;
          })
        : [];
      this.setState({
        cells: flatCellsArray,
      });
    });
  }
  reset() {
    this.cellsRef().set(null);
    const board = [
      ['r', 'n', 'b', 'k', 'q', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'K', 'Q', 'B', 'N', 'R'],
    ];
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        const key = this.cellsRef().push().key;
        this.cellsRef().child(key).set({
          row: i,
          col: j,
          walkable: true,
          piece: cell,
        });
      });
    });
    this.setState({ holding: null });
  }
  handleClickCell(row, col) {
    this.cellsRef().once('value', (snapshot) => {
      const cells = snapshot.val();
      if (!cells) {
        console.log('No cells found; reset the board.');
      }

      const flatCellsArray = Object.entries(cells).map(([key, cell]) => {
        cell.key = key;
        return cell;
      });
      const existingCell = flatCellsArray.filter(
        (cell) => cell.row === row && cell.col === col
      )[0];

      // if not holding anything, toggle the cell walkable
      if (!this.state.holding) {
        if (!existingCell) {
          const key = this.cellsRef().push().key;
          const newCell = {
            row: row,
            col: col,
            walkable: true,
          };
          this.cellsRef().child(key).set(newCell);
        } else {
          this.setState({ holding: existingCell.piece });
          this.cellsRef().child(existingCell.key).update({ piece: null });
        }
        return;
      }

      if (this.state.holding) {
        if (!existingCell) {
          console.log('You can`t move here!');
        } else if (
          existingCell &&
          existingCell.piece &&
          this.state.holding &&
          (existingCell.piece.toUpperCase() === existingCell.piece) ===
            (this.state.holding.toUpperCase() === this.state.holding)
        ) {
          console.log('You can`t take your own piece');
        } else {
          this.cellsRef().child(existingCell.key).update({
            piece: this.state.holding,
          });
          this.setState({ holding: null });
        }
        return;
      }
    });
  }
  render() {
    return (
      <>
        <Card>
          <Card.Body>
            <table id="chess">
              <tbody>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => {
                  return (
                    <tr>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((col) => {
                        return (
                          <Cell
                            onClick={() => {
                              this.handleClickCell(row, col);
                            }}
                            cell={
                              this.state.cells &&
                              this.state.cells.filter(
                                (cell) => cell.row === row && cell.col === col
                              )[0]
                            }
                          ></Cell>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card.Body>
        </Card>
        <Button onClick={this.reset}>Reset</Button>
        <div>{this.state.holding}</div>
      </>
    );
  }
}
