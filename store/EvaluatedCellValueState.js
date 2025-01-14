import { selector } from "recoil";
import { CellValueState } from "./CellValueState";
import { evaluate } from "mathjs";
import { memoize } from "utils/memoize";
import { simplifyExpression } from "utils/simplifyExpression";

export const EvaluatedCellValueState = (cellId) =>
  memoize(`evaluatedCell_${cellId}`, () =>
    selector({
      key: `evaluatedCell_${cellId}`,
      get: ({ get }) => {
        const { value } = get(CellValueState(cellId));
        try {
          if (!value) {
            return {
              evaluatedCellValueState: "",
              cellReferences: [],
            };
          }
          const { simplifiedExpression, cellReferences } = simplifyExpression(
            value,
            get
          );
          const result = evaluate(simplifiedExpression);
          if (
            result == "Infinity" ||
            typeof result === "object" ||
            isNaN(result)
          ) {
            return {
              evaluatedCellValueState: "!ERROR",
              cellReferences,
            };
          }
          return {
            evaluatedCellValueState: /\d{0,}\.\d{3,}/.test(result.toString())
              ? result.toFixed(2)
              : result,
            cellReferences,
          };
        } catch (e) {
          return { evaluatedCellValueState: "!ERROR", cellReferences: [] };
        }
      },
    })
  );
