import React from "react";

import {
  Typography,
  Box
} from "@mui/material";

import { UI } from "../../theme/constants";

export const studentColumns = [
  {
    id: "name",
    label: "Student",
    width: "28%",

    format: (val) => (
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "0.9rem"
        }}
      >
        {val}
      </Typography>
    )
  },

  {
    id: "rollNum",
    label: "Roll No",
    width: "12%",

    format: (val) => (
      <Typography
        sx={{
          fontSize: "0.85rem",
          color: UI.textSecondary
        }}
      >
        {val || "—"}
      </Typography>
    )
  },

  {
    id: "enrollmentNo",
    label: "Enrollment",
    width: "18%",

    format: (val) => (
      <Typography
        sx={{
          fontSize: "0.85rem",
          color: UI.textSecondary
        }}
      >
        {val || "—"}
      </Typography>
    )
  },

  {
    id: "sclassName",
    label: "Class",
    width: "14%",

    format: (val) => (
      <Typography
        sx={{
          fontWeight: 500,
          fontSize: "0.85rem",
          color: UI.textSecondary
        }}
      >
        {val ? `Class ${val}` : "—"}
      </Typography>
    )
  },

  {
    id: "attendance",
    label: "Attendance",
    width: "14%",

    format: (val) => {
      const percentage = val ?? 0;

      return (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            px: 1.25,
            py: 0.45,
            borderRadius: 1.5,
            bgcolor:
              percentage >= 75
                ? "#ECFDF5"
                : "#FEF2F2",

            color:
              percentage >= 75
                ? "#059669"
                : "#DC2626",

            fontSize: "0.75rem",
            fontWeight: 700,
          }}
        >
          {percentage}%
        </Box>
      );
    }
  },
];