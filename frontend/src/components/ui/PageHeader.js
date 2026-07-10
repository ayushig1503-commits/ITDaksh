import { Box, Typography, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const PageHeader = ({ title, subtitle, icon: Icon, action, divider = false }) => {
  const theme = useTheme();
  const { spacingTokens: SP } = theme;

  return (
    <Box sx={{ mb: SP.xl / 8 }}> {/* MUI spacing uses 8px units by default */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: SP.md / 8,
          flexWrap: 'wrap',
        }}
      >
        {/* Left — icon + text */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: SP.sm / 8 }}>
          {Icon && (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: theme.shape.borderRadius / 2, // Using theme radius
                bgcolor: 'background.subtle', // Leveraging theme palette keys
                border: `1px solid ${theme.palette.divider}`,
                display: 'grid',
                placeItems: 'center',
                color: 'text.secondary',
                flexShrink: 0,
              }}
            >
              <Icon fontSize="small" />
            </Box>
          )}

          <Box>
            <Typography
              variant="h1" // Uses your specific H1 styles from theme.js
              sx={{
                color: 'text.primary',
              }}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography
                variant="caption" // Uses your 600 weight, 1.3 line-height caption
                sx={{
                  color: 'text.secondary',
                  mt: 0.25,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Right — actions */}
        {action && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: SP.sm / 8 }}>
            {action}
          </Box>
        )}
      </Box>

      {divider && (
        <Divider sx={{ mt: SP.md / 8 }} />
      )}
    </Box>
  );
};

export default PageHeader;