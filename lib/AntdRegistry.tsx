"use client";

import React from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
// import type Entity from '@ant-design/cssinjs/es/Cache';
import { useServerInsertedHTML } from "next/navigation";
import { ConfigProvider, theme as antdTheme } from "antd";
import colors from "./color";

const StyledComponentsRegistry = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const mode: string = "light";
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
          algorithm:
            mode === "dark"
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
          token: {
            // Primary Colors
            colorPrimary: colors.primary.main,
            colorPrimaryHover: colors.primary.light,
            colorPrimaryActive: colors.primary.dark,
            colorPrimaryBg: colors.primary.main + "10",
            colorPrimaryBgHover: colors.primary.main + "20",
            colorPrimaryBorder: colors.primary.main,
            colorPrimaryBorderHover: colors.primary.light,
            borderRadius: 12,
            borderRadiusLG: 16,
            borderRadiusSM: 10,

            // Text Colors
            colorText:
              mode === "dark" ? colors.text.dark.primary : colors.text.primary,
            colorTextSecondary:
              mode === "dark"
                ? colors.text.dark.secondary
                : colors.text.secondary,
            colorTextDisabled:
              mode === "dark"
                ? colors.text.dark.disabled
                : colors.text.disabled,

            // Background Colors
            colorBgBase:
              mode === "dark"
                ? colors.background.dark
                : colors.background.default,
            colorBgContainer:
              mode === "dark"
                ? colors.background.paper
                : colors.background.paper,
            colorBgElevated:
              mode === "dark" ? colors.neutral[800] : colors.neutral[50],
            colorBgLayout:
              mode === "dark"
                ? colors.background.dark
                : colors.background.default,

            // Border Colors
            colorBorder:
              mode === "dark" ? colors.border.dark : colors.border.main,
            colorBorderSecondary:
              mode === "dark" ? colors.border.dark : colors.border.light,

            // Action Colors
            //   colorAction: colors.action.hover,
            //   colorActionHover: colors.action.selected,
            //   colorActionActive: colors.action.focus,
            //   colorActionDisabled: colors.action.disabled,
            //   colorActionDisabledBg: colors.action.disabledBackground,
          },
          components: {
            Button: {
              fontSizeLG: 14,
              paddingBlockLG: 1,

              // Primary Button Colors - Make sure text is always white/contrast
              colorPrimaryBg: colors.primary.main,
              colorPrimaryBgHover: colors.primary.light,
              colorPrimaryBorder: colors.primary.main,
              colorPrimaryBorderHover: colors.primary.light,
              colorPrimaryHover: colors.primary.light,
              colorPrimaryActive: colors.primary.dark,
              colorPrimaryText: colors.primary.contrast, // White text on primary
              colorPrimaryTextHover: colors.primary.contrast, // Keep white on hover
              colorPrimaryTextActive: colors.primary.contrast, // Keep white on active

              // Default Button Colors (for non-primary buttons)
              colorText:
                mode === "dark"
                  ? colors.text.dark.primary
                  : colors.text.primary,
              colorTextSecondary:
                mode === "dark"
                  ? colors.text.dark.secondary
                  : colors.text.secondary,
              colorTextDisabled:
                mode === "dark"
                  ? colors.text.dark.disabled
                  : colors.text.disabled,

              // Default Button Background
              colorBgContainer:
                mode === "dark" ? colors.neutral[800] : colors.background.paper,
              colorBorder:
                mode === "dark" ? colors.border.dark : colors.border.main,
              colorBgContainerDisabled:
                mode === "dark" ? colors.neutral[900] : colors.neutral[100],

              // Ghost Button Colors
              colorBgTextHover:
                mode === "dark"
                  ? colors.action.dark.hover
                  : colors.action.hover,
              colorBgTextActive:
                mode === "dark"
                  ? colors.action.dark.selected
                  : colors.action.selected,
            },
            DatePicker: {
              // inputFontSize: 12,
              // colorBgContainer:
              //   mode === "dark" ? colors.neutral[800] : colors.background.paper,
              // colorText:
              //   mode === "dark" ? colors.text.dark.primary : colors.text.primary,
              // colorTextPlaceholder:
              //   mode === "dark"
              //     ? colors.text.dark.secondary
              //     : colors.text.secondary,
              // colorBorder:
              //   mode === "dark" ? colors.border.dark : colors.border.main,
              // colorBgElevated:
              //   mode === "dark" ? colors.neutral[900] : colors.background.paper,
              // colorIcon:
              //   mode === "dark" ? colors.text.dark.primary : colors.text.primary,
              // colorIconHover:
              //   mode === "dark" ? colors.primary.light : colors.primary.main,
              // colorPrimary: colors.primary.main,
              // colorPrimaryHover: colors.primary.light,
              // colorPrimaryActive: colors.primary.dark,
              // colorTextDisabled:
              //   mode === "dark"
              //     ? colors.text.dark.disabled
              //     : colors.text.disabled,
              // colorBgContainerDisabled:
              //   mode === "dark" ? colors.neutral[900] : colors.neutral[100],
            },
            Form: {
              verticalLabelPadding: "0 0 2px",
            },
            Tabs: {
              titleFontSize: 16,
              itemSelectedColor: colors.primary.main,
              itemHoverColor: colors.primary.light,
              itemActiveColor: colors.primary.dark,
            },
            Menu: {
              itemSelectedBg:
                mode === "dark"
                  ? colors.primary.main + "80"
                  : colors.primary.main + "20",
              itemHoverColor:
                mode === "dark" ? colors.primary.light : colors.primary.main,
              itemColor:
                mode === "dark"
                  ? colors.text.dark.primary
                  : colors.text.primary,
              itemSelectedColor:
                mode === "dark" ? colors.primary.light : colors.primary.main,
              fontSize: 13,
              iconSize: 14,
              colorIcon:
                mode === "dark"
                  ? colors.text.dark.primary
                  : colors.text.primary,
              colorIconHover:
                mode === "dark" ? colors.primary.light : colors.primary.main,
              subMenuItemBg:
                mode === "dark" ? colors.neutral[800] : colors.background.paper,
              groupTitleColor:
                mode === "dark"
                  ? colors.text.dark.secondary
                  : colors.text.secondary,
              activeBarBorderWidth: 0,
              activeBarHeight: 0,
              activeBarWidth: 0,
            },
            Pagination: {
              itemActiveBg: colors.primary.main + "10",
              itemSize: 40,
              itemActiveColorDisabled: colors.text.disabled,
            },
            Input: {
              colorBgContainer:
                mode === "dark" ? colors.neutral[800] : colors.background.paper,
              colorBorder:
                mode === "dark" ? colors.border.dark : colors.border.main,
              colorText:
                mode === "dark"
                  ? colors.text.dark.primary
                  : colors.text.primary,
              colorTextPlaceholder:
                mode === "dark"
                  ? colors.text.dark.secondary
                  : colors.text.secondary,
              borderRadius: 8,
              paddingBlock: 8,
              paddingInline: 12,
              fontSize: 14,
              colorBgContainerDisabled:
                mode === "dark" ? colors.neutral[900] : colors.neutral[100],
              colorTextDisabled:
                mode === "dark"
                  ? colors.text.dark.disabled
                  : colors.text.disabled,
            },
            InputNumber: {
              colorBgContainer:
                mode === "dark" ? colors.neutral[800] : colors.background.paper,
              colorBorder:
                mode === "dark" ? colors.border.dark : colors.border.main,
              colorText:
                mode === "dark"
                  ? colors.text.dark.primary
                  : colors.text.primary,
              colorTextPlaceholder:
                mode === "dark"
                  ? colors.text.dark.secondary
                  : colors.text.secondary,
              borderRadius: 8,
              paddingBlock: 8,
              paddingInline: 12,
              fontSize: 14,
              colorBgContainerDisabled:
                mode === "dark" ? colors.neutral[900] : colors.neutral[100],
              colorTextDisabled:
                mode === "dark"
                  ? colors.text.dark.disabled
                  : colors.text.disabled,
            },
            Select: {
              colorBgContainer:
                mode === "dark" ? colors.neutral[800] : colors.background.paper,
              colorBorder:
                mode === "dark" ? colors.border.dark : colors.border.main,
              colorText:
                mode === "dark"
                  ? colors.text.dark.primary
                  : colors.text.primary,
              colorTextPlaceholder:
                mode === "dark"
                  ? colors.text.dark.secondary
                  : colors.text.secondary,

              fontSize: 14,
              // paddingBlock: 8,
              // paddingInline: 12,
              // height: 40,
              // lineHeight: 40,
              borderRadius: 8,
              colorBgContainerDisabled:
                mode === "dark" ? colors.neutral[900] : colors.neutral[100],
              colorTextDisabled:
                mode === "dark"
                  ? colors.text.dark.disabled
                  : colors.text.disabled,
              colorBgElevated:
                mode === "dark" ? colors.neutral[900] : colors.background.paper,
              optionSelectedBg:
                mode === "dark"
                  ? colors.primary.main + "40"
                  : colors.primary.main + "10",
              optionActiveBg:
                mode === "dark"
                  ? colors.primary.main + "80"
                  : colors.primary.main + "20",
            },
            // Add more component customizations as needed
          },
        }}
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
};

export default StyledComponentsRegistry;
