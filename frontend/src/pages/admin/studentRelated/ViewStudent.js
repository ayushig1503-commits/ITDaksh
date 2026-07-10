import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Typography,
  Stack,
  TextField,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Grid,
  MenuItem,
  Tooltip,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { deleteUser, getUserDetails, updateUser } from "../../../redux/userRelated/userHandle";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { removeStuff } from "../../../redux/studentRelated/studentHandle";

import {
  calculateAttendancePercentage,
  getAttendanceSummary,
  getMonthlyAttendance,
} from "../../../components/attendanceCalculator";

import CustomBarChart from "../../../components/CustomBarChart";
import Popup from "../../../components/Popup";
import AppButton from "../../../components/ui/AppButton";
import PageIntro from "../../../components/ui/PageIntro";
import DataSection from "../../../components/ui/DataSection";
import PageLoader from "../../../components/ui/PageLoader";
import ConfirmDeleteDialog from "../../../components/ui/ConfirmDeleteDialog";
import InfoPanel from "../../../components/ui/InfoPanel";
import TableTemplate from "../../../components/TableTemplate";

import { UI } from "../../../theme/constants";

/* ─────────────────────────────
    CONSTANTS
───────────────────────────── */
const labelStyle = {
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  color: UI.textMuted,
  mb: 0.5,
  textTransform: "uppercase",
};

const valueStyle = {
  fontSize: "0.925rem",
  fontWeight: 500,
  color: UI.textPrimary,
};

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const CATEGORY_OPTIONS = ["General", "OBC", "SC", "ST", "EWS", "Other"];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

/* ─────────────────────────────
    HELPERS
───────────────────────────── */
const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d) ? "—" : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const toInputDate = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d)) return "";
  return d.toISOString().split("T")[0];
};

/* ─────────────────────────────
    SUB-COMPONENTS
───────────────────────────── */

/** A single labeled field — static or editable */
const Field = ({ label, value, editing, children }) => (
  <Box>
    <Typography sx={labelStyle}>{label}</Typography>
    {editing && children ? (
      children
    ) : (
      <Typography sx={valueStyle}>{value || "—"}</Typography>
    )}
  </Box>
);

