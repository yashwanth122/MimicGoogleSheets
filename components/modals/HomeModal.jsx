import React, { useEffect } from "react";
import { useRouter } from "next/router";

function HomeModal({ isOpen, setIsOpen }) {
  const router = useRouter();

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
        <h1 className="text-xl font-bold">
          Are you sure you want to leave this page? All unsaved changes will be
          lost.
        </h1>
        <div className="modal-action">
          <button onClick={() => router.push("/")} className="btn btn-accent">
            Yes
          </button>
          <button onClick={() => setIsOpen(false)} className="btn">
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeModal;
