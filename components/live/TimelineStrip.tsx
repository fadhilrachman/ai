"use client";

import { Badge } from "antd";
import React from "react";

export type TimelineClip = {
  id: string;
  label: string;
  time: string;
  duration: string;
  camera: string;
  type: "stone" | "status" | "alert" | "maintenance";
  thumbnail?: string;
};

type TimelineStripProps = {
  clips: TimelineClip[];
};

const typeStyles: Record<
  TimelineClip["type"],
  { bg: string; text: string; dot: string; color: string }
> = {
  stone: {
    bg: "bg-rose-50 border-rose-100",
    text: "text-rose-600",
    dot: "bg-rose-500",
    color: "#f43f5e",
  },
  status: {
    bg: "bg-sky-50 border-sky-100",
    text: "text-sky-600",
    dot: "bg-sky-500",
    color: "#0ea5e9",
  },
  alert: {
    bg: "bg-amber-50 border-amber-100",
    text: "text-amber-600",
    dot: "bg-amber-500",
    color: "#f59e0b",
  },
  maintenance: {
    bg: "bg-emerald-50 border-emerald-100",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
    color: "#10b981",
  },
};

const TimelineStrip: React.FC<TimelineStripProps> = ({ clips }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-start">
        <div>
          <p className="text-sm font-semibold text-slate-600">Other Machine</p>
          {/* <p className="text-xs text-slate-500">Mesin Pengayakan • Ayakan #1</p> */}
        </div>
        {/* <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          Stone Detection
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Machine Normal
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Alerts
        </div> */}
      </div>

      {/* <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-slate-200 px-3 py-2 text-xs text-slate-500">
        {hourMarks.map((mark) => (
          <div key={mark} className="flex flex-1 items-center">
            <span className="pr-2 font-medium text-slate-600">{mark}</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
        ))}
      </div> */}

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {clips.map((clip) => {
          const styles = typeStyles[clip.type];
          return (
            <div
              key={clip.id}
              className={`group flex gap-3 cursor-pointer rounded-xl border ${styles.bg} p-3 shadow-sm transition hover:shadow-md`}
            >
              <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-slate-200">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 opacity-70" />
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <span className="text-[11px] font-semibold">
                    {clip.duration}
                  </span>
                </div>
                <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">
                  {clip.camera}
                </div>
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Badge color={styles.color} />
                    <span>{clip.time}</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] ${styles.text} bg-white/70`}
                  >
                    {clip.label}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {clip.type === "stone"
                    ? "Stone Detected"
                    : clip.type === "status"
                      ? "Normal Process"
                      : clip.type === "maintenance"
                        ? "Maintenance"
                        : "Alert"}
                </p>
                <p className="text-xs text-slate-500">
                  Duration {clip.duration}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineStrip;