/* ─────────────────────────────
    MAIN COMPONENT
───────────────────────────── */
const ViewStudent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: studentID } = useParams();
  const address = "Student";

  const { userDetails, loading, currentUser } = useSelector((state) => state.user);

  /* ── UI State ── */
  const [tab, setTab] = useState("details");
  const [attendanceView, setAttendanceView] = useState("table");
  const [marksView, setMarksView] = useState("table");
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "" });

  /* ── Form State ── */
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [address2, setAddress2] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [fatherPhone, setFatherPhone] = useState("");
  const [motherName, setMotherName] = useState("");
  const [motherPhone, setMotherPhone] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianRelation, setGuardianRelation] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");

  /* ─────────────────────────────
      FETCH
  ───────────────────────────── */
  useEffect(() => {
    dispatch(getUserDetails(studentID, address));
  }, [dispatch, studentID]);

  useEffect(() => {
    if (userDetails?.sclassName?._id) {
      dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
    }
  }, [dispatch, userDetails]);

  /* ── Seed form from userDetails ── */
  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || "");
      setPassword("");
      setDob(toInputDate(userDetails.dob));
      setGender(userDetails.gender || "");
      setCategory(userDetails.category || "");
      setBloodGroup(userDetails.bloodGroup || "");
      setAdmissionDate(toInputDate(userDetails.admissionDate));
      setAddress2(userDetails.address || "");
      setFatherName(userDetails.fatherName || "");
      setFatherPhone(userDetails.fatherPhone || "");
      setMotherName(userDetails.motherName || "");
      setMotherPhone(userDetails.motherPhone || "");
      setGuardianName(userDetails.guardianName || "");
      setGuardianRelation(userDetails.guardianRelation || "");
      setGuardianPhone(userDetails.guardianPhone || "");
      setMedicalHistory(userDetails.medicalHistory || "");
    }
  }, [userDetails]);

  /* ─────────────────────────────
      DATA PROCESSING
  ───────────────────────────── */
  const attendance = useMemo(() => userDetails?.attendance || [], [userDetails?.attendance]);
  const attendanceSummary = useMemo(() => getAttendanceSummary(attendance), [attendance]);
  const attendanceChartData = useMemo(() => getMonthlyAttendance(attendance), [attendance]);
  const overallAttendance = calculateAttendancePercentage(attendance);

  const attendanceRows = useMemo(() => {
  return attendanceSummary.records.map((item, index) => {
    const dateObj = new Date(item.date);
    return {
      id: index + 1,
      date: item.date,
      status: item.status,
      // We store month name here if you ever want to group/filter in the table
      month: dateObj.toLocaleDateString("en-GB", { month: "long" }),
      weekday: dateObj.toLocaleDateString("en-GB", { weekday: "long" }),
    };
  });
}, [attendanceSummary.records]);

  const attendanceColumns = [
    {
      id: "date",
      label: "Date",
      width: "65%",
      format: (val) => {
        const date = new Date(val);
        return (
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: UI.textPrimary }}>
            {date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            <Box component="span" sx={{ ml: 1, color: UI.textSecondary, fontWeight: 500, fontSize: "0.82rem" }}>
              • {date.toLocaleDateString("en-GB", { weekday: "long" })}
            </Box>
          </Typography>
        );
      },
    },
    {
      id: "status",
      label: "Attendance",
      width: "35%",
      format: (val) => (
        <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: val === "Present" ? "#556B2F" : "#CD5C5C" }}>
          {val}
        </Typography>
      ),
    },
  ];

  const marksRows = useMemo(() => {
    if (!userDetails?.examResult) return [];
    return userDetails.examResult.flatMap((subjectEntry) =>
      subjectEntry.marks.map((mark) => {
        const percentage = Math.round((mark.marksObtained / mark.maxMarks) * 100);
        return {
          id: mark._id,
          subject: subjectEntry.subName?.subName || "—",
          term: `Term ${mark.term}`,
          examType: mark.examType || "Exam",
          marksObtained: mark.marksObtained,
          maxMarks: mark.maxMarks,
          percentage,
        };
      })
    );
  }, [userDetails?.examResult]);

  const marksColumns = [
    {
      id: "subject",
      label: "Subject",
      width: "24%",
      format: (val) => <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>{val}</Typography>,
    },
    {
      id: "term",
      label: "Term",
      width: "16%",
      format: (val) => <Typography sx={{ fontSize: "0.85rem", color: UI.textSecondary }}>{val}</Typography>,
    },
    {
      id: "examType",
      label: "Assessment",
      width: "22%",
      format: (val) => <Typography sx={{ fontSize: "0.85rem", color: UI.textSecondary }}>{val}</Typography>,
    },
    {
      id: "marksObtained",
      label: "Marks",
      width: "18%",
      format: (val, row) => (
        <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
          {val} / {row.maxMarks}
        </Typography>
      ),
    },
    {
      id: "percentage",
      label: "Score",
      width: "20%",
      format: (val) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: val >= 75 ? "success.main" : val >= 50 ? "warning.main" : "error.main",
          }}
        >
          {val}%
        </Typography>
      ),
    },
  ];

  const marksChart = useMemo(
    () => marksRows.map((row) => ({ subject: `${row.subject} • ${row.examType}`, percentage: row.percentage })),
    [marksRows]
  );

/* ─────────────────────────────
    EDITING SECTION LOGIC
───────────────────────────── */
const [editingSection, setEditingSection] = useState(null);

const toggleSectionEdit = (section) => {
  setEditingSection((prev) => {
    if (prev === section) return null;
    if (prev !== null) return prev;
    return section;
  });
};

  /* ─────────────────────────────
      ACTIONS
  ───────────────────────────── */
  const handlePopup = (message) => setPopup({ show: true, message });

  const handleDeleteStudent = async () => {
    try {
      await dispatch(deleteUser(studentID, address));
      navigate(-1);
    } catch {
      handlePopup("Unable to delete student.");
    }
  };

