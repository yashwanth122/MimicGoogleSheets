import { cellIdToMatrixIndices } from "./cellIdToMatrixIndices";
import { SheetSizeState } from "store/SheetSizeState";
import { EvaluatedCellValueState } from "store/EvaluatedCellValueState";
import { getCellRange } from "./getCellRange";

export const simplifyExpression = (expression, getState) => {
  const evaluatedValues = [];
  expression
    .match(
      /(((SUM|PROD|AVG|MIN|MAX)\(([A-Z]{1,}\d{1,}):([A-Z]{1,}\d{1,})\))|((?!(SUM\(|PROD\(|AVG\(|MIN\(|MAX\(|:))([A-Z]{1,}\d{1,})(?![):])))/g
    )
    ?.forEach((exp) => {
      // range operation
      if (/([A-Z]{1,2}\d{1,2}:[A-Z]{1,2}\d{1,2})/g.test(exp)) {
        if (/^(?!(SUM)|(PROD)|(AVG)|(MIN)|(MAX)).+/g.test(exp)) {
          return {
            simplifiedExpression: "!ERROR",
            cellReferences: [],
          };
        }
        const { values, cellReferences } = getCellRange(exp, getState);
        switch (exp.match(/(SUM|PROD|AVG|MIN|MAX)/g)[0]) {
          case "SUM":
            evaluatedValues.push({
              expression: exp,
              value: values.reduce((acc, value) => acc + value),
              cellReferences,
            });
            break;
          case "PROD":
            evaluatedValues.push({
              expression: exp,
              value: values.reduce((acc, value) => acc * value),
              cellReferences,
            });
            break;
          case "AVG":
            evaluatedValues.push({
              expression: exp,
              value: values.reduce((acc, value) => acc + value) / values.length,
              cellReferences,
            });
            break;
          case "MIN":
            evaluatedValues.push({
              expression: exp,
              value: Math.min(...values),
              cellReferences,
            });
            break;
          case "MAX":
            evaluatedValues.push({
              expression: exp,
              value: Math.max(...values),
              cellReferences,
            });
            break;
        }
        // single cell reference
      } else {
        const columnLetter = exp.slice(0, 1);
        const rowNumber = exp.slice(1);
        const { rows, columns } = getState(SheetSizeState);
        const columnLetterCharCode = columnLetter.charCodeAt(0) - 64;
        // check for invalid reference
        if (
          columnLetterCharCode > columns ||
          columnLetterCharCode < 0 ||
          rowNumber > rows ||
          rowNumber < 0
        ) {
          return {
            simplifiedExpression: "!ERROR",
            cellReferences: [],
          };
        }
        const { row, column } = cellIdToMatrixIndices(exp);
        const evalState = getState(EvaluatedCellValueState(`${row},${column}`));
        const evaluatedCellValueState =
          typeof evalState.evaluatedCellValueState !== "undefined"
            ? evalState.evaluatedCellValueState
            : evalState.contents.evaluatedCellValueState;
        evaluatedValues.push({
          expression: exp,
          value: evaluatedCellValueState ? evaluatedCellValueState : 0,
          cellReferences: [exp],
        });
      }
    });
  return {
    simplifiedExpression: `(${evaluatedValues.reduce(
      (finalExpression, { expression, value }) =>
        finalExpression.replace(expression, value),
      expression
    )})`,
    cellReferences: evaluatedValues.reduce(
      (finalExpression, { cellReferences }) => {
        return finalExpression.concat(cellReferences);
      },
      []
    ),
  };
};
