"use client";

import { Select } from "antd";
import React from "react";

type DeviceSelectorProps = {
  devices: { id: string; name: string; status: string }[];
  value: string;
  onChange: (value: string) => void;
};

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  devices,
  value,
  onChange,
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      size="middle"
      options={devices.map((device) => ({
        value: device.id,
        label: (
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-slate-800">
              {device.name}
            </span>
            <span className="text-[11px] text-emerald-600">{device.status}</span>
          </div>
        ),
      }))}
      className="min-w-[160px]"
      dropdownMatchSelectWidth={220}
    />
  );
};

export default DeviceSelector;
