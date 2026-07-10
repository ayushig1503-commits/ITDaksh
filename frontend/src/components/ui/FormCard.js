import { Paper, Box } from "@mui/material";
import { UI } from "../../theme/constants";

const FormCard = ({ children, maxWidth = 450, sx = {} }) => {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 100px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "20px",
        paddingBottom: "20px",
        bgcolor: UI.background,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth,
          padding: "24px 32px",
          borderRadius: "16px",
          bgcolor: UI.surface,
          border: `1px solid ${UI.border}`,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          ...sx,
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default FormCard;