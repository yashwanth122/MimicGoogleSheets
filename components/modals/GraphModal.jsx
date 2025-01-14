import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getCellRange } from "utils/getCellRange";
import { useRecoilCallback } from "recoil";

function GraphModal({ isOpen, setIsOpen }) {
  const [xStart, setXStart] = useState("");
  const [xEnd, setXEnd] = useState("");
  const [yStart, setYStart] = useState("");
  const [yEnd, setYEnd] = useState("");
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        fill: false,
        backgroundColor: "black",
        borderColor: "gray",
      },
    ],
  });
  const [error, setError] = useState("");

  const createGraph = useRecoilCallback(({ snapshot }) => () => {
    try {
      setError("");
      const xValues = getCellRange(
        `${xStart}:${xEnd}`,
        snapshot.getLoadable
      ).values;
      const yValues = getCellRange(
        `${yStart}:${yEnd}`,
        snapshot.getLoadable
      ).values;
      if (xValues.length !== yValues.length) {
        throw new Error();
      }
      setData({
        labels: xValues.map((x) => x.toString()),
        datasets: [
          {
            data: yValues,
            fill: false,
            backgroundColor: "black",
            borderColor: "gray",
          },
        ],
      });
    } catch (error) {
      setError("Invalid Input. Try Again.");
    }
  });

  const onClickOutsideModalHandler = (e) => {
    if (e.target.className === "modal modal-open") {
      setIsOpen(false);
      setXStart("");
      setXEnd("");
      setYStart("");
      setYEnd("");
      setData({
        labels: [],
        datasets: [
          {
            data: [],
            fill: false,
            backgroundColor: "black",
            borderColor: "gray",
          },
        ],
      });
    }
  };

  const onEscapeKeyPressHandler = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setXStart("");
      setXEnd("");
      setYStart("");
      setYEnd("");
      setData({
        labels: [],
        datasets: [
          {
            data: [],
            fill: false,
            backgroundColor: "black",
            borderColor: "gray",
          },
        ],
      });
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
        <div className="flex-center flex-col gap-4">
          <div className="flex-center">
            <span className="flex-center flex-col">
              <input
                type="text"
                value={xStart}
                onChange={(e) => setXStart(e.target.value)}
                className="w-1/4 text-center rounded-md"
                name="xStart"
                id="xStart"
                placeholder="A1"
              />
              <label htmlFor="xStart" className="text-sm">
                x-axis starting cell
              </label>
            </span>
            <span className="font-bold text-xl">:</span>
            <span className="flex flex-col justify-end items-center text-left">
              <input
                type="text"
                value={xEnd}
                onChange={(e) => setXEnd(e.target.value)}
                className="w-1/4 text-center rounded-md"
                name="xEnd"
                id="xEnd"
                placeholder="A1"
              />
              <label htmlFor="xEnd" className="text-sm">
                x-axis ending cell
              </label>
            </span>
          </div>
          <div className="flex-center">
            <span className="flex-center flex-col">
              <input
                type="text"
                value={yStart}
                onChange={(e) => setYStart(e.target.value)}
                className="w-1/4 text-center rounded-md"
                name="yStart"
                id="yStart"
                placeholder="A1"
              />
              <label htmlFor="yStart" className="text-sm">
                y-axis starting cell
              </label>
            </span>
            <span className="font-bold text-xl">:</span>
            <span className="flex flex-col justify-end items-center text-left">
              <input
                type="text"
                value={yEnd}
                onChange={(e) => setYEnd(e.target.value)}
                className="w-1/4 text-center rounded-md"
                name="yEnd"
                id="yEnd"
                placeholder="A1"
              />
              <label htmlFor="yEnd" className="text-sm">
                y-axis ending cell
              </label>
            </span>
          </div>
          <button className="btn" onClick={() => createGraph()}>
            Create Graph
          </button>
        </div>
        <br />
        {error ? (
          <div className="flex-center text-lg font-bold mt-5 text-red-500">
            {error}
          </div>
        ) : (
          <Line
            data={data}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
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

export default GraphModal;
