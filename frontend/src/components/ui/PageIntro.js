import React from "react";
import { Box, Typography, Stack } from "@mui/material";

import { UI } from "../../theme/constants";

const PageIntro = ({
  title,
  subtitle,
  action = null,
  sx = {}
}) => {
  return (
    <Box
      sx={{
        mb: UI.layout.headerMarginBottom,
        ...sx
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700
        }}
      >
        {title}
      </Typography>

      {(subtitle || action) && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mt: 1 }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              minWidth: 0
            }}
          >
            {subtitle}
          </Typography>

          {action && (
            <Box sx={{ flexShrink: 0 }}>
              {action}
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default PageIntro;