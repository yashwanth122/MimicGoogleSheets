import { charToNumbers } from "./charToNumbers";

export const cellIdToMatrixIndices = (cellId) => {
  const columnLetters = cellId.match(/[A-Z]+/)[0];
  const columnNumber = charToNumbers(columnLetters);
  const rowNumber = parseInt(cellId.match(/[0-9]+/)[0]) - 1;
  return {
    column: columnNumber,
    row: rowNumber,
  };
};
