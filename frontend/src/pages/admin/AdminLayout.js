import { useState } from "react";
import {
  Box,
  CssBaseline,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import AccountMenu from "../../components/AccountMenu";
import SideBar from "./SideBar";

const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const HEADER_HEIGHT = theme.layout.headerHeight;
  const DRAWER_OPEN = theme.layout.drawer.open;
  const DRAWER_CLOSED = theme.layout.drawer.closed;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <CssBaseline />

      {/* Header */}
      <Box
        component="header"
        sx={{
          height: HEADER_HEIGHT,
          display: "flex",
          alignItems: "center",
          px: { xs: 2, md: 3 },
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 1200,
        }}
      >
        <IconButton
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle sidebar"
          aria-expanded={open}
          aria-controls="sidebar"
          edge="start"
          sx={{ mr: 2, color: "text.secondary" }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <AccountMenu />
      </Box>

      {/* Body */}
      <Box
        sx={{
          display: "flex",
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        {/* Sidebar */}
        <Box
          component="nav"
          id="sidebar"
          aria-label="Sidebar navigation"
          sx={{
            width: open ? DRAWER_OPEN : DRAWER_CLOSED,
            transition: "width 220ms cubic-bezier(.2,.0,.0,1)",
            bgcolor: "background.paper",
            borderRight: "1px solid",
            borderColor: "divider",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <SideBar open={open} />
        </Box>

        {/* Main */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            p: 3,
          }}
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;