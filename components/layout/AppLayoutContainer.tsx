"use client";

import React from "react";
import SideRail from "../shared/SidebarCustom";
import Navbar from "../shared/Navbar";

const AppLayoutContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen bg-slate-100 text-slate-900">
      <SideRail />
      {/* <div className="flex w-full flex-1 flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8"> */}
      <div className=" w-full ">
        <Navbar />
        <div className="p-6 ">{children}</div>
      </div>
      {/* </div> */}
    </main>
  );
};

export default AppLayoutContainer;
