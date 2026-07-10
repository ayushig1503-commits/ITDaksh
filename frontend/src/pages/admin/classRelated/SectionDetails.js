import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  Box,
  Typography,
  Stack,
  TextField,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchOutlined from "@mui/icons-material/SearchOutlined";

import {
  getClassDetails,
  getClassStudents
} from "../../../redux/sclassRelated/sclassHandle";

import {
  removeStuff
} from "../../../redux/studentRelated/studentHandle";

import TableTemplate from "../../../components/TableTemplate";

import Popup from "../../../components/Popup";

import AppButton from "../../../components/ui/AppButton";
import PageIntro from "../../../components/ui/PageIntro";
import DataSection from "../../../components/ui/DataSection";
import PageLoader from "../../../components/ui/PageLoader";
import ConfirmDeleteDialog from "../../../components/ui/ConfirmDeleteDialog";

import { UI } from "../../../theme/constants";


const studentColumns = [
  {
    id: "name",
    label: "Student",
    width: "30%",
    format: (val) => (
      <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
        {val}
      </Typography>
    )
  },
  {
    id: "rollNum",
    label: "Roll No.",
    width: "12%",
    format: (val) => (
      <Typography sx={{ fontSize: "0.85rem", color: UI.textSecondary }}>
        {val || "—"}
      </Typography>
    )
  },
  {
    id: "gender",
    label: "Gender",
    width: "10%",
    format: (val) => (
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: UI.textMuted }}>
        {val?.charAt(0).toUpperCase() || "—"}
      </Typography>
    )
  },
  {
    id: "contacts",
    label: "Parent Contacts",
    width: "35%",
    format: (val) => (
      <Stack direction="row" spacing={3}>
        {val?.fatherPhone && (
          <Typography
            component="a"
            href={`tel:${val.fatherPhone}`}
            onClick={(e) => e.stopPropagation()}
            sx={{ fontSize: "0.82rem", color: UI.accent, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            Father: {val.fatherPhone}
          </Typography>
        )}
        {val?.motherPhone && (
          <Typography
            component="a"
            href={`tel:${val.motherPhone}`}
            onClick={(e) => e.stopPropagation()}
            sx={{ fontSize: "0.82rem", color: UI.accent, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            Mother: {val.motherPhone}
          </Typography>
        )}
      </Stack>
    )
  },
  {
    id: "attendance",
    label: "Attendance (YTD)",
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

/* ─────────────────────────────────────────────
   ADD STUDENT BUTTON
───────────────────────────────────────────── */
const AddStudentButton = ({
  navigate,
  classID,
  sclassDetails
}) => (
  <AppButton
    startIcon={<AddIcon />}
    onClick={() =>
      navigate("/Admin/addstudents/class", {
        state: {
          sclassName:
            sclassDetails?.sclassName,

          sections: [
            {
              _id: classID,
              sectionName:
                sclassDetails?.sectionName
            }
          ]
        }
      })
    }
  >
    Add Student
  </AppButton>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const SectionDetails = () => {
  const { id: classID } =
    useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    sclassStudents = [],
    sclassDetails,
    loading
  } = useSelector(
    (state) => state.sclass
  );

  const [
    showPopup,
    setShowPopup
  ] = useState(false);

  const [
    message,
    setMessage
  ] = useState("");

  const [
    confirmOpen,
    setConfirmOpen
  ] = useState(false);

  const [
    search,
    setSearch
  ] = useState("");

  /* ───────────────── FETCH ───────────────── */
  useEffect(() => {
    dispatch(
      getClassDetails(
        classID,
        "Sclass"
      )
    );

    dispatch(
      getClassStudents(classID)
    );
  }, [dispatch, classID]);

  /* ───────────────── DELETE ───────────────── */
  const handleConfirmDelete =
    async () => {
      try {
        await dispatch(
          removeStuff(
            classID,
            "Sclass"
          )
        );

        navigate(
          "/Admin/classes"
        );

      } catch (err) {
        setMessage(
          "Delete failed"
        );

        setShowPopup(true);
      }
    };


/* ───────────────── FILTERED ROWS ───────────────── */
  const studentRows = useMemo(() => {
    return (
      sclassStudents
        ?.filter((student) =>
          student.name?.toLowerCase().includes(search.toLowerCase())
        )
        .map((student) => {
          // Calculate YTD Attendance
          const attendance = student.attendance || [];
          const presentCount = attendance.filter(a => a.status?.toLowerCase() === "present").length;
          const ytd = attendance.length > 0 
            ? ((presentCount / attendance.length) * 100).toFixed(1) 
            : "0";

          return {
            id: student._id,
            name: student.name || "Unknown",
            rollNum: student.rollNum || "—",
            gender: student.gender || "—",
            contacts: {
              fatherPhone: student.fatherPhone,
              motherPhone: student.motherPhone,
            },
            attendance: ytd,
          };
        }) || []
    );
  }, [sclassStudents, search]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        pb: 4
      }}
    >

      {/* ───────────────── PAGE INTRO ───────────────── */}
<PageIntro
  title={`Class ${sclassDetails?.sclassName} — Section ${sclassDetails?.sectionName}`}
  subtitle={`${studentRows.length} Students`}
/>

{/* ───────────────── CONTENT ───────────────── */}
<DataSection
  title="Students"
  action={
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
    >
      <Typography
        onClick={() =>
          setConfirmOpen(true)
        }
        sx={{
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "error.main",
          cursor: "pointer",

          "&:hover": {
            opacity: 0.8
          }
        }}
      >
        Delete Section
      </Typography>

      <AddStudentButton
        navigate={navigate}
        classID={classID}
        sclassDetails={sclassDetails}
      />
    </Stack>
  }

  /* Only empty if the actual section has no students */
  isEmpty={sclassStudents?.length === 0}

  emptyText="No students found in this section."
>

  {/* ───────────────── SEARCH ───────────────── */}
  <TextField
    size="small"

    placeholder="Search students..."

    value={search}

    onChange={(e) =>
      setSearch(e.target.value)
    }

    fullWidth

    sx={{ mb: 3 }}

    InputProps={{
      startAdornment: (
        <SearchOutlined
          sx={{
            fontSize: 18,
            color: UI.textMuted,
            mr: 1
          }}
        />
      )
    }}
  />

  {/* ───────────────── SEARCH RESULTS ───────────────── */}
  {studentRows.length === 0 ? (

    <Box
      sx={{
        py: 6,
        textAlign: "center"
      }}
    >
      <Typography
        sx={{
          color: UI.textMuted,
          fontSize: "0.95rem",
          fontWeight: 500
        }}
      >
        No matching students found.
      </Typography>
    </Box>

  ) : (

    /* ───────────────── TABLE ───────────────── */
    <TableTemplate
      columns={studentColumns}

      rows={studentRows}

      disablePaper={false}

      onRowClick={(row) =>
        navigate(
          `/Admin/students/student/${row.id}`
        )
      }
    />

  )}

</DataSection>

{/* ───────────────── DELETE DIALOG ───────────────── */}
<ConfirmDeleteDialog
  open={confirmOpen}

  onClose={() =>
    setConfirmOpen(false)
  }

  onConfirm={
    handleConfirmDelete
  }

  title="Delete Section"

  description={`You are deleting Section ${sclassDetails?.sectionName}`}

  confirmText={`DELETE ${sclassDetails?.sectionName}`}

  consequences={[
    `${sclassStudents?.length || 0} students will be removed`,
    "This action cannot be undone"
  ]}
/>

{/* ───────────────── POPUP ───────────────── */}
<Popup
  message={message}
  setShowPopup={setShowPopup}
  showPopup={showPopup}
/>
</Box>
  )
};

export default SectionDetails;