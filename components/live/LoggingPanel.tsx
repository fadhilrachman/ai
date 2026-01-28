"use client";

import { CalendarOutlined, FilterOutlined } from "@ant-design/icons";
import { Button } from "antd";

type LogType = "START" | "PROCESS" | "STONE" | "STOP";

type LogItem = {
  type: LogType;
  title: string;
  time: string;
  desc: string;
  count?: number;
};

const colorMap: Record<LogType, string> = {
  START: "text-emerald-600",
  PROCESS: "text-blue-600",
  STONE: "text-rose-600",
  STOP: "text-gray-500",
};

const bgMap: Record<LogType, string> = {
  START: "hover:bg-emerald-50",
  PROCESS: "hover:bg-blue-50",
  STONE: "hover:bg-rose-50",
  STOP: "hover:bg-gray-50",
};

const LoggingPanel = () => {
  const logs: LogItem[] = [
    {
      type: "START",
      title: "Machine Started",
      time: "09:10:01",
      desc: "System initialized",
    },
    {
      type: "PROCESS",
      title: "Processing Material",
      time: "09:10:12",
      desc: "Conveyor running normally",
    },
    {
      type: "STONE",
      title: "Stone Detected",
      time: "09:10:18",
      desc: "Foreign object on belt",
      count: 1,
    },
    {
      type: "PROCESS",
      title: "Processing Resumed",
      time: "09:10:22",
      desc: "Material flow stable",
    },
    {
      type: "STONE",
      title: "Stone Detected",
      time: "09:10:41",
      desc: "Foreign object on belt",
      count: 2,
    },
    {
      type: "STONE",
      title: "Stone Detected",
      time: "09:10:41",
      desc: "Foreign object on belt",
      count: 2,
    },
    {
      type: "STONE",
      title: "Stone Detected",
      time: "09:10:41",
      desc: "Foreign object on belt",
      count: 2,
    },
    {
      type: "STONE",
      title: "Stone Detected",
      time: "09:10:41",
      desc: "Foreign object on belt",
      count: 2,
    },
    {
      type: "STONE",
      title: "Stone Detected",
      time: "09:10:41",
      desc: "Foreign object on belt",
      count: 2,
    },
    {
      type: "STONE",
      title: "Stone Detected",
      time: "09:10:41",
      desc: "Foreign object on belt",
      count: 2,
    },
    {
      type: "STONE",
      title: "Stone Detected",
      time: "09:10:41",
      desc: "Foreign object on belt",
      count: 2,
    },
    {
      type: "STONE",
      title: "Stone Detected",
      time: "09:10:41",
      desc: "Foreign object on belt",
      count: 2,
    },
    {
      type: "STONE",
      title: "Stone Detected",
      time: "09:10:41",
      desc: "Foreign object on belt",
      count: 2,
    },
    {
      type: "STONE",
      title: "Stone Detected",
      time: "09:10:41",
      desc: "Foreign object on belt",
      count: 2,
    },
    {
      type: "STONE",
      title: "Stone Detected",
      time: "09:10:41",
      desc: "Foreign object on belt",
      count: 2,
    },
    {
      type: "STOP",
      title: "Machine Stopped",
      time: "09:10:55",
      desc: "Manual stop",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold  relative leading-tight flex items-center gap-2">
            <div className="  ">
              <span className="relative   flex ">
                <span className="animate-ping absolute  inline-flex h-2.5 w-2.5 rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
            </div>
            <span>Logging</span>
          </div>
          <div className="text-xs text-gray-500">Events & detections</div>
        </div>
        <div className="flex items-center gap-2">
          <Button icon={<FilterOutlined />} className="!rounded-xl" />
          <Button icon={<CalendarOutlined />} className="!rounded-xl" />
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Log list */}
      <div className="flex-1 overflow-y-auto max-h-[400px] font-mono text-[13px]">
        {logs.map((log, i) => (
          <div
            key={i}
            className={`px-4 py-2 flex gap-4 items-start border-b border-gray-50 ${bgMap[log.type]}`}
          >
            {/* Time */}
            <span className="w-[80px] text-gray-400 tabular-nums">
              {log.time}
            </span>

            {/* Type */}
            <span className={`w-[90px] font-semibold ${colorMap[log.type]}`}>
              {log.type === "STONE" ? `STONE #${log.count}` : log.type}
            </span>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <div className="text-gray-800 truncate">{log.title}</div>
              <div className="text-gray-500 text-xs truncate">{log.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoggingPanel;
