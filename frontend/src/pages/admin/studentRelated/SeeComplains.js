import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Checkbox,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';

import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { getAllComplains } from '../../../redux/complainRelated/complainHandle';
import TableTemplate from '../../../components/TableTemplate';
import { UI } from "../../../theme/constants";

const ShowComplains = () => {
  const dispatch = useDispatch();

  const { complainsList, loading, response } = useSelector((state) => state.complain);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllComplains(currentUser._id, "Complain"));
  }, [currentUser._id, dispatch]);

  const complainColumns = [
    { id: 'user', label: 'User' },
    { id: 'complaint', label: 'Complaint' },
    { id: 'date', label: 'Date' },
    { id: 'actions', label: '', width: '1%' } // 🔥 tight column
  ];

  const complainRows = useMemo(() => {
    return complainsList?.map((complain) => {
      const date = new Date(complain.date);
      const dateString =
        date.toString() !== "Invalid Date"
          ? date.toISOString().substring(0, 10)
          : "Invalid Date";

      return {
        user: complain.user.name,

        complaint: (
          <Box
            sx={{
              whiteSpace: 'normal',
              overflow: 'visible',
              textOverflow: 'unset',
              lineHeight: 1.5
            }}
          >
            {complain.complaint}
          </Box>
        ),

        date: dateString,
        id: complain._id,
      };
    }) || [];
  }, [complainsList]);

  const ComplainButtonHaver = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        width: 'fit-content'
      }}
    >
      <Checkbox
        size="small"
        icon={<MarkEmailReadOutlinedIcon sx={{ fontSize: 20 }} />}
        checkedIcon={<CheckCircleOutlineIcon sx={{ fontSize: 20 }} />}
        sx={{
          p: 0.5,
          color: '#6e6e73',
          '&.Mui-checked': { color: '#7965b0' }
        }}
      />
    </Box>
  );

  return (
    <>
      <Typography
        component="h1"
        sx={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)'
        }}
      >
        Complaints Management
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#7965b0' }} />
        </Box>
      ) : (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>

          <Box sx={{ maxWidth: 900, width: '100%' }}>

            {/* HEADER */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000'
                }}
              >
                <FeedbackOutlinedIcon />
              </Box>

              <Box>
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: UI.textPrimary }}>
                  Complaints
                </Typography>
                <Typography sx={{ fontSize: 13, color: UI.textSecondary }}>
                  Review issues submitted by students and staff
                </Typography>
              </Box>
            </Box>

            {response || complainRows.length === 0 ? (
              <Box
                sx={{
                  mt: 2,
                  p: 5,
                  border: '1px solid #E5E7EB',
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  No Complaints Found
                </Typography>
                <Typography sx={{ fontSize: 13, color: UI.textSecondary }}>
                  No pending issues to review.
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  mt: 2,
                  border: '1px solid #E5E7EB',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <TableTemplate
                  buttonHaver={ComplainButtonHaver}
                  columns={complainColumns}
                  rows={complainRows}
                />
              </Box>
            )}

          </Box>

        </Box>
      )}
    </>
  );
};

export default ShowComplains;