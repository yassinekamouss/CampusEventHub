/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#2563EB";
const tintColorDark = "#60A5FA";

export const Colors = {
  light: {
    // Core
    text: "#0F172A",
    textMuted: "#6B7280",
    background: "#F3F4F6",
    surface: "#FFFFFF",
    surfaceAlt: "#E5E7EB",
    border: "#D1D5DB",
    overlay: "rgba(15, 23, 42, 0.08)",

    // Brand
    primary: tintColorLight,
    primarySoft: "#DBEAFE",
    secondary: "#14B8A6",

    // Status
    danger: "#EF4444",
    dangerSoft: "#FEE2E2",
    warning: "#F59E0B",
    success: "#10B981",

    // Inputs / cards / chips
    card: "#FFFFFF",
    cardMuted: "#F9FAFB",
    inputBackground: "#F9FAFB",
    inputBorder: "#E5E7EB",
    chipBackground: "#E5E7EB",

    // Navigation (kept for compatibility)
    tint: tintColorLight,
    icon: "#6B7280",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: tintColorLight,
  },
  dark: {
    // Core
    text: "#E5E7EB",
    textMuted: "#9CA3AF",
    background: "#020617",
    surface: "#020617",
    surfaceAlt: "#020617",
    border: "#1F2933",
    overlay: "rgba(15, 23, 42, 0.7)",

    // Brand
    primary: tintColorDark,
    primarySoft: "#1D3A5F",
    secondary: "#22C55E",

    // Status
    danger: "#F97373",
    dangerSoft: "rgba(248, 113, 113, 0.16)",
    warning: "#EAB308",
    success: "#4ADE80",

    // Inputs / cards / chips
    card: "#020617",
    cardMuted: "#020617",
    inputBackground: "#020617",
    inputBorder: "#1F2933",
    chipBackground: "#020617",

    // Navigation (kept for compatibility)
    tint: tintColorDark,
    icon: "#9CA3AF",
    tabIconDefault: "#4B5563",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
