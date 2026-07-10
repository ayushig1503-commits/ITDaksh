import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Typography
} from '@mui/material';

import {
  Add as AddIcon
} from '@mui/icons-material';

import {
  getAllSclasses,
  getAllClassGroups
} from '../../../redux/sclassRelated/sclassHandle';

import TableTemplate from '../../../components/TableTemplate';

import AppButton from '../../../components/ui/AppButton';
import PageIntro from '../../../components/ui/PageIntro';
import DataSection from '../../../components/ui/DataSection';
import PageLoader from '../../../components/ui/PageLoader';

import DetailSplitLayout from "../../../components/layout/DetailSplitLayout";

import { UI } from "../../../theme/constants";

const MAX_VISIBLE_SECTIONS = 4;

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    sclassesList,
    classGroupsList,
    loading,
    error
  } = useSelector((state) => state.sclass);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getAllSclasses(currentUser._id, "Sclass"));
      dispatch(getAllClassGroups(currentUser._id));
    }
  }, [dispatch, currentUser?._id]);

  /* ---------------- DATA MAPPING ---------------- */

  const rows = useMemo(() => {
    if (!Array.isArray(classGroupsList)) return [];

    const sectionsByGroup = sclassesList.reduce((acc, section) => {
      const groupId =
        typeof section.classGroup === "object"
          ? section.classGroup?._id
          : section.classGroup;

      if (!acc[groupId]) acc[groupId] = [];
      acc[groupId].push(section);
      return acc;
    }, {});

    return classGroupsList.map((group) => {
      const sections = sectionsByGroup[group._id] || [];
      const totalStudents = sections.reduce(
        (sum, section) => sum + (Number(section.studentCount) || 0),
        0
      );

const totalCapacity = sections.reduce((sum, s) => sum + (s.capacity || 40), 0);

const totalAttendanceWeight = sections.reduce(
  (sum, section) =>
    sum + (
      (Number(section.attendanceYTD) || 0) *
      (Number(section.studentCount) || 0)
    ),
  0
);

const attendancePercentage =
  totalStudents > 0
    ? (
        totalAttendanceWeight / totalStudents
      ).toFixed(1)
    : 0;

      return {
        id: group._id,
        className: group.name,
        sections: sections.map((section) => section.sectionName),
        totalStudents,
        capacity: totalCapacity,
        attendancePercentage
      };
    });
  }, [classGroupsList, sclassesList]);

  const totalStudentsAcrossSchool = useMemo(() => {
    return rows.reduce((sum, row) => sum + row.totalStudents, 0);
  }, [rows]);

  const handleRowClick = (row) => {
    if (row?.id) {
      navigate(`/Admin/classes/class/${row.id}`);
    }
  };

  const columns = [
    {
      id: 'className',
      label: 'Class',
      width: '20%',
      align: 'left',
      format: (val) => (
        <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
          Class {val}
        </Typography>
      )
    },
    {
      id: 'sections',
      label: 'Sections',
      width: '40%',
      align: 'left',
      format: (sections) => {
        if (!sections?.length) {
          return (
            <Typography sx={{ fontSize: "0.82rem", color: UI.textMuted }}>
              No sections
            </Typography>
          );
        }

        const visibleSections = sections.length > MAX_VISIBLE_SECTIONS
          ? sections.slice(0, 3)
          : sections;

        const remainingCount = sections.length - visibleSections.length;

        return (
          <Typography sx={{ fontSize: "0.82rem", color: UI.textSecondary, lineHeight: 1.5 }}>
            {visibleSections.join(", ")}
            {remainingCount > 0 && (
              <Box component="span" sx={{ color: UI.textMuted, ml: 0.5 }}>
                {` +${remainingCount} more`}
              </Box>
            )}
          </Typography>
        );
      }
    },
    {
      id: 'capacity',
      label: 'Capacity',
      width: '20%',
      align: 'left',
      format: (_, row) => (
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "0.85rem",
            color: row.totalStudents >= row.capacity ? "error.main" : "text.secondary"
          }}
        >
          {row.totalStudents}/{row.capacity}
        </Typography>
      )
    },
    {
      id: 'attendancePercentage',
      label: 'Attendance',
      width: '20%',
      align: 'left',
      format: (val) => (
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "0.85rem",
            color: val >= 85 ? UI.success : UI.textSecondary
          }}
        >
          {val}%
        </Typography>
      )
    }
  ];

  if (loading) return <PageLoader />;

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <PageIntro
        title="Class Directory"
        subtitle={`${rows.length} Classes • ${totalStudentsAcrossSchool} Students`}
      />

      <Box sx={{ mt: 4 }}>
        {error ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography color="error">Error loading classes.</Typography>
          </Box>
        ) : (
          <DetailSplitLayout
            dividerColor="transparent"
            left={
              <Box sx={{ width: '100%', maxWidth: '800px' }}>
                <DataSection
                  action={
                    <AppButton
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/Admin/addclass', { state: { mode: 'create-class' } })}
                    >
                      New Class
                    </AppButton>
                  }
                  isEmpty={rows.length === 0}
                  emptyText='No classes found.'
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
  );
};

export default ShowClasses;