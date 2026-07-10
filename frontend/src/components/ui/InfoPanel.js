import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  CircularProgress,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { UI } from "../../theme/constants";

const InfoPanel = ({
  title,
  children,

  // Edit Mode
  editable = false,
  editing = false,

  // Actions
  onEditToggle,
  onSave,
  onCancel,

  // Loading
  saving = false,

  // Existing custom actions
  actions,

  // Layout variants
  compact = false,

  // Styling
  sx = {},
  bodySx = {},
  headerSx = {},
}) => {
  return (
    <Box
      sx={{
        border: `1px solid ${UI.border}`,
        bgcolor: UI.surface,
        overflow: "hidden",
        borderRadius: UI.radius?.lg || "18px",
        transition: "all 0.2s ease",

        ...(editing && {
          borderColor: UI.primary,
          boxShadow: `0 0 0 1px ${UI.primary}20`,
        }),

        ...sx,
      }}
    >
      {/* ═════════ HEADER ═════════ */}
      <Box
        sx={{
          px: compact ? 2 : 3,
          py: compact ? 1.5 : 2,

          borderBottom: `1px solid ${UI.border}`,
          bgcolor: editing ? `${UI.primary}08` : "#f7f7f7",

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          transition: "all 0.2s ease",

          ...headerSx,
        }}
      >
        {/* TITLE */}
        <Typography
          sx={{
            fontSize: compact ? "1rem" : "1.1rem",
            fontWeight: 600,
            color: UI.textPrimary,
            letterSpacing: 0.2,
          }}
        >
          {title}
        </Typography>

        {/* ACTIONS */}
        <Stack direction="row" spacing={0.5} alignItems="center">

          {/* EDIT */}
          {editable && !editing && (
            <Tooltip title="Edit section">
              <IconButton
                size="small"
                onClick={onEditToggle}
                sx={{
                  color: UI.textMuted,

                  "&:hover": {
                    bgcolor: UI.hover,
                    color: UI.primary,
                  },
                }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* SAVE */}
          {editable && editing && (
            <Tooltip title="Save changes">
              <IconButton
                size="small"
                onClick={onSave}
                disabled={saving}
                sx={{
                  color: UI.primary,

                  "&:hover": {
                    bgcolor: UI.hover,
                  },
                }}
              >
                {saving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SaveOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}

          {/* CANCEL */}
          {editable && editing && (
            <Tooltip title="Cancel editing">
              <IconButton
                size="small"
                onClick={onCancel}
                sx={{
                  color: UI.textMuted,

                  "&:hover": {
                    bgcolor: UI.hover,
                    color: UI.textPrimary,
                  },
                }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* EXTRA CUSTOM ACTIONS */}
          {actions}

        </Stack>
      </Box>

      {/* ═════════ BODY ═════════ */}
      <Box
        sx={{
          px: compact ? 2 : 3,
          py: compact ? 2 : 3,

          ...bodySx,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default InfoPanel;