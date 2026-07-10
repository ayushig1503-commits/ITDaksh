import { TextField } from "@mui/material";
import { UI } from "../../theme/constants";

const StyledField = ({ sx = {}, ...props }) => {
  return (
    <TextField
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          backgroundColor: UI.surface,
        },
        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: UI.border,
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: UI.accent,
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: UI.accent,
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default StyledField;