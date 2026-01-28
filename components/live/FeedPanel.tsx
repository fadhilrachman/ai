"use client";

import { Avatar, Badge, DatePicker, List, Tag } from "antd";
import React from "react";

export type FeedItem = {
  id: string;
  title: string;
  camera: string;
  time: string;
  type: "stone" | "status" | "alert";
  thumbnail?: string;
};

type FeedPanelProps = {
  items: FeedItem[];
};

const typeMap: Record<
  FeedItem["type"],
  { color: string; label: string; bg: string }
> = {
  stone: { color: "#ef4444", label: "Stone", bg: "bg-rose-50" },
  status: { color: "#2563eb", label: "Status", bg: "bg-sky-50" },
  alert: { color: "#f59e0b", label: "Alert", bg: "bg-amber-50" },
};

const FeedPanel: React.FC<FeedPanelProps> = ({ items }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Feed</h3>
          <p className="text-xs text-slate-500">Latest clips & events</p>
        </div>
        <DatePicker.RangePicker size="small" className="hidden sm:flex" />
      </div>
      <List
        itemLayout="horizontal"
        dataSource={items}
        split={false}
        renderItem={(item) => {
          const meta = typeMap[item.type];
          return (
            <List.Item className="mb-3 rounded-xl border border-slate-100 px-3 py-2 transition hover:border-indigo-100 hover:shadow-sm">
              <List.Item.Meta
                avatar={
                  <div
                    className={`flex h-14 w-20 items-center justify-center overflow-hidden rounded-lg ${meta.bg}`}
                  >
                    <Avatar shape="square" size={56}>
                      {item.camera[0]}
                    </Avatar>
                  </div>
                }
                title={
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Tag color={meta.color}>{meta.label}</Tag>
                      <span className="text-sm font-semibold text-slate-800">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                }
                description={
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{item.camera}</span>
                    <div className="flex items-center gap-1">
                      <Badge color={meta.color} />
                      <span className="text-[11px] text-slate-500">Recorded</span>
                    </div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default FeedPanel;
