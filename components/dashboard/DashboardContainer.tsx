"use client";

import React, { useMemo } from "react";
import { Card, Col, Row, Statistic, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DashboardOutlined,
  PlayCircleOutlined,
  WarningOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const { Title, Text } = Typography;

type MachineStatus = "RUNNING" | "IDLE" | "ERROR";

type MachineRow = {
  key: string;
  machineId: string;
  name: string;
  location: string;
  status: MachineStatus;
  totalStoneToday: number;
  lastActive: string;
};

const statusColor: Record<MachineStatus, string> = {
  RUNNING: "green",
  IDLE: "gold",
  ERROR: "red",
};

export default function DashboardContainer() {
  const machines: MachineRow[] = [
    {
      key: "1",
      machineId: "MC-001",
      name: "Ayakan Utama A",
      location: "Site A",
      status: "RUNNING",
      totalStoneToday: 420,
      lastActive: "2026-01-22 08:55",
    },
    {
      key: "2",
      machineId: "MC-002",
      name: "Ayakan Sekunder B",
      location: "Site B",
      status: "IDLE",
      totalStoneToday: 260,
      lastActive: "2026-01-22 07:40",
    },
    {
      key: "3",
      machineId: "MC-003",
      name: "Ayakan Cadangan",
      location: "Site A",
      status: "ERROR",
      totalStoneToday: 80,
      lastActive: "2026-01-21 23:10",
    },
    {
      key: "4",
      machineId: "MC-004",
      name: "Ayakan Utama C",
      location: "Site C",
      status: "RUNNING",
      totalStoneToday: 510,
      lastActive: "2026-01-22 09:05",
    },
  ];

  const kpi = useMemo(() => {
    const totalMachines = machines.length;
    const running = machines.filter((m) => m.status === "RUNNING").length;
    const idle = machines.filter((m) => m.status === "IDLE").length;
    const error = machines.filter((m) => m.status === "ERROR").length;
    const totalStoneToday = machines.reduce(
      (acc, m) => acc + m.totalStoneToday,
      0,
    );
    return { totalMachines, running, idle, error, totalStoneToday };
  }, [machines]);

  const kpiCards = useMemo(
    () => [
      {
        title: "Total Machines",
        value: kpi.totalMachines,
        icon: <DashboardOutlined />,
        gradient: "linear-gradient(135deg, #e6f4ff, #bae0ff)",
        iconColor: "#1677ff",
      },
      {
        title: "Running",
        value: kpi.running,
        icon: <PlayCircleOutlined />,
        gradient: "linear-gradient(135deg, #f6ffed, #d9f7be)",
        iconColor: "#52c41a",
      },
      {
        title: "Error",
        value: kpi.error,
        icon: <WarningOutlined />,
        gradient: "linear-gradient(135deg, #fff2f0, #ffccc7)",
        iconColor: "#ff4d4f",
      },
      {
        title: "Stone Today",
        value: kpi.totalStoneToday,
        icon: <DatabaseOutlined />,
        gradient: "linear-gradient(135deg, #fffbe6, #fff1b8)",
        iconColor: "#faad14",
      },
    ],
    [kpi],
  );

  const trendData = useMemo(
    () => [
      { time: "00:00", stones: 55 },
      { time: "02:00", stones: 70 },
      { time: "04:00", stones: 62 },
      { time: "06:00", stones: 88 },
      { time: "08:00", stones: 120 },
      { time: "10:00", stones: 140 },
      { time: "12:00", stones: 155 },
      { time: "14:00", stones: 170 },
      { time: "16:00", stones: 165 },
      { time: "18:00", stones: 180 },
      { time: "20:00", stones: 205 },
      { time: "22:00", stones: 190 },
    ],
    [],
  );

  const barData = useMemo(
    () =>
      machines.map((m) => ({
        machine: m.machineId,
        stones: m.totalStoneToday,
      })),
    [machines],
  );

  const pieData = useMemo(
    () => [
      { name: "RUNNING", value: kpi.running },
      { name: "IDLE", value: kpi.idle },
      { name: "ERROR", value: kpi.error },
    ],
    [kpi],
  );

  const pieColors = ["#52c41a", "#faad14", "#ff4d4f"];

  const columns: ColumnsType<MachineRow> = [
    { title: "Machine ID", dataIndex: "machineId", key: "machineId" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: MachineStatus) => <Tag color={statusColor[s]}>{s}</Tag>,
    },
    { title: "Location", dataIndex: "location", key: "location" },
    {
      title: "Stone Today",
      dataIndex: "totalStoneToday",
      key: "totalStoneToday",
      render: (v: number) => v.toLocaleString(),
    },
    { title: "Last Active", dataIndex: "lastActive", key: "lastActive" },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3} style={{ margin: 0 }}>
            Machine Monitoring Dashboard
          </Title>
          <Text type="secondary">Antd layout + Recharts (dummy)</Text>
        </Col>

        {/* KPI Cards */}
        {kpiCards.map((item) => (
          <Col xs={24} sm={12} lg={6} key={item.title}>
            <Card
              bordered={false}
              style={{
                background: item.gradient,
                borderRadius: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Statistic
                  title={item.title}
                  value={item.value}
                  valueStyle={{ color: "#000", fontWeight: 700 }}
                />
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    color: item.iconColor,
                    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                  }}
                >
                  {item.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}

        {/* Line */}
        <Col xs={24} lg={12}>
          <Card title="Stone Trend (2-hour)">
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="stones"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Pie */}
        <Col xs={24} lg={12}>
          <Card title="Status Distribution">
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {pieData.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={pieColors[idx % pieColors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Bar */}
        <Col xs={24} lg={12}>
          <Card title="Stone Today by Machine">
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="machine" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stones" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Table */}
        <Col xs={24} lg={12}>
          <Card title="Machines">
            <Table
              columns={columns}
              dataSource={machines}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
