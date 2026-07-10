import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography
} from "@mui/material";

import {
  Add as AddIcon
} from "@mui/icons-material";

import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";

import TableTemplate from "../../../components/TableTemplate";
import Popup from "../../../components/Popup";

import AppButton from "../../../components/ui/AppButton";
import PageIntro from "../../../components/ui/PageIntro";
import DataSection from "../../../components/ui/DataSection";
import PageLoader from "../../../components/ui/PageLoader";

import DetailSplitLayout from "../../../components/layout/DetailSplitLayout";

import { UI } from "../../../theme/constants";

const ShowTeachers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    teachersList = [],
    loading,
    error,
    response
  } = useSelector((state) => state.teacher);

  const { currentUser } = useSelector((state) => state.user);

  const [showPopup, setShowPopup] = React.useState(false);
  const [message, setMessage] = React.useState("");

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getAllTeachers(currentUser._id));
    }
  }, [dispatch, currentUser?._id]);

  const deleteHandler = () => {
    setMessage("Sorry, the delete function has been disabled for now.");
    setShowPopup(true);
  };

const rows = useMemo(() => {
    if (!Array.isArray(teachersList)) return [];

    return teachersList.map((teacher) => {
        // DEBUG: See exactly what the backend is sending for each teacher
        console.log(`DEBUG [ShowTeachers]: Teacher ${teacher.name} assignments:`, teacher.assignments);

        // Get the primary assignment (the first one in the array)
        const primaryAssignment = teacher.assignments?.[0] || null;

        return {
            id: teacher._id,
            name: teacher.name,
            // Check the new array structure instead of the old field
            subject: primaryAssignment?.subject?.subName || null,
            className: primaryAssignment?.sclass?.sclassName || "—",
            sectionName: primaryAssignment?.sclass?.sectionName || "",
            sectionId: primaryAssignment?.sclass?._id,
            // Keep the count for the subtitle logic
            allAssignments: teacher.assignments || []
        };
    });
}, [teachersList]);

  const teachersWithoutSubjects = useMemo(() => {
    return rows.filter((teacher) => !teacher.subject).length;
  }, [rows]);

  const handleRowClick = (row) => {
    if (row?.id) {
      navigate(`/Admin/teachers/teacher/${row.id}`);
    }
  };

  const columns = [
    {
      id: "name",
      label: "Teacher",
      width: "35%",
      align: "left",
      format: (val) => (
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "0.9rem",
            color: UI.textPrimary
          }}
        >
          {val}
        </Typography>
      )
    },
    {
      id: "subject",
      label: "Subject",
      width: "35%",
      align: "left",
      format: (val, row) => {
        if (!val) {
          return (
            <AppButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();

navigate(
  `/Admin/teachers/choosesubject/${row.sectionId}/${row.id}`
);
              }}
            >
              Add Subject
            </AppButton>
          );
        }

        return (
          <Typography
            sx={{
              fontSize: "0.84rem",
              color: UI.textSecondary,
              fontWeight: 500
            }}
          >
            {val}
          </Typography>
        );
      }
    },
{
  id: "className",
  label: "Class",
  width: "20%",
  align: "left",
  format: (val, row) => {
    // If no class is assigned in the array, show a placeholder
    if (val === "—") return <Typography sx={{ color: UI.textMuted }}>No Class</Typography>;

    return (
      <Typography
        sx={{
          fontSize: "0.84rem",
          color: UI.textSecondary
        }}
      >
        {val}
        {row.sectionName ? ` — Section ${row.sectionName}` : ""}
      </Typography>
    );
  }
},
    {
      id: "actions",
      label: "Actions",
      width: "10%",
      align: "left",
      format: (_, row) => (
        <Box
          onClick={(event) => event.stopPropagation()}
        >
          <AppButton
            size="small"
            variant="ghost"
            onClick={() =>
              navigate(`/Admin/teachers/teacher/${row.id}`)
            }
          >
            View
          </AppButton>
        </Box>
      )
    }
  ];

  if (loading) return <PageLoader />;

  return (
    <>
      <Box sx={{ width: "100%", pb: 4 }}>
        <PageIntro
          title="Faculty Directory"
          subtitle={`${rows.length} Teachers • ${teachersWithoutSubjects} Without Subjects`}
        />

        <Box sx={{ mt: 4 }}>
          {error ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Typography color="error">
                Error loading teachers.
              </Typography>
            </Box>
          ) : (
            <DetailSplitLayout
              dividerColor="transparent"
              left={
                <Box sx={{ width: "100%", maxWidth: "900px" }}>
                  <DataSection
                    action={
                      <AppButton
                        startIcon={<AddIcon />}
                        onClick={() =>
                          navigate("/Admin/teachers/chooseclass")
                        }
                      >
                        Add Teacher
                      </AppButton>
                    }
                    isEmpty={rows.length === 0 || response}
                    emptyText="No teachers found."
                  >
                    <TableTemplate
                      columns={columns}
                      rows={rows}
                      onRowClick={handleRowClick}
                      disablePaper={false}
                    />
                  </DataSection>
                </Box>
              }
              right={null}
            />
          )}
        </Box>
      </Box>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default ShowTeachers;