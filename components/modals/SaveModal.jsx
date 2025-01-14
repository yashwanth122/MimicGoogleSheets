import React, { useEffect, useState } from "react";
import { useRecoilCallback } from "recoil";
import { SheetSizeState } from "store/SheetSizeState";
import { EvaluatedCellValueState } from "store/EvaluatedCellValueState";
import { CellValueState } from "store/CellValueState";
import { setDoc, doc } from "firebase/firestore/lite";
import { db } from "firebaseConfig";

function SaveModal({ isOpen, setIsOpen, slug }) {
  const [color, setColor] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const getSheet = useRecoilCallback(({ snapshot }) => () => {
    const info = snapshot.getLoadable(SheetSizeState).contents;
    const { rows, columns } = info;
    const data = [];
    [...Array(rows)].forEach((_, rowIndex) => {
      const row = [];
      [...Array(columns)].forEach((_, columnIndex) => {
        const cellValue = snapshot.getLoadable(
          CellValueState(`${rowIndex},${columnIndex}`)
        ).contents;
        const evaluatedCellValue = snapshot.getLoadable(
          EvaluatedCellValueState(`${rowIndex},${columnIndex}`)
        ).contents;
        row.push({
          cellValue: { ...cellValue, highlighted: false },
          evaluatedCellValue,
        });
      });
      data.push({ row });
    });
    return { data, info };
  });

  const saveSheet = async () => {
    try {
      const { data, info } = getSheet();
      await setDoc(doc(db, "sheets", slug), {
        data,
        info,
        slug,
        lastEdited: new Date().toString(),
      });
      setLoading(false);
      setColor("text-green-500");
      setMessage(`Sheet saved successfully as "${slug}"`);
    } catch (e) {
      setLoading(false);
      setColor("text-red-500");
      setMessage("There was an error saving the sheet. Try again.");
    }
  };

  const onClickOutsideModalHandler = (e) => {
    if (e.target.className === "modal modal-open") {
      setIsOpen(false);
      setColor("");
      setMessage("");
      setLoading(true);
    }
  };

  const onEscapeKeyPressHandler = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setColor("");
      setMessage("");
      setLoading(true);
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

  useEffect(() => {
    isOpen && saveSheet();
  }, [isOpen]);

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        {loading ? (
          <div className="flex-center">
            <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin mt-10"></div>
          </div>
        ) : (
          <p className={`${color} font-bold flex-center text-xl mt-10`}>
            {message}
          </p>
        )}
        <div className="modal-action">
          <button onClick={() => setIsOpen(false)} className="btn">
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveModal;
