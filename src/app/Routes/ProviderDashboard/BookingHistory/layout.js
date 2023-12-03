"use client";
import React from "react";
import Sidebar from "../sidebar/page";
import { useDataContext } from "@/Contextapi";

export default function layout({ children }) {
  const { open } = useDataContext();

  return (
    <div className="grid grid-cols-5 gap-10 max-sm:grid-cols-1">
      <div
        className={`col-span-1 ${
          open
            ? "translate-x-[15rem] duration-500"
            : "translate-x-0 duration-500"
        }  `}
      >
        <Sidebar />
      </div>
      <div className="col-span-4 max-sm:col-span-1">
        <div>{children}</div>
      </div>
    </div>
  );
}
