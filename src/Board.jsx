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

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let y = 0; y < nrows; y++) {
      let row = [];
      for (let x = 0; x < ncols; x++) {
        row.push(false);
      }
      initialBoard.push(row);
    }

    for (let i = 0; i < 100; i++) {
      const x = Math.floor(Math.random() * ncols);
      const y = Math.floor(Math.random() * nrows);
      const coord = `${y}-${x}`;
      RandomizeBoard(coord, initialBoard);
    }

    return initialBoard;
  }

  function hasWon() {
    for (let i = 0; i < nrows; i++) {
      for (let j = 0; j < ncols; j++) {
        if (board[i][j] === true) return false;
      }
    }
    return true;
  }

  function RandomizeBoard(coord, board) {
    const [y, x] = coord.split("-").map(Number);

    const flipCell = (y, x, board) => {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    };

    flipCell(y, x, board);
    flipCell(y + 1, x, board);
    flipCell(y - 1, x, board);
    flipCell(y, x + 1, board);
    flipCell(y, x - 1, board);
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

  function generateBoardRow(row, rowIdx) {
    return <tr key={`row-${rowIdx}`}>
      {row.map((el, colIdx) =>
        <Cell
          key={`${rowIdx}-${colIdx}`}
          isLit={el}
          flipCellsAroundMe={() => flipCellsAround(`${rowIdx}-${colIdx}`)}
        />
      )}
    </tr>;

  }

  return (<div>
    {hasWon()
      ? <h1>You have won!</h1>
      : <table>
        <tbody>
          {board.map((row, rowIdx) => (generateBoardRow(row, rowIdx))
          )}
        </tbody>
      </table>}
  </div>);
}

export default Board;
