import * as React from "react";
import {
  Box,
  Divider,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

// Icons
import HomeIcon from "@mui/icons-material/Home";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CampaignIcon from "@mui/icons-material/Campaign";
import SecurityIcon from "@mui/icons-material/Security";
import { UI } from "../../theme/constants"
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";

const BRAND = UI.accent; // instead of "#65429c"
const TEXT = UI.textPrimary; // instead of "#202124"
const MUTED = UI.textSecondary; // instead of "#5f6368"

// Helper: Defined outside to prevent re-creation on every render
const NavItem = ({ item, open, isActive }) => {
  const Icon = item.icon;

  const NavButton = (
    <ListItemButton
      component={Link}
      to={item.to}
      sx={{
        height: 40,
        mx: 1,
        my: 0.35,
        px: 1.75,
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        bgcolor: "transparent",
        transition: "background-color .18s ease",
        "&:hover": {
          bgcolor: "rgba(60,64,67,.06)",
        },
      }}
    >
      {/* FIXED ICON LANE */}
      <Box
        sx={{
          width: 24,
          minWidth: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          mr: 1.75,
          color: isActive ? BRAND : MUTED,
          transition: "color .18s ease",
        }}
      >
        <Icon sx={{ fontSize: 20 }} />
      </Box>

      {/* COLLAPSING LABEL AREA */}
      <Box
        sx={{
          width: open ? "auto" : 0,
          opacity: open ? 1 : 0,
          overflow: "hidden",
          whiteSpace: "nowrap",
          transition: "width 180ms ease, opacity 120ms ease",
          flexGrow: open ? 1 : 0,
        }}
      >
        <ListItemText
          primary={item.label}
          sx={{ m: 0 }}
          primaryTypographyProps={{
            fontSize: ".89rem",
            fontWeight: isActive ? 600 : 500,
            color: TEXT,
            letterSpacing: "-0.01em",
          }}
        />
      </Box>
    </ListItemButton>
  );

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      {open ? (
        NavButton
      ) : (
        <Tooltip title={item.label} placement="right" arrow>
          <Box component="div">{NavButton}</Box>
        </Tooltip>
      )}
    </ListItem>
  );
};

const SideBar = ({ open }) => {
  const location = useLocation();

const primary = [
  { to: "/Admin", label: "Home", icon: HomeIcon },
  { to: "/Admin/classes", label: "Classes", icon: ClassOutlinedIcon },
  { to: "/Admin/subjects", label: "Subjects", icon: AssignmentIcon },
  { to: "/Admin/students", label: "Students", icon: PersonOutlineIcon },
  { to: "/Admin/teachers", label: "Teachers", icon: SupervisorAccountOutlinedIcon },
  { to: "/Admin/notices", label: "Announcements", icon: CampaignIcon },
  { to: "/Admin/complains", label: "Complaints", icon: AnnouncementOutlinedIcon },
  { to: "/Admin/security", label: "Audit Logs", icon: SecurityIcon },
];

  const secondary = [
    { to: "/Admin/profile", label: "Profile", icon: AccountCircleOutlinedIcon },
    { to: "/Admin/logout", label: "Logout", icon: ExitToAppIcon },
  ];

  const theme = useTheme();
  const SP = theme.spacingTokens;

  return (
    <Box sx={{ pt: `${SP.md}px`, pb: `${SP.md}px`, overflowY: "auto" }}>
      <List disablePadding>
        {primary.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            open={open}
            isActive={location.pathname.startsWith(item.to)}
          />
        ))}
      </List>

      <Divider sx={{ my: 1.4 }} />

      <Box
        sx={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "opacity .15s ease",
        }}
      >
        <Typography
          sx={{
            px: 3,
            pb: 0.9,
            pt: 0.35,
            fontSize: ".71rem",
            fontWeight: 700,
            letterSpacing: ".08em",
            color: "#475569",
            textTransform: "uppercase",
          }}
        >
          Administrative
        </Typography>
      </Box>

      <List disablePadding>
        {secondary.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            open={open}
            isActive={location.pathname.startsWith(item.to)}
          />
        ))}
      </List>
    </Box>
  );
};

export default SideBar;