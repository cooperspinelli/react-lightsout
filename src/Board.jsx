import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  // use x and y TODO:
  // use chanceLightStartsOn TODO:
  function createBoard() {
    let initialBoard = [];
    for (let i = 0; i < nrows; i++) {
      let row = [];
      for (let j = 0; j < ncols; j++) {
        row.push(Math.random() < 0.5);
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  // TODO: the puzzle is won when all the lights are turned off
  function hasWon() {
    const topLeft = board[0][0];
    for (let i = 0; i < nrows; i++) {
      for (let j = 0; j < ncols; j++) {
        if (board[i][j] !== topLeft) return false;
      }
    }
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const boardCopy = structuredClone(oldBoard);

      flipCell(y, x, boardCopy);
      flipCell(y + 1, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y, x - 1, boardCopy);

      return boardCopy;
    });
  }

  // TODO: refactor this a bit
  return (<div>
    {hasWon()
      ? <h1>You have won!</h1>
      : <table>
        <tbody>
          {board.map((row, rowIdx) => (
            <tr key={`row-${rowIdx}`}>
              {row.map((el, colIdx) =>
                <Cell
                  key={`${rowIdx}-${colIdx}`}
                  isLit={el}
                  flipCellsAroundMe={() => flipCellsAround(`${rowIdx}-${colIdx}`)}
                />
              )}
            </tr>)
          )}
        </tbody>
      </table>}
  </div>);
}

export default Board;
