import Sheet from "components/Sheet";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { db } from "firebaseConfig";
import { getDoc, doc } from "firebase/firestore/lite";
import { SheetSizeState } from "store/SheetSizeState";
import { CellValueState } from "store/CellValueState";
import { useRouter } from "next/router";
import { useRecoilCallback, useSetRecoilState } from "recoil";
import { AiFillHome } from "react-icons/ai";
import { VscGraphLine } from "react-icons/vsc";
import { FaInfoCircle } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import HomeModal from "components/modals/HomeModal";
import GraphModal from "components/modals/GraphModal";
import InstructionsModal from "components/modals/InstructionsModal";
import SaveModal from "components/modals/SaveModal";

export default function SheetPage({ sheet, slug }) {
  const [isHomeModalOpen, setIsHomeModalOpen] = useState(false);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const router = useRouter();
  const setSheetSize = useSetRecoilState(SheetSizeState);
  const unSlugify = (msg) => {
    return msg?.split("-").reduce((prev, curr) => {
      return `${prev} ${curr.slice(0, 1).toUpperCase()}${curr.slice(1)}`;
    }, "");
  };
  const loadSheet = useRecoilCallback(({ set }) => () => {
    if (sheet) {
      const { data, info } = sheet;
      const { rows, columns } = info;
      setSheetSize(info);
      [...Array(rows)].forEach((_, rowIndex) => {
        [...Array(columns)].forEach((_, columnIndex) => {
          const { cellValue } = data[rowIndex].row[columnIndex];
          set(CellValueState(`${rowIndex},${columnIndex}`), {
            ...cellValue,
            highlighted: false,
          });
        });
      });
    } else {
      setSheetSize({
        width: 600,
        height: 600,
        rows: 24,
        columns: 6,
      });
      [...Array(24)].forEach((_, rowIndex) => {
        [...Array(6)].forEach((_, columnIndex) => {
          set(CellValueState(`${rowIndex},${columnIndex}`), {
            value: "",
            error: false,
            highlighted: false,
          });
        });
      });
    }
  });

  useEffect(() => {
    if (localStorage.getItem("slug") === slug) {
      loadSheet();
    } else {
      localStorage.removeItem("slug");
      setTimeout(() => {
        router.push("/");
      }, 100);
    }
  }, []);

  return (
    <>
      <Head>
        <title>
          {unSlugify(slug) ? `Sheets | ${unSlugify(slug)}` : "Loading Sheet..."}
        </title>
        <link
          rel="icon"
          href="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x16.png"
        />
      </Head>
      <div
        className={
          "w-auto flex flex-col lg:flex-row justify-around items-center bg-[rgba(255,255,255,0.1)]"
        }
      >
        <Sheet />
        <div
          className={
            "flex flex-col justify-center items-end gap-10 text-xl text-[#F5F5F5] h-screen lg:ml-[50vw]"
          }
        >
          <button
            className={
              "flex justify-evenly items-center bg-gray-900 rounded-lg flex-center py-3 px-10 hover:bg-gray-800 transition-all ease-in-out"
            }
            onClick={() => setIsInstructionsModalOpen(true)}
          >
            <FaInfoCircle />
            &nbsp; Details
          </button>
          <button
            className={
              "flex justify-evenly items-center bg-gray-900 rounded-lg flex-center py-3 px-10 hover:bg-gray-800 transition-all ease-in-out"
            }
            onClick={() => setIsHomeModalOpen(true)}
          >
            <AiFillHome />
            &nbsp; Go Home
          </button>
          <button
            className={
              "flex justify-evenly items-center bg-gray-900 rounded-lg flex-center py-3 px-10 hover:bg-gray-800 transition-all ease-in-out"
            }
            onClick={() => setIsGraphModalOpen(true)}
          >
            <VscGraphLine className="stroke-1" />
            &nbsp; Line Graph
          </button>
          <button
            className={
              "flex justify-evenly items-center bg-gray-900 rounded-lg flex-center py-3 px-10 hover:bg-gray-800 transition-all ease-in-out"
            }
            onClick={() => setIsSavedModalOpen(true)}
          >
            <FaSave />
            &nbsp; Save Sheet
          </button>
        </div>
      </div>
      <HomeModal isOpen={isHomeModalOpen} setIsOpen={setIsHomeModalOpen} />
      <GraphModal isOpen={isGraphModalOpen} setIsOpen={setIsGraphModalOpen} />
      <InstructionsModal
        isOpen={isInstructionsModalOpen}
        setIsOpen={setIsInstructionsModalOpen}
      />
      <SaveModal
        isOpen={isSavedModalOpen}
        setIsOpen={setIsSavedModalOpen}
        slug={slug}
      />
    </>
  );
}

export async function getServerSideProps({ params: { slug } }) {
  const sheetsRef = doc(db, "sheets", slug);
  const sheetSnap = await getDoc(sheetsRef);
  return {
    props: { sheet: sheetSnap.exists() ? sheetSnap.data() : null, slug },
  };
}
