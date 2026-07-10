// src/theme/index.js

import { createTheme } from '@mui/material/styles';
import { UI } from './constants';

const baseTheme = createTheme();

const theme = createTheme({
  // Keep MUI spacing system
  spacing: 8,

  // 🔥 Layout system (global structure)
  layout: {
    headerHeight: 64,
    drawer: {
      open: 256,
      closed: 72,
    },
    contentMaxWidth: 1600,
  },

  // 🔥 Semantic spacing tokens (NEW — important)
  spacingTokens: {
    xs: 4,   // icon gaps, tight UI
    sm: 8,   // inline spacing
    md: 16,  // cards, rows
    lg: 24,  // layout gaps (columns)
    xl: 32,  // section spacing
  },

  palette: {
    primary: { main: UI.accent },
    background: {
      default: UI.background,
      paper: UI.surface,
    },
    text: {
      primary: UI.textPrimary,
      secondary: UI.textSecondary,
    },
    error: { main: UI.danger },
    success: { main: UI.success },
  },

  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',

    h1: {
      fontSize: UI.typography.h1.fontSize,
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },

    h6: {
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },

    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },

    body1: {
      fontSize: UI.typography.body.fontSize,
      lineHeight: 1.5,
    },

    body2: {
      fontSize: UI.typography.body.fontSize,
      lineHeight: 1.4,
    },

    caption: {
      fontSize: UI.typography.label.fontSize,
      fontWeight: 600,
      lineHeight: 1.3,
    },

    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: UI.button.fontSize,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: UI.background,
          color: UI.textPrimary,
          scrollBehavior: 'smooth',
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },

    MuiLink: {
      defaultProps: { underline: 'none' },
      styleOverrides: {
        root: {
          fontSize: UI.typography.label.fontSize,
          fontWeight: 500,
          color: UI.accent,
          transition: 'all 0.2s ease',
          '&:hover': {
            textDecoration: 'underline',
            color: UI.accentHover,
          },
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          height: UI.button.height,
          borderRadius: UI.radiusSm,

          // 🔥 spacing aligned with system
          padding: `${baseTheme.spacing(1.25)} ${baseTheme.spacing(3)}`,

          transition: 'all 0.2s ease-in-out',
        },

        containedPrimary: {
          backgroundColor: UI.accent,
          '&:hover': {
            backgroundColor: UI.accentHover,
            transform: 'translateY(-1px)',
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: UI.backgroundSubtle,
          borderRadius: UI.radiusSm,
          transition: 'all 0.2s ease',

          '& fieldset': {
            borderColor: UI.border,
            transition: 'border-color 0.2s',
          },

          '&:hover:not(.Mui-focused):not(.Mui-error) fieldset': {
            borderColor: UI.borderStrong,
          },

          '&.Mui-focused': {
            backgroundColor: UI.accentGhost,
            '& fieldset': {
              borderColor: UI.accent,
              borderWidth: '1.5px',
            },
          },
        },

        input: {
          padding: baseTheme.spacing(1.5, 1.75),
          fontSize: UI.input.fontSize,
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
          paddingRight: baseTheme.spacing(1),
          color: UI.borderStrong,
          transition: 'color 0.2s',
        },
      },
    },

    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: baseTheme.spacing(2),
        },

        label: {
          fontSize: UI.typography.label.fontSize,
          color: UI.textSecondary,
          fontWeight: 500,
        },
      },
    },

    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: UI.surface,
        },
      },
    },
  },
});

export default theme;