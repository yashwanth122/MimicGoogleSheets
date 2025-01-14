import { simplifyExpression } from "utils/simplifyExpression";
import { SheetSizeState } from "store/SheetSizeState";

export const getCellRange = (exp, getState) => {
  const [start, end] = exp
    .match(/(([A-Z]{1,2}\d{1,2}:[A-Z]{1,2}\d{1,2}))/g)[0]
    .split(":");
  const columnLetter = exp.slice(0, 1);
  const rowNumber = exp.slice(1);
  const { contents } = getState(SheetSizeState);
  const rows = contents?.rows;
  const columns = contents?.columns;
  const columnLetterCharCode = columnLetter.charCodeAt(0) - 64;
  // check for invalid reference
  if (
    columnLetterCharCode > columns ||
    columnLetterCharCode < 0 ||
    rowNumber > rows ||
    rowNumber < 0
  ) {
    throw new Error();
  }
  let values = [];
  let cellReferences = [];
  // check for same column
  if (start.slice(0, 1) === end.slice(0, 1)) {
    const column = start.slice(0, 1);
    const startRow = parseInt(start.slice(1));
    const endRow = parseInt(end.slice(1));
    for (
      let row = Math.min(startRow, endRow);
      row <= Math.max(startRow, endRow);
      row++
    ) {
      const { simplifiedExpression } = simplifyExpression(
        `${column}${row}`,
        getState
      );
      values.push(parseInt(simplifiedExpression.match(/\d{1,2}/)[0]));
      cellReferences.push(`${column}${row}`);
    }
  }
  // check for same row
  if (start.slice(1) === end.slice(1)) {
    const row = start.slice(1);
    const startCol = parseInt(start.slice(0, 1).charCodeAt(0)) - 64;
    const endCol = parseInt(end.slice(0, 1).charCodeAt(0)) - 64;
    for (
      let column = Math.min(startCol, endCol);
      column <= Math.max(startCol, endCol);
      column++
    ) {
      const { simplifiedExpression } = simplifyExpression(
        `${String.fromCharCode(column + 64)}${row}`,
        getState
      );
      values.push(parseInt(simplifiedExpression.match(/\d{1,2}/)[0]));
      cellReferences.push(`${String.fromCharCode(column + 64)}${row}`);
    }
  }
  return {
    values,
    cellReferences,
  };
};
