import {
    TableCell,
    TableRow,
    styled,
    tableCellClasses,
    Drawer as MuiDrawer,
    AppBar as MuiAppBar,
} from "@mui/material";

console.log("STYLES.JS LOADED");

const drawerWidth = 240;

export const StyledTableCell = styled(TableCell)(({ theme, align }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#f8fafc',
        color: '#475569',
        fontWeight: 600,
        textTransform: 'uppercase',
        borderBottom: '1px solid #e5e5ea',
        textAlign: align || 'left',
        padding: '12px 16px', // Standardize padding
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '0.85rem', // Slightly smaller for better density
        color: '#1d1d1f',
        borderBottom: '1px solid #f2f2f7',
        textAlign: align || 'left',
        // 🔥 The fix:
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '200px', // Prevents any single cell from exploding the width
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: '#ffffff',
    cursor: 'pointer', // Important for discoverability
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: '#f8fafc', // Slightly cooler blue-grey hover
        boxShadow: 'inset 4px 0px 0px 0px #7965b0',
        '& .MuiTableCell-root': {
            color: '#7965b0', // Subtle color shift on the text
        }
    },
}));

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#ffffff',
  color: '#1d1d1f',
  boxShadow: 'none',
  borderBottom: '1px solid #e5e5ea',

  width: '100%',
  marginLeft: 0,

  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: open ? 240 : 72,
  flexShrink: 0,
  whiteSpace: "nowrap",

  "& .MuiDrawer-paper": {
    width: open ? 240 : 72,
    overflowX: "hidden",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    borderRight: "1px solid #e5e5ea",
    backgroundColor: "#fff",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));