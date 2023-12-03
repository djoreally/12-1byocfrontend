import React from "react";
import Sidebar from "../sidebar/page";
export default function layout({ children }) {
  return (
    <div className="grid grid-cols-5 gap-10 max-sm:grid-cols-1">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="col-span-4 max-sm:col-span-1">
      
        <div>{children}</div>
      </div>
    </div>
  );
}
