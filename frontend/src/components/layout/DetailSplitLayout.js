import React from "react";
import { Box } from "@mui/material";
import { UI } from "../../theme/constants";

const DetailSplitLayout = ({
  left,
  right,
  sidebarWidth = UI.layout.sidebarWidth,
  sidebarTop = UI.layout.stickyTop,
  leftPaddingRight = 8,
  rightPaddingLeft = 8,
  disableDivider = false, // Added prop for more control
}) => {
  // Logic: Only use a grid if there is content for the right side
  const hasRightContent = Boolean(right);

  return (
    <Box
      sx={{
        display: "grid",
        // If no right content, take up the full 1fr. 
        // Otherwise, use the split logic.
        gridTemplateColumns: hasRightContent 
          ? {
              xs: "1fr",
              xl: `minmax(0, 1fr) ${sidebarWidth}px`
            }
          : "1fr",
        gap: 0,
        alignItems: "start"
      }}
    >
      {/* LEFT */}
      <Box
        sx={{
          minWidth: 0,
          // Only show padding and border if there's actually a right side to separate from
          pr: hasRightContent ? { xl: leftPaddingRight } : 0,
          borderRight: (hasRightContent && !disableDivider) 
            ? { xl: `1px solid ${UI.border}` } 
            : "none",

          "& .MuiTable-root": {
            tableLayout: "fixed",
            width: "100% !important",
          },

          "& .MuiTableCell-root:last-child": {
            paddingRight: 0
          }
        }}
      >
        {left}
      </Box>

      {/* RIGHT */}
      {hasRightContent && (
        <Box
          component="aside"
          sx={{
            display: { xs: "none", xl: "block" },
            pl: { xl: rightPaddingLeft }
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: sidebarTop
            }}
          >
            {right}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DetailSplitLayout;