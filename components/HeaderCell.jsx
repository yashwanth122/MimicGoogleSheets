import React from "react";

function HeaderCell({ children }) {
  return (
    <th className="text-center bg-green-400 border-2 border-green-700 p-[4px] border">
      {children}
    </th>
  );
}

export default HeaderCell;
