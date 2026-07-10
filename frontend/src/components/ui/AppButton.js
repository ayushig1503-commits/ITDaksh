import { Button, CircularProgress } from "@mui/material";
import { UI } from "../../theme/constants";

const variantStyles = {
  primary: {
    base: {
      backgroundColor: UI.accent,
      color: "#ffffff",
      border: "1px solid transparent",
    },
    hover: {
      backgroundColor: UI.accentHover,
    },
  },

  secondary: {
    base: {
      backgroundColor: "transparent",
      color: UI.accent,
      border: `1px solid ${UI.accent}`,
    },
    hover: {
      backgroundColor: UI.accentSubtle,
    },
  },

  danger: {
    base: {
      backgroundColor: UI.danger,
      color: "#ffffff",
      border: "1px solid transparent",
    },
    hover: {
      backgroundColor: UI.dangerHover,
    },
  },

  ghost: {
    base: {
      backgroundColor: "transparent",
      color: UI.textSecondary,
      border: "1px solid transparent",
    },
    hover: {
      backgroundColor: UI.background,
      color: UI.textPrimary,
      border: `1px solid ${UI.border}`,
    },
  },
};

const sizeMap = {
  small:  { fontSize: "0.8125rem", px: "10px", py: "5px" },
  medium: { fontSize: "0.875rem",  px: "14px", py: "7px" },
  large:  { fontSize: "0.9375rem", px: "18px", py: "9px" },
};

const AppButton = ({
  children,
  variant = "primary",
  loading = false,
  fullWidth = false,
  size = "medium",
  sx = {},
  ...props
}) => {
  const styles = variantStyles[variant] || variantStyles.primary;
  const { fontSize, px, py } = sizeMap[size] || sizeMap.medium;

  return (
    <Button
      fullWidth={fullWidth}
      disabled={loading || props.disabled}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        height: "auto",          // let padding drive height, not a fixed px value
        padding: `${py} ${px}`,
        borderRadius: "8px",
        fontWeight: 500,
        fontSize,
        lineHeight: 1.5,
        textTransform: "none",
        letterSpacing: "0em",
        boxShadow: "none",
        transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease",

        ...styles.base,

        "&:hover": {
          boxShadow: "none",
          ...styles.hover,
        },

        "&:active": {
          transform: "scale(0.98)",
          boxShadow: "none",
        },

        "&.Mui-disabled": {
          opacity: 0.5,
          pointerEvents: "auto",
          cursor: "not-allowed",
        },

        ...sx,
      }}
      {...props}
    >
      {loading
        ? <CircularProgress size={16} sx={{ color: "inherit" }} />
        : children}
    </Button>
  );
};

export default AppButton;