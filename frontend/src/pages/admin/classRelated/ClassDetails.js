import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Typography,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";

// Icons & Components
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

import {
  getSubjectList,
  getAllSclasses,
  getAllClassGroups,
  deleteSubject
} from "../../../redux/sclassRelated/sclassHandle";

import AppButton from "../../../components/ui/AppButton";
import TableTemplate from "../../../components/TableTemplate";
import DetailSplitLayout from "../../../components/layout/DetailSplitLayout";
import PageIntro from "../../../components/ui/PageIntro";
import DataSection from "../../../components/ui/DataSection";
import PageLoader from "../../../components/ui/PageLoader";

import { UI } from "../../../theme/constants";

/* ─────────────────────────────────────────────
   SECTION TABLE COLUMNS (Keep as is)
───────────────────────────────────────────── */
const sectionColumns = [
  {
    id: "sectionName",
    label: "Section",
    width: "15%",
    align: "left",
    format: (val) => (
      <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
        Section {val}
      </Typography>
    )
  },
  {
    id: "teacher",
    label: "Class Teacher",
    width: "30%",
    align: "left",
    format: (val) => (
      <Typography sx={{ fontSize: "0.875rem", color: val ? "text.primary" : UI.textMuted }}>
        {val || "Not assigned"}
      </Typography>
    )
  },
{
  id: "studentCount",
  label: "Capacity",
  width: "20%",
  align: "left",
  format: (val, row) => (
    <Typography
      sx={{
        fontWeight: 500,
        fontSize: "0.85rem",
        color: val >= (row.capacity ?? 40) ? "error.main" : "text.secondary"
      }}
    >
      {val ?? 0}/{row.capacity ?? 40}
    </Typography>
  )
},
{
  id: "presentToday",
  label: "Present Today",
  width: "15%",
  align: "left",
  format: (val) => (
    <Typography
      sx={{
        fontWeight: 600,
        fontSize: "0.85rem",
        color: UI.textSecondary
      }}
    >
      {val ?? 0}
    </Typography>
  )
},
{
  id: "attendanceYTD",
  label: "Attendance (YTD)",
  width: "20%",
  align: "left",
  format: (val) => (
    <Typography
      sx={{
        fontWeight: 500,
        fontSize: "0.85rem",
        color: UI.textSecondary
      }}
    >
      {val != null ? `${val}%` : "—"}
    </Typography>
  )
},
  {
    id: "arrow",
    label: "",
    width: "0%",
    align: "right",
    format: () => <ArrowForwardIosRoundedIcon sx={{ fontSize: 12, color: UI.borderStrong }} />
  },
];

/* ─────────────────────────────────────────────
   ACTION BUTTONS
───────────────────────────────────────────── */
const SectionActionButton = ({ navigate, rawName }) => (
  <AppButton
    startIcon={<AddIcon />}
    onClick={() =>
      navigate("/Admin/addclass", {
        state: { mode: "add-section", className: rawName, from: "details" }
      })
    }
  >
    Add Section
  </AppButton>
);

const SubjectActionButton = ({ navigate, classGroupId }) => (
  <AppButton
    startIcon={<AddIcon />}
    onClick={() => navigate(`/Admin/addsubject/${classGroupId}`)}
  >
    Add Subject
  </AppButton>
);

/* ─────────────────────────────────────────────
   SUBJECT ROW
───────────────────────────────────────────── */
const SubjectRow = ({ subject, onDelete }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 2,
        "&:hover .delete-btn": { opacity: 1 }
      }}
    >
      <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
        {subject.subName}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", position: "relative", pr: 4 }}>
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: UI.textMuted,
            bgcolor: UI.background,
            px: 1,
            borderRadius: 1
          }}
        >
          {subject.subCode || "—"}
        </Typography>

        <IconButton
          className="delete-btn"
          size="small"
          onClick={() => onDelete(subject._id)}
          sx={{
            position: "absolute",
            right: 0,
            opacity: 0,
            transition: "opacity 0.15s",
            color: "error.main",
            p: 0.5,
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const ClassDetails = () => {
  const { classGroupId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    subjectsList = [],
    sclassesList = [],
    loading
  } = useSelector((state) => state.sclass);

  const { currentUser } = useSelector((state) => state.user);

  // FIX 1: Updated useEffect (Removed length checks to ensure data loads on refresh)
useEffect(() => {
    // Only dispatch if we actually have the ID and the User
    if (classGroupId && currentUser?._id) {
        dispatch(getSubjectList(classGroupId, "ClassSubjects"));
        dispatch(getAllSclasses(currentUser._id, "Sclass"));
        dispatch(getAllClassGroups(currentUser._id));
    }
}, [dispatch, classGroupId, currentUser?._id]);

// Add a secondary loading check for the DataSection
const isDataLoading = loading || !currentUser?._id;

  // FIX 2: Filter subjects by the current class ID
  const filteredSubjects = useMemo(() => {
    return subjectsList.filter(
      (sub) => sub.classGroup?._id === classGroupId || sub.classGroup === classGroupId
    );
  }, [subjectsList, classGroupId]);

  const {
    sections,
    totalStudents,
    className,
    rawName
  } = useMemo(() => {
    const filtered = sclassesList?.filter(
      (s) => s.classGroup?._id === classGroupId || s.classGroup === classGroupId
    ) || [];

    const raw = filtered[0]?.sclassName || filteredSubjects[0]?.sclassName || "";

    return {
      sections: filtered,
      totalStudents: filtered.reduce((sum, s) => sum + (s.studentCount || 0), 0),
      rawName: raw,
      className: raw ? `Class ${raw}` : "Class Details",
    };
  }, [sclassesList, classGroupId, filteredSubjects]);

  if (loading) return <PageLoader />;

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <PageIntro
        title={className}
        subtitle={`${sections.length} Sections • ${totalStudents} Students`}
      />

      <DetailSplitLayout
        /* ── LEFT PANEL (Sections) ── */
        left={
          <DataSection
            title="Sections"
            action={<SectionActionButton navigate={navigate} rawName={rawName} />}
          >
            <TableTemplate
              columns={sectionColumns}
              rows={sections}
              disablePaper={false}
              onRowClick={(row) => navigate(`/Admin/classes/section/${row._id}`)}
            />
          </DataSection>
        }

        /* ── RIGHT PANEL (Subjects) ── */
        right={
<DataSection
    title="Subjects"
    // This is the key: Don't show "Empty" if we are still loading
    isEmpty={!isDataLoading && filteredSubjects.length === 0}
    emptyText="No subjects added yet."
    action={
        <SubjectActionButton
            navigate={navigate}
            classGroupId={classGroupId}
        />
    }
>
    {isDataLoading ? (
        <Typography>Loading subjects...</Typography>
    ) : (
        <Stack divider={<Divider sx={{ opacity: 0.6 }} />} spacing={0}>
            {filteredSubjects.map((sub) => (
                <SubjectRow
                    key={sub._id}
                    subject={sub}
                    onDelete={(id) => dispatch(deleteSubject(id))}
                />
            ))}
        </Stack>
    )}
</DataSection>
        }
      />
    </Box>
  );
};

export default ClassDetails;