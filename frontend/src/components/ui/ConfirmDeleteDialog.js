import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Stack
} from "@mui/material";

import AppButton from "./AppButton";
import { UI } from "../../theme/constants";

const ConfirmDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  description = "",
  confirmText = "DELETE",
  consequences = []
}) => {
  const [input, setInput] = useState("");

  const isMatch = input.trim() === confirmText.trim();

  const handleClose = () => {
    setInput("");
    onClose();
  };

  const handleConfirm = async () => {
    if (!isMatch) return;
    await onConfirm();
    setInput("");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Typography sx={{ color: UI.textSecondary }}>
            {description}
          </Typography>

          {/* Consequences */}
          {consequences.length > 0 && (
            <Stack spacing={0.5}>
              {consequences.map((c, i) => (
                <Typography
                  key={i}
                  sx={{ fontSize: "0.85rem", color: UI.error }}
                >
                  • {c}
                </Typography>
              ))}
            </Stack>
          )}

          <Typography sx={{ fontSize: "0.8rem", color: UI.textMuted }}>
            Type <b>{confirmText}</b> to confirm
          </Typography>

          <TextField
            size="small"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type "${confirmText}"`}
            inputProps={{ 'aria-label': `Type ${confirmText} to confirm deletion` }}
            autoFocus
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <AppButton variant="ghost" onClick={handleClose}>
          Cancel
        </AppButton>

        <AppButton
        onClick={handleConfirm}
        disabled={!isMatch}
        variant="danger"
        >
        Delete
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;