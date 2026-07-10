export const UI = {
  // =============================
  // Layout / Surfaces
  // =============================
  background: "#F4F5F7",
  backgroundSubtle: "#F8F9FA", 
  surface: "#FFFFFF",
  border: "#E5E7EB",
  borderStrong: "#D1D5DB",

  // =============================
  // Typography Colors
  // =============================
  textPrimary: "#111827",
  textSecondary: "#4B5563",
  textMuted: "#6B7280",
  textInverse: "#FFFFFF",

  // =============================
  // Brand Accent
  // =============================
  accent: "#6E5AA6",
  accentHover: "#5E4B95",
  accentSubtle: "#F3F0FA",
  accentGhost: "rgba(110, 90, 166, 0.12)", 

  // =============================
  // Semantic
  // =============================
  danger: "#DC2626",
  dangerHover: "#B91C1C",
  dangerSubtle: "#FEF2F2",

  success: "#16A34A",
  successHover: "#15803D",
  successSubtle: "#ECFDF5",

  warning: "#F59E0B",
  warningSubtle: "#FFFBEB",

  info: "#2563EB",
  infoSubtle: "#EFF6FF",

  // =============================
  // Elevation / Shadows
  // =============================
  shadowSm: "0 1px 2px rgba(0,0,0,0.05)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.08)",
  shadowLg: "0 10px 30px rgba(0,0,0,0.12)",

  // =============================
  // Radius
  // =============================
  radiusXs: "6px",
  radiusSm: "8px",
  radiusMd: "12px",
  radiusLg: "16px",

  // =============================
  // Spacing (Multipliers of 8px)
  // =============================
  spacing: {
    xs: 0.5, // 4px
    sm: 1,   // 8px
    md: 1.5, // 12px
    lg: 2,   // 16px
    xl: 3,   // 24px (The Baseline Gap)
    xxl: 4,  // 32px
    xxxl: 5  // 40px
  },

  // =============================
  // Layout Consistency (The Baseline)
  // =============================
  layout: {
    maxWidth: 1200,
    pagePadding: 3,     // Corresponds to '24px' (xl)
    headerMarginBottom: 3, // Gap between header and content
    gridGap: 3,         // Gap between main content and sidebar
    sidebarWidth: 400,
    stickyTop: 24,      // 3 spaces
  },

  // =============================
  // Typography Scale
  // =============================
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.35,
    },
    body: {
      fontSize: '0.95rem',
      lineHeight: 1.5,
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    caption: {
      fontSize: '0.8rem',
    }
  },

  // =============================
  // Component Specific Sizes
  // =============================
  button: {
    height: "44px",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "0.95rem",
    paddingX: "18px",
  },

  input: {
    height: "44px",
    fontSize: "0.95rem",
    paddingX: "14px",
    borderRadius: "8px",
  }
};