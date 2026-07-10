import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { getTeacherFreeClassSubjects } from "../../../redux/sclassRelated/sclassHandle";
import { updateTeachSubject } from "../../../redux/teacherRelated/teacherHandle";

import TableTemplate from "../../../components/TableTemplate";

import AppButton from "../../../components/ui/AppButton";
import PageIntro from "../../../components/ui/PageIntro";
import DataSection from "../../../components/ui/DataSection";
import PageLoader from "../../../components/ui/PageLoader";

import { UI } from "../../../theme/constants";

const ChooseSubject = ({ situation }) => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

const [sectionID, setSectionID] = useState("");
  const [teacherID, setTeacherID] = useState("");
  const [loader, setLoader] = useState(false);

  const {
    subjectsList,
    loading,
    error,
    response
  } = useSelector((state) => state.sclass);

useEffect(() => {
  if (situation === "Norm") {
    const currentSectionID = params.sectionID || params.id;

    setSectionID(currentSectionID);

    dispatch(getTeacherFreeClassSubjects(currentSectionID));
  } else if (situation === "Teacher") {
    const { sectionID, teacherID } = params;

    setSectionID(sectionID);
    setTeacherID(teacherID);

    dispatch(getTeacherFreeClassSubjects(sectionID));
  }
}, [dispatch, params, situation]);

  const updateSubjectHandler = async (teacherId, teachSubject) => {
    try {
      setLoader(true);

      await dispatch(updateTeachSubject(teacherId, teachSubject));

      navigate("/Admin/teachers");
    } finally {
      setLoader(false);
    }
  };

  const rows = useMemo(() => {
    if (!Array.isArray(subjectsList)) return [];

    return subjectsList.map((subject, index) => ({
      id: subject._id,
      serial: index + 1,
      subjectName: subject.subName,
      subjectCode: subject.subCode,
    }));
  }, [subjectsList]);

  const columns = [
    {
      id: "serial",
      label: "#",
      width: "10%",
      align: "left",
      format: (val) => (
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "0.85rem",
            color: UI.textMuted,
          }}
        >
          {val}
        </Typography>
      ),
    },
    {
      id: "subjectName",
      label: "Subject",
      width: "40%",
      align: "left",
      format: (val) => (
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "0.92rem",
            color: UI.textPrimary,
          }}
        >
          {val}
        </Typography>
      ),
    },
    {
      id: "subjectCode",
      label: "Code",
      width: "20%",
      align: "left",
      format: (val) => (
        <Typography
          sx={{
            fontSize: "0.85rem",
            color: UI.textSecondary,
          }}
        >
          {val}
        </Typography>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      width: "30%",
      align: "left",
      format: (_, row) => (
        <AppButton
          disabled={loader}
          onClick={() =>
            situation === "Norm"
              ? navigate(`/Admin/teachers/addteacher/${row.id}`)
              : updateSubjectHandler(teacherID, row.id)
          }
        >
          {loader && situation === "Teacher" ? (
            <CircularProgress size={20} color="inherit" />
          ) : situation === "Norm" ? (
            "Choose"
          ) : (
            "Assign Subject"
          )}
        </AppButton>
      ),
    },
  ];

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography color="error">
          Error loading subjects.
        </Typography>
      </Box>
    );
  }

  if (response) {
    return (
      <Box sx={{ width: "100%" }}>
        <PageIntro
          title="No Available Subjects"
          subtitle="All subjects already have assigned teachers"
        />

        <DataSection>
          <Stack
            spacing={3}
            alignItems="flex-start"
          >
            <Typography
              sx={{
                fontSize: "0.95rem",
                color: UI.textSecondary,
              }}
            >
              Every subject in this class already has a teacher assigned.
            </Typography>

            <AppButton
              onClick={() => navigate(`/Admin/addsubject/${sectionID}`)}
            >
              Add Subject
            </AppButton>
          </Stack>
        </DataSection>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <PageIntro
        title="Choose Subject"
        subtitle={`${rows.length} Available Subjects`}
      />

      <Box sx={{ mt: 4 }}>
        <DataSection
          isEmpty={rows.length === 0}
          emptyText="No subjects available."
        >
          <TableTemplate
            columns={columns}
            rows={rows}
            disablePaper={false}
          />
        </DataSection>
      </Box>
    </Box>
  );
};

export default ChooseSubject;