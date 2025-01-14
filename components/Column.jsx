import React from "react";
import { CellValueState } from "store/CellValueState";
import { useRecoilValue } from "recoil";

function Column({ children, position: { row, column } }) {
  const { error, highlighted } = useRecoilValue(
    CellValueState(`${row},${column}`)
  );

  return (
    <td
      className={`min-w-[100px] max-w-[100px] h-8 ${
        error ? "bg-red-400" : "border-[#777]"
      } ${
        highlighted
          ? "border-blue-500 border-4 border-dotted shadow-xl bg-blue-100"
          : "border-[#777] border-2 border-solid shadow-none "
      }`}
    >
      {children}
    </td>
  );
}

export default Column;
