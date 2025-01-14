import React from "react";
import { useRecoilState } from "recoil";
import { SheetSizeState } from "store/SheetSizeState";
import { FaArrowsAlt } from "react-icons/fa";

const Resizer = () => {
  const [sheetSize, setSheetSize] = useRecoilState(SheetSizeState);

  const initDrag = () => {
    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  const doDrag = (event) => {
    const pointerX = event.pageX;
    const pointerY = event.pageY;

    setSheetSize({
      ...sheetSize,
      width: pointerX,
      height: pointerY,
    });
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", doDrag);
    document.removeEventListener("mouseup", stopDrag);
  };

  return (
    <div
      onMouseDown={initDrag}
      className="h-6 absolute right-[-8px] bottom-[-8px] w-6 rounded-md bg-[#2A2E37] flex justify-center items-center text-white cursor-[se-resize]"
    >
      <FaArrowsAlt />
    </div>
  );
};

export default Resizer;
