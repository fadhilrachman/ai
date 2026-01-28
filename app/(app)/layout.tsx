import AppLayoutContainer from "@/components/layout/AppLayoutContainer";
import React from "react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return <AppLayoutContainer>{children}</AppLayoutContainer>;
};

export default AppLayout;
