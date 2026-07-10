import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import TableTemplate from '../../../components/TableTemplate';
import Popup from '../../../components/Popup';
import AppButton from '../../../components/ui/AppButton';
import PageIntro from '../../../components/ui/PageIntro';
import DataSection from '../../../components/ui/DataSection';
import PageLoader from '../../../components/ui/PageLoader';
import DetailSplitLayout from "../../../components/layout/DetailSplitLayout";

import { UI } from "../../../theme/constants";

const MAX_VISIBLE_SUBJECTS = 4;

const ShowSubjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { subjectsList = [], loading } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector((state) => state.user);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getSubjectList(currentUser._id, 'AllSubjects'));
    }
  }, [currentUser?._id, dispatch]);

  const rows = useMemo(() => {
    if (!Array.isArray(subjectsList)) return [];

    const grouped = {};
    subjectsList.forEach((sub) => {
      const groupId = sub?.classGroup?._id;
      const groupName = sub?.classGroup?.name || '—';

      if (!grouped[groupId]) {
        grouped[groupId] = {
          id: groupId,
          className: groupName,
          subjects: [],
          totalSessions: 0,
        };
      }
      grouped[groupId].subjects.push(sub.subName);
      grouped[groupId].totalSessions += Number(sub.sessions) || 0;
    });

    return Object.values(grouped);
  }, [subjectsList]);

  const totalSubjects = useMemo(() => subjectsList.length || 0, [subjectsList]);

  const handleRowClick = (row) => {
    if (row?.id) navigate(`/Admin/classes/class/${row.id}`);
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
      id: 'subjects',
      label: 'Subjects',
      width: '60%',
      align: 'left',
      format: (subjects) => {
        if (!subjects?.length) {
          return (
            <Typography sx={{ fontSize: "0.82rem", color: UI.textMuted }}>
              No subjects
            </Typography>
          );
        }

        // Logic: No slicing here. We let CSS handle the cut-off.
        const fullText = subjects.join(", ");
        const remainingCount = subjects.length - MAX_VISIBLE_SUBJECTS;
        const hasMore = remainingCount > 0;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', overflow: 'hidden', gap: 1 }}>
            <Box
              component="span"
              sx={{
                fontSize: "0.82rem",
                color: UI.textSecondary,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flexShrink: 1, // Shrink this box first
                minWidth: 0,    // Allow shrinking below content size
              }}
            >
              {fullText}
            </Box>

            {hasMore && (
              <Typography
                component="span"
                sx={{
                  fontSize: "0.82rem",
                  color: UI.textMuted,
                  fontWeight: 600,
                  flexShrink: 0, // Never shrink the badge
                  whiteSpace: 'nowrap',
                }}
              >
                +{remainingCount} more
              </Typography>
            )}
          </Box>
        );
      }
    },
    {
      id: 'totalSessions',
      label: 'Weekly Sessions',
      width: '20%',
      align: 'left',
      format: (val) => (
        <Typography sx={{ fontWeight: 500, fontSize: "0.85rem", color: UI.textSecondary }}>
          {val || 0}
        </Typography>
      )
    }
  ];

  if (loading) return <PageLoader />;

  console.log("First Subject Object:", subjectsList[0]);

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <PageIntro
        title="Subjects"
        subtitle={`${rows.length} Classes • ${totalSubjects} Subjects`}
      />

      <Box sx={{ mt: 4 }}>
        <DetailSplitLayout
          dividerColor="transparent"
          left={
            <Box sx={{ width: '100%', maxWidth: '850px' }}>
              <DataSection
                isEmpty={rows.length === 0}
                emptyText="No subjects found."
              >
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
  <AppButton
    startIcon={<AddIcon />}
    onClick={() => navigate('/Admin/subjects/chooseclass')}
  >
    Add Subject
  </AppButton>
</Box>
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
      </Box>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  );
};

export default ShowSubjects;