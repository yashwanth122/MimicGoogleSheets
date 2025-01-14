import React, { useEffect } from "react";
import Column from "./Column";
import Row from "./Row";
import HeaderCell from "./HeaderCell";
import Cell, { CELL_HEIGHT, CELL_WIDTH } from "./Cell";
import Resizer from "./Resizer";
import { numberToChar } from "utils/numberToChar";
import { SheetSizeState } from "store/SheetSizeState";
import { useRecoilState } from "recoil";

function Sheet() {
  const [sheetSize, setSheetSize] = useRecoilState(SheetSizeState);
  const numberOfColumns = Math.ceil(sheetSize.width / CELL_WIDTH);
  const numberOfRows = Math.ceil(sheetSize.height / CELL_HEIGHT);

  useEffect(() => {
    setSheetSize({
      ...sheetSize,
      rows: numberOfRows,
      columns: numberOfColumns,
    });
  }, [sheetSize.width, sheetSize.height]);

  return (
    <div className="relative left-0 self-start bg-[rgba(255,255,255,0.1)] lg:absolute">
      <table className="bg-[rgba(255,255,255,0.1)] dark:bg-black">
        <tbody>
          <Row>
            {[...Array(numberOfColumns + 1)].map((_, columnIndex) =>
              columnIndex !== 0 ? (
                <HeaderCell key={`column_${columnIndex}`}>
                  {numberToChar(columnIndex - 1)}
                </HeaderCell>
              ) : (
                <HeaderCell key={`column_${columnIndex}`} />
              )
            )}
          </Row>
          {[...Array(numberOfRows)].map((_, rowIndex) => (
            <Row key={`row${rowIndex}`}>
              <HeaderCell>{rowIndex + 1}</HeaderCell>
              {[...Array(numberOfColumns)].map((_, columnIndex) => (
                <Column
                  key={`column_${columnIndex}`}
                  position={{ row: rowIndex, column: columnIndex }}
                >
                  <Cell cellId={`${rowIndex},${columnIndex}`} />
                </Column>
              ))}
            </Row>
          ))}
        </tbody>
      </table>
      <Resizer />
    </div>
  );
}

export default Sheet;
