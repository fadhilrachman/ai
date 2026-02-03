export default {
  // Primary Colors - AI Green Accent
  primary: {
    main: "#10A37F", // AI green
    light: "#1ABC9C", // Lighter shade for hover states
    dark: "#0D8A6A", // Darker shade for active states
    contrast: "#FFFFFF", // Text color on primary background
  },

  // Secondary Colors
  secondary: {
    main: "#8E8EA0", // Muted gray
    light: "#ACACBE", // Lighter shade
    dark: "#6E6E80", // Darker shade
    contrast: "#FFFFFF", // Text color on secondary background
  },

  // Neutral Colors - AI Dark Theme
  neutral: {
    50: "#F7F7F8", // Lightest (for light mode)
    100: "#ECECF1", // Light
    200: "#D9D9E3", // Border light
    300: "#C5C5D2", // Border
    400: "#8E8EA0", // Disabled text
    500: "#6E6E80", // Secondary text
    600: "#565869", // Primary text light
    700: "#40414F", // Chat bubble background
    800: "#343541", // Main background
    900: "#202123", // Sidebar background
  },

  // Semantic Colors
  success: {
    main: "#10A37F", // Using AI green
    light: "#1ABC9C",
    dark: "#0D8A6A",
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

  // Background Colors - AI Dark Theme
  background: {
    default: "#343541", // Main chat area
    paper: "#40414F", // Cards/Elevated surfaces
    dark: "#202123", // Sidebar/Darkest areas
  },

  // Text Colors
  text: {
    primary: "#ECECF1", // Primary text (light)
    secondary: "#8E8EA0", // Secondary text (muted)
    disabled: "#6E6E80", // Disabled text
    dark: {
      primary: "#ECECF1", // Dark mode primary text
      secondary: "#8E8EA0", // Dark mode secondary text
      disabled: "#6E6E80", // Dark mode disabled text
    },
  },

  // Border Colors
  border: {
    light: "#4E4F60", // Light borders (dark mode)
    main: "#565869", // Default borders
    dark: "#2D2D3A", // Dark mode borders
  },

  // Action Colors
  action: {
    hover: "rgba(255, 255, 255, 0.08)", // Hover state
    selected: "rgba(255, 255, 255, 0.12)", // Selected state
    disabled: "rgba(255, 255, 255, 0.26)", // Disabled state
    disabledBackground: "rgba(255, 255, 255, 0.12)", // Disabled background
    focus: "rgba(255, 255, 255, 0.12)", // Focus state
    dark: {
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
      focus: "rgba(255, 255, 255, 0.12)",
    },
  },
} as const;
