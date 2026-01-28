"use client";

import React, { useMemo, useState } from "react";
import { Card, Segmented, Tag } from "antd";
import DeviceSelector from "../DeviceSelector";
import FeedPanel, { FeedItem } from "../FeedPanel";
import LiveStreamPanel from "../LiveStreamPanel";
import TimelineStrip, { TimelineClip } from "../TimelineStrip";
import LoggingPanel from "../LoggingPanel";
import Title from "@/components/shared/Title";

const devices = [
  { id: "ayakan-1", name: "Ayakan #1", status: "Live" },
  { id: "ayakan-2", name: "Ayakan #2", status: "Idle" },
  { id: "ayakan-3", name: "Ayakan #3", status: "Maintenance" },
];

const timelineClips: TimelineClip[] = [
  {
    id: "c1",
    label: "Segment 09:45",
    time: "09:45",
    duration: "01:30",
    camera: "Machine A",
    type: "stone",
  },
  {
    id: "c2",
    label: "Segment 10:00",
    time: "10:00",
    duration: "05:00",
    camera: "Machine B",
    type: "status",
  },
  {
    id: "c3",
    label: "Segment 10:08",
    time: "10:08",
    duration: "02:10",
    camera: "Machine C",
    type: "stone",
  },
  {
    id: "c4",
    label: "Segment 10:12",
    time: "10:12",
    duration: "00:45",
    camera: "Thermal",
    type: "alert",
  },
  {
    id: "c5",
    label: "Segment 10:18",
    time: "10:18",
    duration: "03:30",
    camera: "Machine A",
    type: "status",
  },
  {
    id: "c6",
    label: "Segment 10:24",
    time: "10:24",
    duration: "02:40",
    camera: "Machine B",
    type: "stone",
  },
];

const baseLogs: any[] = [
  { id: "l1", time: "09:58:10", message: "Machine Started", type: "start" },
  { id: "l2", time: "10:05:04", message: "Process Normal", type: "normal" },
  {
    id: "l3",
    time: "10:08:21",
    message: "Stone Detected at feeder",
    type: "stone",
    count: 1,
  },
  {
    id: "l4",
    time: "10:12:10",
    message: "Stone Detected at output",
    type: "stone",
    count: 2,
  },
  { id: "l5", time: "10:18:55", message: "Machine Stopped", type: "stop" },
];

const filterMap: Record<string, FeedItem["type"][]> = {
  "All Events": ["stone", "status", "alert"],
  "Stone Detection": ["stone"],
  "Machine Status": ["status", "alert"],
};

const DashboardContainer = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All Events");
  const [device, setDevice] = useState(devices[0].id);
  const [logs, setLogs] = useState<any[]>(baseLogs);

  return (
    <div className="!space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Title title="Live" subtitle="Live bla bla bla" />
        </div>
        {/* <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Tag color="green" className="rounded-full">
            Live
          </Tag>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600">
            Active Camera:{" "}
            <span className="font-semibold text-slate-800">
              {devices.find((d) => d.id === device)?.name}
            </span>
          </span>
        </div> */}
      </Card>

      <div className="flex w-full  space-x-4">
        <LiveStreamPanel
          cameraName="Ayakan #1 - Primary Feed"
          deviceId={device.toUpperCase()}
          timestamp="10:24:16"
        />
        <LoggingPanel />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TimelineStrip clips={timelineClips} />
        </div>
        <div className="xl:col-span-1"></div>
      </div>
    </div>
  );
};

export default DashboardContainer;
