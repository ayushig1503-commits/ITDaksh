import React from "react";
import { Box, Typography } from "@mui/material";

import { UI } from "../../theme/constants";

const EmptyState = ({
  children,
  sx = {},
  textSx = {},
  py = 10
}) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py,
        px: 3,
        borderRadius: 2,
        border: `1px dashed ${UI.border}`,
        bgcolor: "#fff",
        ...sx
      }}
    >
      <Typography
        sx={{
          fontSize: "0.9rem",
          color: UI.textMuted,
          ...textSx
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

export default EmptyState;