import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { CSSProperties } from "react";
import Provider from "@/lib/provider";
import colors from "@/lib/color";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mesin Pengayakan Dashboard",
  description:
    "Live monitoring dashboard for stone detection and machine status",
};
const objMainColor: CSSProperties = {
  // Primary Colors
  "--color-primary": colors.primary.main,
  "--color-primary-light": colors.primary.light,
  "--color-primary-dark": colors.primary.dark,
  "--color-primary-contrast": colors.primary.contrast,

  // Secondary Colors
  "--color-secondary": colors.secondary.main,
  "--color-secondary-light": colors.secondary.light,
  "--color-secondary-dark": colors.secondary.dark,
  "--color-secondary-contrast": colors.secondary.contrast,

  // Background Colors
  "--color-background": colors.background.default,
  "--color-background-paper": colors.background.paper,
  "--color-background-dark": colors.background.dark,

  // Text Colors
  "--color-text-primary": colors.text.primary,
  "--color-text-secondary": colors.text.secondary,
  "--color-text-disabled": colors.text.disabled,
  "--color-text-dark-primary": colors.text.dark.primary,
  "--color-text-dark-secondary": colors.text.dark.secondary,
  "--color-text-dark-disabled": colors.text.dark.disabled,

  // Border Colors
  "--color-border": colors.border.main,
  "--color-border-light": colors.border.light,
  "--color-border-dark": colors.border.dark,

  // Semantic Colors
  "--color-success": colors.success.main,
  "--color-warning": colors.warning.main,
  "--color-error": colors.error.main,
  "--color-info": colors.info.main,

  // Action Colors
  "--color-action-hover": colors.action.hover,
  "--color-action-selected": colors.action.selected,
  "--color-action-disabled": colors.action.disabled,
  "--color-action-disabled-bg": colors.action.disabledBackground,
  "--color-action-focus": colors.action.focus,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={objMainColor}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
