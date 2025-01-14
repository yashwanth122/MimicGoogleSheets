import React, { useState, useRef, useEffect } from "react";
import { useRecoilState, useRecoilValue, useRecoilCallback } from "recoil";
import { CellValueState } from "store/CellValueState";
import { EvaluatedCellValueState } from "store/EvaluatedCellValueState";

export const CELL_WIDTH = 100;
export const CELL_HEIGHT = 25;

function Cell({ cellId }) {
  const [mounted, setMounted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const inputRef = useRef(null);
  const [cellValue, setCellValue] = useRecoilState(CellValueState(cellId));
  const { evaluatedCellValueState, cellReferences } = useRecoilValue(
    EvaluatedCellValueState(cellId)
  );
  const [currentReferences, setCurrentReferences] = useState(cellReferences);
  const highlightReferences = useRecoilCallback(({ snapshot, set }) => () => {
    if (mounted) {
      cellReferences.forEach((cellRef) => {
        const _cellId = `${cellRef.slice(1) - 1},${cellRef.charCodeAt(0) - 65}`;
        const { contents } = snapshot.getLoadable(CellValueState(_cellId));
        set(CellValueState(_cellId), { ...contents, highlighted: true });
      });
    }
    setMounted(true);
  });
  const unHighlightReferences = useRecoilCallback(({ snapshot, set }) => () => {
    cellReferences.forEach((cellRef) => {
      const _cellId = `${cellRef.slice(1) - 1},${cellRef.charCodeAt(0) - 65}`;
      const { contents } = snapshot.getLoadable(CellValueState(_cellId));
      set(CellValueState(_cellId), { ...contents, highlighted: false });
    });
  });
  const unHighlightCell = useRecoilCallback(({ snapshot, set }) => (cellId) => {
    const _cellId = `${cellId.slice(1) - 1},${cellId.charCodeAt(0) - 65}`;
    const { contents } = snapshot.getLoadable(CellValueState(_cellId));
    set(CellValueState(_cellId), { ...contents, highlighted: false });
  });

  // set error property
  useEffect(() => {
    setCellValue({
      ...cellValue,
      error: evaluatedCellValueState === "!ERROR",
    });
  }, [evaluatedCellValueState]);

  // set highlight property
  useEffect(() => {
    if (JSON.stringify(currentReferences) != JSON.stringify(cellReferences)) {
      cellReferences.length && highlightReferences();
      currentReferences.forEach((cellRef) => {
        if (!cellReferences.includes(cellRef)) {
          unHighlightCell(cellRef);
        }
      });
      setCurrentReferences(cellReferences);
    }
  }, [cellReferences]);

  useEffect(() => {
    document.addEventListener("click", onClickOutsideInputHandler);
    return () => {
      document.removeEventListener("click", onClickOutsideInputHandler);
    };
  }, []);

  const changeLabelToInput = () => {
    setIsEditMode(true);
    setMounted(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const onClickOutsideInputHandler = (event) => {
    if (event.target?.dataset?.cellId !== cellId) {
      setIsEditMode(false);
    }
  };

  const onUnFocusInputHandler = (event) => {
    if (event.key === "Enter") {
      setIsEditMode(false);
      unHighlightReferences();
    }
  };

  const updateCellValueState = (event) => {
    setCellValue({ ...cellValue, value: event.target.value });
  };

  return isEditMode ? (
    <input
      className="flex-center w-full h-full text-base text-center border-2 border-blue-600"
      ref={inputRef}
      data-cell-id={cellId}
      value={cellValue.value}
      onChange={updateCellValueState}
      onKeyDown={onUnFocusInputHandler}
      onFocus={highlightReferences}
      onBlur={unHighlightReferences}
    />
  ) : (
    <div
      className="flex-center overflow-auto w-full h-full overflow-clip whitespace-nowrap text-center"
      data-cell-id={cellId}
      onClick={changeLabelToInput}
    >
      {evaluatedCellValueState}
    </div>
  );
}

export default Cell;
