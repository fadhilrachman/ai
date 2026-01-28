"use client";
import dynamic from "next/dynamic";

const DashboardContainer = dynamic(
  () => import("@/components/dashboard/DashboardContainer"),
  {
    ssr: false,
  },
);
const DashboardPage = () => {
  return <DashboardContainer />;
};

export default DashboardPage;
