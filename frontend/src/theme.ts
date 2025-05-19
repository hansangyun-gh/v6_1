/**
 * 세련된 LLM 평가 웹앱용 Chakra 테마 (v2.x extendTheme)
 * - 브랜드 블루, 그레이, 민트, 가독성 폰트, spacing, shadow, 반응형 등
 */
import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50:  "#e3f2fd",
      100: "#bbdefb",
      200: "#90caf9",
      300: "#64b5f6",
      400: "#42a5f5",
      500: "#2B6CB0", // 메인
      600: "#1e88e5",
      700: "#1976d2",
      800: "#1565c0",
      900: "#0d47a1",
    },
    gray: {
      50:  "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
    mint: {
      100: "#e6fff7",
      200: "#b2fce4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6",
    },
  },
  fonts: {
    heading: "'Noto Sans KR', sans-serif",
    body: "'Noto Sans KR', sans-serif",
  },
  shadows: {
    md: "0 4px 12px rgba(44, 62, 80, 0.08)",
  },
  breakpoints: {
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
  },
});

export default theme; 