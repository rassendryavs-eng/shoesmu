/**
 * Shoesmu Admin — Design Tokens Reference
 * Derived from DESIGN-nike.md, Light Mode.tokens.json, and Mode 1.tokens.json
 */

export const TOKENS = {
  colors: {
    ink: "#111111",
    canvas: "#FFFFFF",
    softCloud: "#F5F5F5",
    charcoal: "#39393B",
    ash: "#4B4B4D",
    mute: "#707072",
    stone: "#9E9EA0",
    hairline: "#CACACB",
    hairlineSoft: "#E5E5E5",
    sale: "#D30005",
    saleDeep: "#780700",

    semantic: {
      success: {
        light: "#ECFEF3",
        border: "#A9EFC5",
        main: "#079455",
        dark: "#053321",
      },
      warning: {
        light: "#FFFAEA",
        border: "#FEDF88",
        main: "#DC6903",
        dark: "#4E1D09",
      },
      error: {
        light: "#FEF3F2",
        border: "#FECDCA",
        main: "#D92D21",
        dark: "#4E1D09",
      },
      info: {
        light: "#E5F0FF",
        border: "#A5CBFF",
        main: "#006BFF",
        dark: "#001F4D",
      },
    },
  },

  typography: {
    fontFamily: {
      primary: "'Plus Jakarta Sans', Inter, system-ui, sans-serif",
      display: "'Plus Jakarta Sans', 'Bebas Neue', sans-serif",
      campaign: "'Bebas Neue', sans-serif",
    },
  },

  rounded: {
    none: "0px",
    sm: "18px",
    md: "24px",
    lg: "30px", // Pill
    full: "9999px",
  },

  spacing: {
    xxs: "2px",
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "18px",
    xl: "24px",
    xxl: "30px",
    section: "48px",
  },
};

export default TOKENS;
