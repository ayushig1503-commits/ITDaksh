// src/components/common/RowActions.jsx

import { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { UI } from '../../theme/constants';

const iconButtonSx = {
  width: 32,
  height: 32,
  borderRadius: UI.radiusSm,
  color: UI.textSecondary,
  transition: 'all 0.15s ease',

  '&:hover': {
    bgcolor: UI.backgroundSubtle,
    color: UI.textPrimary,
  }
};

const RowActions = ({ onView, onDelete, menuItems = [] }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const hasMenu = menuItems.length > 0 || onDelete;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 0.5
      }}
    >
      {onView && (
        <IconButton
          size="small"
          onClick={onView}
          aria-label="View"
          sx={iconButtonSx}
        >
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      )}

      {hasMenu && (
        <>
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            aria-label="More options"
            sx={iconButtonSx}
          >
            <MoreHorizIcon fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            PaperProps={{
              elevation: 0,
              sx: {
                minWidth: 190,
                mt: 0.5,
                p: 0.5,
                border: `1px solid ${UI.border}`,
                borderRadius: UI.radiusMd,
                boxShadow: UI.shadowLg,
                backgroundColor: UI.surface,

                '& .MuiMenuItem-root': {
                  minHeight: 36,
                  px: 1.25,
                  py: 0.75,
                  borderRadius: UI.radiusSm,
                  fontSize: '0.875rem',
                  color: UI.textPrimary,

                  '&:hover': {
                    bgcolor: UI.backgroundSubtle
                  }
                }
              }
            }}
          >
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  item.onClick();
                  setAnchorEl(null);
                }}
              >
                {item.icon && (
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: UI.textSecondary
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                )}

                <ListItemText>{item.label}</ListItemText>
              </MenuItem>
            ))}

            {onDelete && menuItems.length > 0 && (
              <Divider
                sx={{
                  my: 0.5,
                  borderColor: UI.border
                }}
              />
            )}

            {onDelete && (
              <MenuItem
                onClick={() => {
                  onDelete();
                  setAnchorEl(null);
                }}
                sx={{
                  color: `${UI.danger} !important`,

                  '&:hover': {
                    bgcolor: `${UI.dangerSubtle} !important`
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 32,
                    color: UI.danger
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </ListItemIcon>

                <ListItemText>Delete</ListItemText>
              </MenuItem>
            )}
          </Menu>
        </>
      )}
    </Box>
  );
};

export default RowActions;