const handleUpdateStudent = async () => {
  try {
    setSaving(true);
    const fields = {
      name,
      dob,
      gender,
      category,
      bloodGroup,
      admissionDate,
      address: address2,
      fatherName,
      fatherPhone,
      motherName,
      motherPhone,
      guardianName,
      guardianRelation,
      guardianPhone,
      medicalHistory,
      adminID: currentUser._id, 
      ...(password.trim() !== "" && { password }),
    };

    await dispatch(updateUser(fields, studentID, address));
    await dispatch(getUserDetails(studentID, address));

    handlePopup("Student updated successfully.");
    setEditingSection(null);
  } catch {
    handlePopup("Update failed.");
  } finally {
    setSaving(false);
  }
};

const handleCancelEdit = () => {
  if (userDetails) {
    setName(userDetails.name || "");
    setPassword("");
    setDob(toInputDate(userDetails.dob));
    setGender(userDetails.gender || "");
    setCategory(userDetails.category || "");
    setBloodGroup(userDetails.bloodGroup || "");
    setAdmissionDate(toInputDate(userDetails.admissionDate));
    setAddress2(userDetails.address || "");
    setFatherName(userDetails.fatherName || "");
    setFatherPhone(userDetails.fatherPhone || "");
    setMotherName(userDetails.motherName || "");
    setMotherPhone(userDetails.motherPhone || "");
    setGuardianName(userDetails.guardianName || "");
    setGuardianRelation(userDetails.guardianRelation || "");
    setGuardianPhone(userDetails.guardianPhone || "");
    setMedicalHistory(userDetails.medicalHistory || "");
  }
  setEditingSection(null);
};

  const removeAllAttendance = async () => {
    await dispatch(removeStuff(studentID, "RemoveStudentAtten"));
    dispatch(getUserDetails(studentID, address));
  };

  /* ─────────────────────────────
      CONDITIONAL RENDERING
  ───────────────────────────── */
  if (loading) return <PageLoader />;

  if (!userDetails || userDetails.message === "No student found") {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Student Not Found</Typography>
        <Typography color="textSecondary">The server could not find a student with ID: {studentID}</Typography>
        <AppButton onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </AppButton>
      </Box>
    );
  }


  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <PageIntro
        title={userDetails.name}
        subtitle={`Class ${userDetails?.sclassName?.sclassName || "—"} — Section ${userDetails?.sclassName?.sectionName || "—"}`}
      />

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Details" value="details" />
        <Tab label="Attendance" value="attendance" />
        <Tab label="Marks" value="marks" />
      </Tabs>


