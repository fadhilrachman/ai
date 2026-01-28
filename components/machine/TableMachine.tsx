"use client";

import { Table, Tag, Button, Space, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DATA_MACHINE } from "@/data-dummy.json";
import Title from "../shared/Title";
import { BiPlus } from "react-icons/bi";
import InputSearch from "../shared/InputSearch";

export type MachineStatus = "RUNNING" | "IDLE" | "ERROR";

export interface MachineData {
  key: string;
  machineId: string;
  name: string;
  status: MachineStatus;
  location: string;
  totalStone: number;
  lastActive: string;
}

export const machineData: MachineData[] = DATA_MACHINE as MachineData[];

const statusColorMap: Record<MachineStatus, string> = {
  RUNNING: "green",
  IDLE: "gold",
  ERROR: "red",
};

export const machineColumns: ColumnsType<MachineData> = [
  {
    title: "Machine ID",
    dataIndex: "machineId",
    key: "machineId",
  },
  {
    title: "Machine Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: MachineStatus) => (
      <Tag color={statusColorMap[status]}>{status}</Tag>
    ),
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Total Stone",
    dataIndex: "totalStone",
    key: "totalStone",
    render: (value: number) => value.toLocaleString(),
  },
  {
    title: "Last Active",
    dataIndex: "lastActive",
    key: "lastActive",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space>
        <Button size="small">Detail</Button>
        <Button size="small" danger>
          Stop
        </Button>
      </Space>
    ),
  },
];

type TableMachineProps = {
  hideTitle?: boolean;
  pageSize?: number;
};

const TableMachine = ({
  hideTitle = false,
  pageSize = 5,
}: TableMachineProps) => {
  return (
    <div className="!space-y-6">
      <Card>
        <div className="flex  justify-between items-end">
          <Title title="Machine" subtitle="Manage Your Machine" />
          <Button type="primary" icon={<BiPlus />}>
            Add
          </Button>
        </div>
      </Card>
      <InputSearch
        onChange={() => {}}
        placeholder="Search Machine..."
        className="max-w-[240px]"
      />
      <Table
        columns={machineColumns}
        dataSource={machineData}
        pagination={{ pageSize }}
      />
    </div>
  );
};

export default TableMachine;
