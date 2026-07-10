import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Typography,
  Grid,
  Stack
} from "@mui/material";

import {
  getTeacherDetails
} from "../../../redux/teacherRelated/teacherHandle";

import AppButton from "../../../components/ui/AppButton";
import PageIntro from "../../../components/ui/PageIntro";
import InfoPanel from "../../../components/ui/InfoPanel";
import PageLoader from "../../../components/ui/PageLoader";

import { UI } from "../../../theme/constants";

/* ─────────────────────────────
    STYLES
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

/* ─────────────────────────────
    FIELD COMPONENT
───────────────────────────── */

const Field = ({ label, value }) => (
  <Box>
    <Typography sx={labelStyle}>
      {label}
    </Typography>

    <Typography sx={valueStyle}>
      {value || "—"}
    </Typography>
  </Box>
);

/* ─────────────────────────────
    MAIN COMPONENT
───────────────────────────── */

const TeacherDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id: teacherID } = useParams();

  const {
    loading,
    teacherDetails,
    error
  } = useSelector((state) => state.teacher);

  useEffect(() => {
    dispatch(getTeacherDetails(teacherID));
  }, [dispatch, teacherID]);

  const hasSubject = Boolean(
    teacherDetails?.teachSubject?.subName
  );

  const handleAddSubject = () => {
    navigate(
      `/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`
    );
  };

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">
          Failed to load teacher details.
        </Typography>

        <Typography
          sx={{
            mt: 1,
            color: UI.textSecondary
          }}
        >
          Please try again later.
        </Typography>

        <AppButton
          sx={{ mt: 3 }}
          onClick={() => navigate(-1)}
        >
          Go Back
        </AppButton>
      </Box>
    );
  }

  if (!teacherDetails) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">
          Teacher Not Found
        </Typography>

        <Typography
          sx={{
            mt: 1,
            color: UI.textSecondary
          }}
        >
          The requested teacher record does not exist.
        </Typography>

        <AppButton
          sx={{ mt: 3 }}
          onClick={() => navigate(-1)}
        >
          Go Back
        </AppButton>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <PageIntro
        title={teacherDetails.name}
        subtitle={
  teacherDetails?.teachSclass?.sclassName
    ? `Section ${teacherDetails.teachSclass.sclassName}`
    : "No section assigned"
}
      />

      <Stack spacing={2.5}>

        {/* BASIC INFORMATION */}
        <InfoPanel title="Teacher Information">
          <Grid container spacing={3}>

            <Grid item xs={12} sm={6} md={4}>
              <Field
                label="Full Name"
                value={teacherDetails.name}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
<Field
  label="Section"
  value={
    teacherDetails?.teachSclass?.sclassName || "—"
  }
/>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Field
                label="Role"
                value="Teacher"
              />
            </Grid>

          </Grid>
        </InfoPanel>

        {/* SUBJECT INFORMATION */}
        <InfoPanel
          title="Subject Assignment"
          action={
            !hasSubject && (
              <AppButton
                size="small"
                onClick={handleAddSubject}
              >
                Assign Subject
              </AppButton>
            )
          }
        >
          {hasSubject ? (
            <Grid container spacing={3}>

              <Grid item xs={12} sm={6} md={4}>
                <Field
                  label="Subject"
                  value={teacherDetails?.teachSubject?.subName}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Field
                  label="Weekly Sessions"
                  value={teacherDetails?.teachSubject?.sessions}
                />
              </Grid>

            </Grid>
          ) : (
            <Box>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  color: UI.textSecondary
                }}
              >
                No subject has been assigned yet.
              </Typography>
            </Box>
          )}
        </InfoPanel>

        {/* ACTIONS */}
        <Box
          sx={{
            mt: 1,
            pt: 3,
            borderTop: `1px solid ${UI.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: UI.textPrimary,
                mb: 0.5,
              }}
            >
              Teacher Management
            </Typography>

            <Typography
              sx={{
                fontSize: "0.8rem",
                color: UI.textMuted,
              }}
            >
              View and manage teacher assignment details.
            </Typography>
          </Box>

          <AppButton
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            Go Back
          </AppButton>
        </Box>

      </Stack>
    </Box>
  );
};

export default TeacherDetails;