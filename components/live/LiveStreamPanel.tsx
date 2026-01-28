"use client";

import React from "react";

type LiveStreamPanelProps = {
  cameraName: string;
  deviceId: string;
  streamUrl?: string;
  status?: string;
  timestamp?: string;
  mute?: boolean;
};

const LiveStreamPanel: React.FC<LiveStreamPanelProps> = ({
  cameraName,
  deviceId,
  streamUrl = "/vid/collector-belt-stacker.mp4",
  status = "LIVE",
  timestamp = "10:24:16",
  mute = true,
}) => {
  const sources = [
    streamUrl,
    "/vid/collector-belt-stacker.mp4",
    "/vid/sample.mp4",
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex-1">
      <div className="relative aspect-video w-full overflow-hidden rounded-[15px] bg-slate-900">
        <video
          className="h-full w-full object-cover opacity-90"
          controls
          muted={mute}
          loop
          playsInline
          preload="auto"
        >
          {sources.map((src, idx) => (
            <source key={idx} src={src} type="video/mp4" />
          ))}
          Your browser does not support MP4 playback.
        </video>

        {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/10 to-transparent" /> */}

        <div className="absolute left-2 top-4 flex items-center gap-2 rounded-full  px-3 py-2 ">
          {/* <span className="text-sm font-semibold">{cameraName}</span> */}
          <span className="flex text-white items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide shadow-sm">
            <span className="h-2 w-2 animate-ping rounded-full bg-white/80" />
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamPanel;
