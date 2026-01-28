export default {
  // Primary Colors
  primary: {
    main: "#120097", // Your main brand color
    light: "#4330B3", // Lighter shade for hover states
    dark: "#0D0066", // Darker shade for active states
    contrast: "#FFFFFF", // Text color on primary background
  },

  // Secondary Colors
  secondary: {
    main: "#6B7280", // Supporting color
    light: "#9CA3AF", // Lighter shade
    dark: "#4B5563", // Darker shade
    contrast: "#FFFFFF", // Text color on secondary background
  },

  // Neutral Colors
  neutral: {
    50: "#FAFAFA", // Lightest background
    100: "#F5F5F5", // Light background
    200: "#E5E5E5", // Border light
    300: "#D4D4D4", // Border
    400: "#A3A3A3", // Disabled text
    500: "#737373", // Secondary text
    600: "#525252", // Primary text
    700: "#404040", // Heading text
    800: "#262626", // Dark background
    900: "#171717", // Darkest background
  },

  // Semantic Colors
  success: {
    main: "#22C55E", // Success states
    light: "#86EFAC",
    dark: "#15803D",
    contrast: "#FFFFFF",
  },
  warning: {
    main: "#F59E0B", // Warning states
    light: "#FCD34D",
    dark: "#B45309",
    contrast: "#FFFFFF",
  },
  error: {
    main: "#EF4444", // Error states
    light: "#FCA5A5",
    dark: "#B91C1C",
    contrast: "#FFFFFF",
  },
  info: {
    main: "#3B82F6", // Information states
    light: "#93C5FD",
    dark: "#1D4ED8",
    contrast: "#FFFFFF",
  },

  // Background Colors
  background: {
    default: "#ffffff", // Light mode background
    paper: "#FFFFFF", // Card/Paper background
    dark: "#1A1A1A", // Dark mode background
  },

  // Text Colors
  text: {
    primary: "#030712", // Primary text
    secondary: "#6B7280", // Secondary text
    disabled: "#9CA3AF", // Disabled text
    dark: {
      primary: "#F9FAFB", // Dark mode primary text
      secondary: "#D1D5DB", // Dark mode secondary text
      disabled: "#6B7280", // Dark mode disabled text
    },
  },

  // Border Colors
  border: {
    light: "#E5E5E5", // Light borders
    main: "#D4D4D4", // Default borders
    dark: "#27272A", // Dark mode borders
  },

  // Action Colors
  action: {
    hover: "rgba(0, 0, 0, 0.04)", // Hover state
    selected: "rgba(0, 0, 0, 0.08)", // Selected state
    disabled: "rgba(0, 0, 0, 0.26)", // Disabled state
    disabledBackground: "rgba(0, 0, 0, 0.12)", // Disabled background
    focus: "rgba(0, 0, 0, 0.12)", // Focus state
    dark: {
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
      focus: "rgba(255, 255, 255, 0.12)",
    },
  },
} as const;
