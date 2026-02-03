"use client";

import React from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { useServerInsertedHTML } from "next/navigation";
import { ConfigProvider, theme as antdTheme } from "antd";
import colors from "./color";

const StyledComponentsRegistry = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const mode: string = "dark"; // AI dark mode
  const cache = React.useMemo(() => createCache(), []);
  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ));
  return (
    <StyleProvider cache={cache}>
      <ConfigProvider
        theme={{
          algorithm: antdTheme.darkAlgorithm,
          token: {
            // Primary Colors - AI Green
            colorPrimary: colors.primary.main,
            colorPrimaryHover: colors.primary.light,
            colorPrimaryActive: colors.primary.dark,
            colorPrimaryBg: colors.primary.main + "15",
            colorPrimaryBgHover: colors.primary.main + "25",
            colorPrimaryBorder: colors.primary.main,
            colorPrimaryBorderHover: colors.primary.light,
            borderRadius: 12,
            borderRadiusLG: 16,
            borderRadiusSM: 8,

            // Text Colors
            colorText: colors.text.primary,
            colorTextSecondary: colors.text.secondary,
            colorTextDisabled: colors.text.disabled,

            // Background Colors
            colorBgBase: colors.background.dark,
            colorBgContainer: colors.background.default,
            colorBgElevated: colors.neutral[700],
            colorBgLayout: colors.background.dark,

            // Border Colors
            colorBorder: colors.border.main,
            colorBorderSecondary: colors.border.light,
          },
          components: {
            Button: {
              fontSizeLG: 14,
              paddingBlockLG: 1,
              colorPrimaryBg: colors.primary.main,
              colorPrimaryBgHover: colors.primary.light,
              colorPrimaryBorder: colors.primary.main,
              colorPrimaryBorderHover: colors.primary.light,
              colorPrimaryHover: colors.primary.light,
              colorPrimaryActive: colors.primary.dark,
              colorPrimaryText: colors.primary.contrast,
              colorPrimaryTextHover: colors.primary.contrast,
              colorPrimaryTextActive: colors.primary.contrast,
              colorText: colors.text.primary,
              colorTextSecondary: colors.text.secondary,
              colorTextDisabled: colors.text.disabled,
              colorBgContainer: colors.neutral[700],
              colorBorder: colors.border.main,
              colorBgContainerDisabled: colors.neutral[800],
              colorBgTextHover: colors.action.hover,
              colorBgTextActive: colors.action.selected,
            },
            Input: {
              colorBgContainer: colors.neutral[700],
              colorBorder: colors.border.main,
              colorText: colors.text.primary,
              colorTextPlaceholder: colors.text.secondary,
              borderRadius: 12,
              paddingBlock: 12,
              paddingInline: 16,
              fontSize: 14,
              colorBgContainerDisabled: colors.neutral[800],
              colorTextDisabled: colors.text.disabled,
            },
            Menu: {
              itemSelectedBg: colors.primary.main + "20",
              itemHoverColor: colors.primary.light,
              itemColor: colors.text.primary,
              itemSelectedColor: colors.primary.main,
              fontSize: 14,
              iconSize: 16,
              colorIcon: colors.text.primary,
              colorIconHover: colors.primary.main,
              subMenuItemBg: colors.neutral[900],
              groupTitleColor: colors.text.secondary,
              activeBarBorderWidth: 0,
              activeBarHeight: 0,
              activeBarWidth: 0,
              itemBg: "transparent",
              darkItemBg: "transparent",
            },
            Modal: {
              contentBg: colors.neutral[800],
              headerBg: colors.neutral[800],
              titleColor: colors.text.primary,
            },
            Tooltip: {
              colorBgSpotlight: colors.neutral[700],
              colorTextLightSolid: colors.text.primary,
            },
            Dropdown: {
              colorBgElevated: colors.neutral[700],
              controlItemBgHover: colors.action.hover,
            },
            Select: {
              colorBgContainer: colors.neutral[700],
              colorBorder: colors.border.main,
              colorText: colors.text.primary,
              colorTextPlaceholder: colors.text.secondary,
              fontSize: 14,
              borderRadius: 12,
              colorBgContainerDisabled: colors.neutral[800],
              colorTextDisabled: colors.text.disabled,
              colorBgElevated: colors.neutral[700],
              optionSelectedBg: colors.primary.main + "30",
              optionActiveBg: colors.primary.main + "20",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
};

export default StyledComponentsRegistry;
