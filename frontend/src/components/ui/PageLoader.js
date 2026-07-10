import React from "react";
import { Box, CircularProgress } from "@mui/material";

import { UI } from "../../theme/constants";

const PageLoader = ({
  py = 10,
  size = 30,
  thickness = 4,
  sx = {}
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py,
        width: "100%",
        ...sx
      }}
    >
      <CircularProgress
        size={size}
        thickness={thickness}
        sx={{ color: UI.accent }}
      />
    </Box>
  );
};

export default PageLoader;