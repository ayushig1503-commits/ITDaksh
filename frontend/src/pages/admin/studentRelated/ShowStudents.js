import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  TextField,
  Select,
  InputLabel,
  FormControl,
  Stack,
} from '@mui/material';

import {
  VisibilityOutlined,
  MoreHoriz,
  SearchOutlined,
  Add as AddIcon
} from '@mui/icons-material';

import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';

import TableTemplate from '../../../components/TableTemplate';
import Popup from '../../../components/Popup';
import AppButton from '../../../components/ui/AppButton';
import PageIntro from '../../../components/ui/PageIntro';
import DataSection from '../../../components/ui/DataSection';
import PageLoader from '../../../components/ui/PageLoader';

import { UI } from "../../../theme/constants";

const ShowStudents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { studentsList = [], loading } = useSelector((state) => state.student);
  const { currentUser } = useSelector((state) => state.user);
  const { sclassesList = [] } = useSelector((state) => state.sclass);

  const [showPopup, setShowPopup] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [message] = useState("");

  /* ───────────────── FETCH ───────────────── */
  useEffect(() => {
    if (!currentUser?._id) return;
    dispatch(getAllStudents(currentUser._id));
    dispatch(getAllSclasses(currentUser._id, "Sclass"));
  }, [currentUser?._id, dispatch]);

/* ───────────────── FILTERED ROWS ───────────────── */
  const studentRows = useMemo(() => {
    return studentsList
      .filter((student) => {
        const matchesSearch = student.name?.toLowerCase().includes(search.toLowerCase());
        
        const matchesClass = !selectedClass || 
          student.sclassName?.sclassName === selectedClass;

        const matchesSection = !selectedSection || 
          student.sclassName?.sectionName === selectedSection;

        return matchesSearch && matchesClass && matchesSection;
      })
      .map((student) => {
        const attendanceArray = student.attendance || [];
        const presentCount = attendanceArray.filter(
          (a) => a.status?.toLowerCase() === "present"
        ).length;
        
        const ytd = attendanceArray.length > 0 
          ? ((presentCount / attendanceArray.length) * 100).toFixed(1) 
          : "0";

        return {
          id: student._id,
          name: student.name || "Unknown Name",
          rollNum: student.rollNum || "—",
          sclassName: student.sclassName?.sclassName || "—",
          sectionName: student.sclassName?.sectionName || "—",
          contacts: {
            fatherPhone: student.fatherPhone,
            motherPhone: student.motherPhone,
          },
          attendance: ytd, 
        };
      });
  }, [studentsList, search, selectedClass, selectedSection]);

  const sectionOptions = useMemo(() => {
    const unique = new Set();
    sclassesList.forEach((cls) => {
      if (cls.sectionName) unique.add(String(cls.sectionName));
    });
    return Array.from(unique).sort();
  }, [sclassesList]);

  /* ───────────────── CLASS OPTIONS ───────────────── */
  const classOptions = useMemo(() => {
    const unique = new Set();
    sclassesList.forEach((cls) => {
      if (cls.sclassName) unique.add(String(cls.sclassName));
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [sclassesList]);

  /* ───────────────── TABLE COLUMNS ───────────────── */
const studentColumns = [
    {
      id: 'name',
      label: 'Student',
      width: "22%",
      format: (val) => (
        <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>{val}</Typography>
      )
    },
    {
      id: 'rollNum',
      label: 'Roll No.',
      width: "10%",
      format: (val) => (
        <Typography sx={{ fontSize: "0.85rem", color: UI.textSecondary }}>{val}</Typography>
      )
    },
    {
      id: 'sclassName',
      label: 'Class',
      width: "10%",
      format: (val) => (
        <Typography sx={{ fontSize: "0.85rem", color: UI.textSecondary }}>{val}</Typography>
      )
    },
    {
      id: 'sectionName',
      label: 'Section',
      width: "10%",
      format: (val) => (
        <Typography sx={{ fontSize: "0.85rem", color: UI.textSecondary }}>{val}</Typography>
      )
    },
    {
      id: 'contacts',
      label: 'Parent Contacts',
      width: "33%",
      format: (val) => (
        <Stack direction="row" spacing={2}>
          {val?.fatherPhone && (
            <Typography component="a" href={`tel:${val.fatherPhone}`} onClick={(e) => e.stopPropagation()}
              sx={{ fontSize: "0.8rem", color: UI.accent, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              F: {val.fatherPhone}
            </Typography>
          )}
          {val?.motherPhone && (
            <Typography component="a" href={`tel:${val.motherPhone}`} onClick={(e) => e.stopPropagation()}
              sx={{ fontSize: "0.8rem", color: UI.accent, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              M: {val.motherPhone}
            </Typography>
          )}
        </Stack>
      )
    },
    {
      id: 'attendance',
      label: 'Attendance',
      width: "15%",
      format: (val) => {
        const percentage = parseFloat(val);
        const color = percentage >= 90 ? "#556B2F" : percentage >= 75 ? "#DAA520" : "#CD5C5C";
        return (
          <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color }}>
            {isNaN(percentage) ? "—" : `${percentage}%`}
          </Typography>
        );
      }
    },
  ];

  /* ───────────────── ROW ACTIONS ───────────────── */
  const StudentActions = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    return (
      <>
        <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <MoreHoriz sx={{ fontSize: 20 }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate(`/Admin/students/student/${row.id}`);
            }}
          >
            <ListItemIcon>
              <VisibilityOutlined fontSize="small" />
            </ListItemIcon>
            View Profile
          </MenuItem>
        </Menu>
      </>
    );
  };

  if (loading) return <PageLoader />;

return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <PageIntro title="Students" subtitle={`${studentRows.length} Registered Students`} />

      {/* 1. REMOVED isEmpty and emptyText from DataSection so it stays visible */}
<DataSection>
        {/* 2. FILTERS - These will now always stay on screen */}
<Stack
  direction={{ xs: "column", sm: "row" }}
  spacing={2}
  sx={{ mb: 3 }}
  alignItems="center"
>
          <TextField
            size="small"
            placeholder="Search name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <SearchOutlined sx={{ fontSize: 18, color: UI.textMuted, mr: 1 }} />
            }}
          />

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={selectedClass}
              label="Class"
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <MenuItem value="">All Classes</MenuItem>
              {classOptions.map((cls) => (
                <MenuItem key={cls} value={cls}>Class {cls}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Section</InputLabel>
            <Select
              value={selectedSection}
              label="Section"
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <MenuItem value="">All Sections</MenuItem>
              {sectionOptions.map((sec) => (
                <MenuItem key={sec} value={sec}>Section {sec}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <AppButton
  startIcon={<AddIcon />}
  onClick={() => navigate("/Admin/addstudents")}
  sx={{
    minWidth: "fit-content",
    height: 40,
    px: 2.5,
  }}
>
  Add Student
</AppButton>
        </Stack>

        {/* 3. CONDITIONAL RENDER - Only the Table or the Message toggles */}
        {studentRows.length === 0 ? (
          <Box sx={{ py: 8, textAlign: "center", border: `1px dashed ${UI.textMuted}`, borderRadius: 2 }}>
            <Typography sx={{ color: UI.textMuted, fontSize: "0.95rem", fontWeight: 500 }}>
              No students found matching your filters.
            </Typography>
          </Box>
        ) : (
          <TableTemplate
            columns={studentColumns}
            rows={studentRows}
            buttonHaver={StudentActions}
            onRowClick={(row) => navigate(`/Admin/students/student/${row.id}`)}
          />
        )}
      </DataSection>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  );
};

export default ShowStudents;