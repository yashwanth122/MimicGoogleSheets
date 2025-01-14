import React, { useEffect } from "react";

function InstructionsModal({ isOpen, setIsOpen }) {
  const onClickOutsideModalHandler = (e) => {
    if (e.target.className === "modal modal-open") {
      setIsOpen(false);
    }
  };

  const onEscapeKeyPressHandler = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", onClickOutsideModalHandler);
    document.addEventListener("keydown", onEscapeKeyPressHandler);
    return () => {
      document.removeEventListener("click", onClickOutsideModalHandler);
      document.removeEventListener("keydown", onEscapeKeyPressHandler);
    };
  }, []);

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <p>Valid formulas in each cell include any combination of a(n):</p>
        <ul className="list-disc ml-10">
          <li>number value</li>
          <li>arithmetic expression (ex. 1 + 1)</li>
          <li>reference to another cell (ex. A1)</li>
          <li>operation on a range of cells (ex. SUM(A1:A3))</li>
        </ul>
        <br />
        <p>
          * Valid range operations include:{" "}
          <span className="font-bold">SUM</span>,{" "}
          <span className="font-bold">PROD</span>,{" "}
          <span className="font-bold">AVG</span>,{" "}
          <span className="font-bold">MIN</span>, and{" "}
          <span className="font-bold">MAX</span>. These operations must be in
          capital letters and in the form: [operation]([start cell]:[end cell])
        </p>
        <br />
        <p>
          * Cells should <span className="font-bold">not</span> start with "="
        </p>
        <div className="modal-action">
          <button onClick={() => setIsOpen(false)} className="btn">
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstructionsModal;
