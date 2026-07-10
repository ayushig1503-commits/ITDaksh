import React from "react";
import { Box, Typography } from "@mui/material";

import { UI } from "../../theme/constants";

const SECTION_LABEL_STYLES = {
  fontSize: "0.72rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: UI.textMuted,
  lineHeight: 1,
};

const SectionBlock = ({
  title,
  action = null,
  children,
  sx = {},
  contentSx = {},
  headerSx = {}
}) => {
return (
  <Box sx={sx}>
    {(title || action) && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          minHeight: 40,
          ...headerSx
        }}
      >
        <Typography sx={SECTION_LABEL_STYLES}>
          {title}
        </Typography>

        {action}
      </Box>
    )}

    <Box sx={contentSx}>
      {children}
    </Box>
  </Box>
);
};

export default SectionBlock;