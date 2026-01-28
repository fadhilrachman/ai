"use client";

import {
  PiBroadcastFill,
  PiChartLineDuotone,
  PiGearSixDuotone,
  PiSquaresFourDuotone,
  PiVideoCameraFill,
} from "react-icons/pi";
import { Tooltip } from "antd";
import React from "react";
import { GiMachineGun } from "react-icons/gi";
import { BsTruckFront } from "react-icons/bs";
import { LiaTruckLoadingSolid } from "react-icons/lia";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { key: "/dashboard", icon: <PiSquaresFourDuotone />, label: "Dashboard" },
  { key: "/live", icon: <PiBroadcastFill />, label: "Live" },
  { key: "/machine", icon: <LiaTruckLoadingSolid />, label: "Machine" },
  // { key: "/analytics", icon: <PiChartLineDuotone />, label: "Analytics" },
  { key: "/settings", icon: <PiGearSixDuotone />, label: "Settings" },
];

const SidebarCustom = () => {
  const pathName = usePathname();
  const navigate = useRouter();
  return (
    <aside className="sticky top-0 hidden h-screen w-20 shrink-0 flex-col items-center justify-between border-r border-slate-200 bg-white/80 px-2 py-6 backdrop-blur lg:flex">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mainColor  shadow-md">
          <span className="text-xs font-semibold text-white">LOGO</span>
        </div>
        <div className="h-10 w-px bg-slate-200" />
        <nav className="flex flex-col items-center gap-3">
          {navItems.map((item, idx) => (
            <Tooltip key={item.key} title={item.label} placement="right">
              <button
                onClick={() => {
                  navigate.push(item.key);
                }}
                className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl text-xl transition hover:bg-indigo-50 hover:text-mainColor ${
                  pathName === item.key
                    ? "bg-mainColor text-white shadow-md shadow-indigo-100"
                    : "text-slate-500"
                }`}
                type="button"
                aria-label={item.label}
              >
                {item.icon}
              </button>
            </Tooltip>
          ))}
        </nav>
      </div>
      <div className="flex flex-col items-center gap-3 text-[10px] text-slate-400">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm">
          LP
        </div>
        {/* <span className="-rotate-90 tracking-wide text-[11px]">Live Ops</span> */}
      </div>
    </aside>
  );
};

export default SidebarCustom;