{tab === "details" && (
  <Stack spacing={2.5}>

    {/* PERSONAL INFORMATION */}
    <InfoPanel
      title="Personal Information"
      editable
      editing={editingSection === "personal"}
      onEditToggle={() => toggleSectionEdit("personal")}
      onSave={handleUpdateStudent}
      onCancel={handleCancelEdit}
      saving={saving}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Field label="Full Name" value={userDetails.name} editing={editingSection === "personal"}>
            <TextField size="small" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
        </Grid>

<Grid item xs={12} sm={6} md={4}>
          <Field label="Roll Number" value={userDetails.rollNum} />
        </Grid>

<Grid item xs={12} sm={6} md={4}>
           <Field label="Date of Birth" value={formatDate(userDetails.dob)} editing={editingSection === "personal"}>
             <TextField size="small" fullWidth type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
           </Field>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Field
            label="Gender"
            value={userDetails.gender}
            editing={editingSection === "personal"}
          >
            <TextField
              size="small"
              fullWidth
              select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              {GENDER_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Field>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Field
            label="Blood Group"
            value={userDetails.bloodGroup}
            editing={editingSection === "personal"}
          >
            <TextField
              size="small"
              fullWidth
              select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            >
              {BLOOD_GROUP_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Field>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Field
            label="Category"
            value={userDetails.category}
            editing={editingSection === "personal"}
          >
            <TextField
              size="small"
              fullWidth
              select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Field>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Field
            label="Admission Date"
            value={formatDate(userDetails.admissionDate)}
            editing={editingSection === "personal"}
          >
            <TextField
              size="small"
              fullWidth
              type="date"
              value={admissionDate}
              onChange={(e) => setAdmissionDate(e.target.value)}
            />
          </Field>
        </Grid>

        {editingSection === "personal" && (
          <Grid item xs={12} sm={6} md={4}>
            <Field
              label="New Password"
              value=""
              editing
            >
              <TextField
                size="small"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Leave blank to keep existing password"
              />
            </Field>
          </Grid>
        )}

      </Grid>
    </InfoPanel>

{/* ADDRESS */}
    <InfoPanel
      title="Address"
      editable
      editing={editingSection === "address"}
      onEditToggle={() => toggleSectionEdit("address")}
      onSave={handleUpdateStudent}
      onCancel={handleCancelEdit}
      saving={saving}
    >
      <Field label="Home Address" value={userDetails.address} editing={editingSection === "address"}>
        <TextField size="small" fullWidth multiline minRows={3} value={address2} onChange={(e) => setAddress2(e.target.value)} />
      </Field>
    </InfoPanel>

{/* PARENTS & GUARDIAN */}
    <InfoPanel
      title="Parents & Guardian"
      editable
      editing={editingSection === "guardian"}
      onEditToggle={() => toggleSectionEdit("guardian")}
      onSave={handleUpdateStudent}
      onCancel={handleCancelEdit}
      saving={saving}
    >
      <Grid container spacing={3}>

        {/* Father */}
<Grid item xs={12} sm={6} md={4}>
           <Field label="Father's Name" value={userDetails.fatherName} editing={editingSection === "guardian"}>
             <TextField size="small" fullWidth value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
           </Field>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Field
            label="Father's Phone"
            value={userDetails.fatherPhone}
            editing={editingSection === "guardian"}
          >
            <TextField
              size="small"
              fullWidth
              value={fatherPhone}
              onChange={(e) => setFatherPhone(e.target.value)}
            />
          </Field>
        </Grid>

        {/* Mother */}
        <Grid item xs={12} sm={6} md={4}>
          <Field
            label="Mother's Name"
            value={userDetails.motherName}
            editing={editingSection === "guardian"}
          >
            <TextField
              size="small"
              fullWidth
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
            />
          </Field>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Field
            label="Mother's Phone"
            value={userDetails.motherPhone}
            editing={editingSection === "guardian"}
          >
            <TextField
              size="small"
              fullWidth
              value={motherPhone}
              onChange={(e) => setMotherPhone(e.target.value)}
            />
          </Field>
        </Grid>

        {/* Guardian Section */}
        <Grid item xs={12}>
          <Box
            sx={{
              borderTop: `1px solid ${UI.border}`,
              pt: 3,
              mt: 0.5,
            }}
          >
            <Typography
              sx={{
                mb: 2.5,
                fontSize: "0.95rem",
                fontWeight: 600,
                color: UI.textSecondary,
              }}
            >
              Guardian Information
            </Typography>

            <Grid container spacing={3}>

              <Grid item xs={12} sm={6} md={4}>
                <Field
                  label="Guardian's Name"
                  value={userDetails.guardianName}
                  editing={editingSection === "guardian"}
                >
                  <TextField
                    size="small"
                    fullWidth
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                  />
                </Field>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Field
                  label="Relation to Student"
                  value={userDetails.guardianRelation}
                  editing={editingSection === "guardian"}
                >
                  <TextField
                    size="small"
                    fullWidth
                    value={guardianRelation}
                    onChange={(e) => setGuardianRelation(e.target.value)}
                  />
                </Field>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Field
                  label="Guardian's Phone"
                  value={userDetails.guardianPhone}
                  editing={editingSection === "guardian"}
                >
                  <TextField
                    size="small"
                    fullWidth
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                  />
                </Field>
              </Grid>

            </Grid>
          </Box>
        </Grid>

      </Grid>
    </InfoPanel>

{/* MEDICAL */}
    <InfoPanel
      title="Medical"
      editable
      editing={editingSection === "medical"}
      onEditToggle={() => toggleSectionEdit("medical")}
      onSave={handleUpdateStudent}
      onCancel={handleCancelEdit}
      saving={saving}
    >
      <Field label="Medical History / Notes" value={userDetails.medicalHistory} editing={editingSection === "medical"}>
        <TextField size="small" fullWidth multiline minRows={3} value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} />
      </Field>
    </InfoPanel>

    <Box
  sx={{
    mt: 1,
    pt: 3,
    borderTop: `1px solid ${UI.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <Box>
    <Typography
      sx={{
        fontSize: "0.9rem",
        fontWeight: 600,
        color: "error.main",
        mb: 0.5,
      }}
    >
      Delete Student
    </Typography>

    <Typography
      sx={{
        fontSize: "0.8rem",
        color: UI.textMuted,
      }}
    >
      Permanently remove this student and associated records.
    </Typography>
  </Box>

  <AppButton
    variant="outlined"
    onClick={() => setDeleteDialog(true)}
    sx={{
      borderColor: "error.main",
      color: "error.main",
      "&:hover": {
        borderColor: "error.main",
        backgroundColor: "rgba(211, 47, 47, 0.04)",
      },
    }}
  >
    Delete Student
  </AppButton>
</Box>

  </Stack>
)}

      {/* ══════════════════════════════
          ATTENDANCE TAB
      ══════════════════════════════ */}
      {tab === "attendance" && (
        <DataSection
          title="Attendance"
          action={
            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton onClick={() => setAttendanceView("table")} sx={{ color: attendanceView === "table" ? UI.accent : UI.textMuted }}>
                <TableRowsRoundedIcon />
              </IconButton>
              <IconButton onClick={() => setAttendanceView("chart")} sx={{ color: attendanceView === "chart" ? UI.accent : UI.textMuted }}>
                <BarChartRoundedIcon />
              </IconButton>
              <AppButton onClick={() => navigate(`/Admin/students/student/attendance/${studentID}`)}>
                Add Attendance
              </AppButton>
            </Stack>
          }
          isEmpty={attendance.length === 0}
          emptyText="No attendance records available."
        >
          {attendance.length > 0 && (
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              sx={{ mb: 4, p: 2, bgcolor: UI.background, borderRadius: "16px" }}
            >
              <Box>
                <Typography sx={labelStyle}>PRESENT / TOTAL</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
                  {attendanceSummary.present} / {attendanceSummary.total}
                </Typography>
              </Box>
              <Box>
                <Typography sx={labelStyle}>ABSENT DAYS</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "error.main" }}>
                  {attendanceSummary.absent}
                </Typography>
              </Box>
              <Box>
                <Typography sx={labelStyle}>OVERALL ATTENDANCE</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: UI.accent }}>
                  {overallAttendance}%
                </Typography>
              </Box>
            </Stack>
          )}

          {attendanceView === "table" ? (
            <>
              <TableTemplate columns={attendanceColumns} rows={attendanceRows} />
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Typography
                  onClick={removeAllAttendance}
                  sx={{ fontSize: "0.875rem", fontWeight: 600, color: "error.main", cursor: "pointer", "&:hover": { opacity: 0.8 } }}
                >
                  Delete All Records
                </Typography>
              </Stack>
            </>
          ) : (
            <CustomBarChart chartData={attendanceChartData} type="attendance" />
          )}
        </DataSection>
      )}

      {/* ══════════════════════════════
          MARKS TAB
      ══════════════════════════════ */}
      {tab === "marks" && (
        <DataSection
          title="Exam Results"
          action={
            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton onClick={() => setMarksView("table")} sx={{ color: marksView === "table" ? UI.accent : UI.textMuted }}>
                <TableRowsRoundedIcon />
              </IconButton>
              <IconButton onClick={() => setMarksView("chart")} sx={{ color: marksView === "chart" ? UI.accent : UI.textMuted }}>
                <BarChartRoundedIcon />
              </IconButton>
              <AppButton onClick={() => navigate(`/Admin/students/student/marks/${studentID}`)}>
                Add Marks
              </AppButton>
            </Stack>
          }
          isEmpty={marksRows.length === 0}
          emptyText="No marks records available."
        >
          {marksView === "table" ? (
            <TableTemplate columns={marksColumns} rows={marksRows} />
          ) : (
            <CustomBarChart chartData={marksChart} dataKey="percentage" />
          )}
        </DataSection>
      )}

      <ConfirmDeleteDialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDeleteStudent}
        title="Delete Student"
        description={`You are deleting ${userDetails.name}`}
        confirmText={`DELETE ${userDetails.name}`}
        consequences={["Student records may be permanently removed", "This action cannot be undone"]}
      />

      <Popup
        message={popup.message}
        showPopup={popup.show}
        setShowPopup={(val) => setPopup((p) => ({ ...p, show: val }))}
      />
    </Box>
  );
};

export default ViewStudent;