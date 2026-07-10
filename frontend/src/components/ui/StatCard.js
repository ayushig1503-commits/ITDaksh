import { Paper, Box, Typography } from '@mui/material';
import { UI } from '../../theme/constants';

const StatCard = ({ title, value, icon, color, prefix = "" }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: UI.radiusSm,
        bgcolor: UI.surface,
        border: `1px solid ${UI.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        minHeight: 80,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          borderColor: UI.borderStrong,
          boxShadow: UI.shadowSm,
        },
      }}
    >
      {/* Icon (no background box) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      {/* Text */}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            color: UI.textSecondary,
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: UI.textPrimary,
            lineHeight: 1.2,
            mt: 0.25,
          }}
        >
          {prefix}{value.toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StatCard;