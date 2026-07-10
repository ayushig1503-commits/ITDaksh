import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import {
  SecurityOutlined as SecurityIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  SearchOutlined
} from "@mui/icons-material";

import { UI } from "../../theme/constants";
import TableTemplate from "../../components/TableTemplate";
import DataSection from "../../components/ui/DataSection";
import PageIntro from "../../components/ui/PageIntro";
import AppButton from "../../components/ui/AppButton";

const SecurityPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [refreshKey, setRefreshKey] = useState(0);
  const [logs, setLogs] = useState([]);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    fetchLogs();
  }, [refreshKey]);

  const fetchLogs = async () => {
    try {
      const API_BASE = process.env.REACT_APP_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/audit-logs`);
      const data = await res.json();
      setLogs(data || []);
    } catch (err) {
      console.error("Failed to fetch logs", err);
      setLogs([]);
    }
  };

  /* ───────────────── DATA MAPPING (HASH CHAINING) ───────────────── */
const formattedLogs = useMemo(() => {
  return logs.map((log, index) => {

const actor = log.userId?.name || log.userId?.email || (log.userId ? "Admin" : "System");

    const logAction = log.action || "";
    let logCategory = "ACTIVITY"; // Default to activity for most things

    if (logAction.includes("LOGIN") || logAction.includes("LOGOUT")) {
      logCategory = "AUTHENTICATION";
    } 
    else if (
      logAction.includes("DELETE_ALL") || 
      logAction.includes("DELETE_CLASS") || 
      logAction.includes("RESET")
    ) {
      logCategory = "SYSTEM";
    }
    else {
      logCategory = "ACTIVITY";
    }

    const eventDescription = log.details || logAction.replace(/_/g, " ").toLowerCase();

    return {
      id: log._id || `${log.createdAt}-${index}`,
      rawTimestamp: log.createdAt,
      category: logCategory, 
      action: eventDescription, 
      user: actor,
      role: log.userRole || "SYSTEM",
      ip: log.ip === "::1" || log.ip === "127.0.0.1" ? "Localhost" : log.ip,
    };
  });
}, [logs]);

  const filteredLogs = useMemo(() => {
    return formattedLogs.filter((log) => {
      const s = search.toLowerCase();
      const matchesSearch =
        log.user.toLowerCase().includes(s) ||
        log.action.toLowerCase().includes(s) ||
        log.ip.toLowerCase().includes(s);
      const matchesCategory = category === "All Categories" || log.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [formattedLogs, search, category]);

  /* ───────────────── TABLE COLUMNS ───────────────── */
const securityColumns = [
{
    id: "rawTimestamp",
    label: "Timestamp",
    width: "15%",
    format: (val) => (
      <Typography sx={{ fontSize: "0.82rem" }}>
        {new Date(val).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
      </Typography>
    ),
  },
  {
    id: "category",
    label: "Category",
    width: "12%",
    format: (val) => (
      <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: UI.textMuted }}>
        {val}
      </Typography>
    ),
  },
  {
    id: "action",
    label: "Event Description",
    width: "25%",
    format: (val) => (
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 500, textTransform: "capitalize" }}>
        {val}
      </Typography>
    ),
  },
  {
    id: "user",
    label: "User",
    width: "15%",
    format: (val) => (
      <Typography sx={{ fontSize: "0.85rem", color: UI.accent, fontWeight: 500 }}>
        {val}
      </Typography>
    ),
  },
  {
  id: "role",
  label: "Role",
  width: "10%",
  format: (val) => (
    <Typography
      sx={{
        fontSize: "0.75rem",
        fontWeight: 700,
        color: UI.textMuted,
        letterSpacing: 0.5,
      }}
    >
      {val}
    </Typography>
  ),
},
  {
    id: "ip",
    label: "IP Address",
    width: "12%",
    format: (val) => (
      <Typography sx={{ fontSize: "0.82rem", color: UI.textMuted, fontFamily: "monospace" }}>
        {val}
      </Typography>
    ),
  },
  ];

  const exportCSV = () => {
    const headers = ["Timestamp", "Category", "Action", "User", "IP"].join(",");
    const rows = filteredLogs.map(l => 
        [l.rawTimestamp, l.category, l.action, l.user, l.ip]
        .map(v => `"${v}"`).join(",")
    ).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security_audit_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <PageIntro 
        title="Audit Logs" 
        subtitle="Append-only audit records protected by role-based database permissions"
      />

      <DataSection
        title=""
        action={
          

          <Stack direction="row" spacing={1.5}>
            <AppButton variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
              Refresh
            </AppButton>
            <AppButton startIcon={<ExportIcon />} onClick={exportCSV}>
              Export Audit
            </AppButton>
          </Stack>
        }
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search by user, IP, or action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchOutlined sx={{ fontSize: 18, color: UI.textMuted, mr: 1 }} />
            }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
              <MenuItem value="All Categories">All Categories</MenuItem>
              <MenuItem value="AUTHENTICATION">Authentication</MenuItem>
              <MenuItem value="ACTIVITY">Activity</MenuItem>
              <MenuItem value="SYSTEM">System</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {filteredLogs.length === 0 ? (
          <Box sx={{ py: 10, textAlign: "center", border: `1px dashed ${UI.textMuted}`, borderRadius: 2 }}>
            <Typography sx={{ color: UI.textMuted }}>No security logs found.</Typography>
          </Box>
        ) : (
          <TableTemplate columns={securityColumns} rows={filteredLogs} />
        )}

      </DataSection>
    </Box>
  );
};

export default SecurityPage;