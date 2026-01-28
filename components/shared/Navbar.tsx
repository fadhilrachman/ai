"use client";
import { Avatar, Badge } from "antd";
import React from "react";
import {
  ArrowRightOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FaBell } from "react-icons/fa";

const Navbar = () => {
  const notification = 100;
  return (
    <div className="bg-white/80 top-0 backdrb w-full shrink-0 sticky z-30 min-h-[72px] border-b justify-end border-slate-200 flex items-center  px-6">
      <div className="flex items-center !space-x-6">
        <Badge
          count={
            <p className="text-white text-[10px] bg-red-500 p-[3px] min-w-[16px] text-center rounded-full">
              {notification >= 100 ? "99+" : notification}
            </p>
          }
          className="cursor-pointer"
        >
          <FaBell size={20} />
        </Badge>
        <div className="flex items-center cursor-pointer !space-x-2">
          <Avatar
            size={"default"}
            className="!bg-mainColor h-8 w-8 md:h-11 md:w-11"
            icon={<UserOutlined />}
          />
          <div>
            <small className="text-neutral-400">Joh Doe</small>
            <p className="text-sm">johndoe@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
