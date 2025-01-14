import Head from "next/head";
import React, { useState, useEffect } from "react";
import { db } from "firebaseConfig";
import { collection, getDocs } from "firebase/firestore/lite";
import { generateSlug } from "random-word-slugs";
import { useRouter } from "next/router";
import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";
import { BiSpreadsheet } from "react-icons/bi";

export default function Index() {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const unSlugify = (msg) => {
    return msg.split("-").reduce((prev, curr) => {
      return `${prev} ${curr.slice(0, 1).toUpperCase()}${curr.slice(1)}`;
    }, "");
  };

  useEffect(() => {
    localStorage.removeItem("slug");
    const getSheetData = async () => {
      const sheetsRef = await getDocs(collection(db, "sheets"));
      const sheets = sheetsRef.docs.map((doc) => doc.data());
      setSheets(sheets);
    };
    getSheetData();
  }, []);

  return (
    <>
      <Head>
        <title>Sheets</title>
        <link
          rel="icon"
          href="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x16.png"
        />
      </Head>
      {loading ? (
        <div className="flex-col min-h-screen gap-4 flex-center bg-[rgba(255,255,255,0.1)]">
          <h1 className="text-xl font-bold">Loading Sheet</h1>
          <div className="flex items-center justify-center " />
          <div className="w-32 h-32 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader"></div>
        </div>
      ) : (
        <div className="flex-center flex-col min-h-screen bg-[#F5F5F5]">
          <div className="flex-center flex-col gap-4 absolute top-[10%]">
            <h1 className="mb-6 text-4xl font-bold">Sheets</h1>
            <button
              onClick={() => {
                const slug = generateSlug();
                localStorage.setItem("slug", slug);
                router.push(`/${slug}`);
                setLoading(true);
              }}
              className="gap-2 p-3 text-xl transition-all ease-in-out bg-green-400 rounded-lg flex-center hover:bg-green-500"
            >
              <AiOutlinePlus />
              New Sheet
            </button>
            <br />
            <h2 className="mb-1 text-xl">Saved Sheets:</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-8">
              {sheets
                .sort((a, b) => new Date(b.lastEdited) - new Date(a.lastEdited))
                .map(({ slug, lastEdited }) => (
                  <Link href={`/${slug}`} key={slug}>
                    <a
                      onClick={() => {
                        localStorage.setItem("slug", slug);
                        setLoading(true);
                      }}
                    >
                      <div className="shadow-xl border border-gray-200 p-5 rounded-lg hover:scale-[1.15] transition-all ease-in-out duration-100 text-center sm:text-left relative">
                        <h2>Sheet Name: {unSlugify(slug)}</h2>
                        <p>
                          Last Edited:{" "}
                          {new Date(lastEdited).toLocaleDateString("en-US")}
                        </p>
                        <BiSpreadsheet className="absolute text-xl right-3 bottom-3" />
                      </div>
                    </a>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
