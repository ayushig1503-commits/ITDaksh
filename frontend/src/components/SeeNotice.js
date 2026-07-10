import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotices } from '../redux/noticeRelated/noticeHandle';

import {
  CircularProgress,
  Box,
  Chip,
  Typography,
} from '@mui/material';

import TableViewTemplate from './TableViewTemplate';

const SeeNotice = () => {
  const dispatch = useDispatch();

  const { currentUser, currentRole } = useSelector(state => state.user);
  const { noticesList, loading } = useSelector((state) => state.notice);

  useEffect(() => {
    if (!currentUser) return;

    const id =
      currentRole === "Admin"
        ? currentUser._id
        : currentUser?.school?._id;

    if (id) {
      dispatch(getAllNotices(id, "Notice"));
    }
  }, [dispatch, currentRole, currentUser]);

const noticeColumns = [
  { id: 'title',    label: 'Title',    minWidth: 120, maxWidth: 185 },
  { id: 'category', label: 'Category', minWidth: 80,  maxWidth: 120 },
  { id: 'details',  label: 'Details',  minWidth: 200, maxWidth: 420 },
  { id: 'date',     label: 'Date',     minWidth: 80,  maxWidth: 100 },
];

  const noticeRows = useMemo(() => {
    const data = Array.isArray(noticesList)
      ? noticesList
      : noticesList?.noticesList || [];

    return data.map((notice) => {
      const date = new Date(notice.date);

      const dateString =
        date.toString() !== "Invalid Date"
          ? date.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : "—";

      return {
        id: notice._id,

        title: (
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {notice.title}
          </Typography>
        ),

        category: (
          <Chip
            label={notice.category || 'General'}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.7rem',
              height: 20,
              fontWeight: 600,
              borderColor: 'divider',
              color: 'text.secondary',
              bgcolor: 'action.hover',
            }}
          />
        ),

        details: (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {notice.details}
          </Typography>
        ),

        date: (
          <Typography variant="caption" color="text.secondary">
            {dateString}
          </Typography>
        ),
      };
    });
  }, [noticesList]);

  return (
    <Box sx={{ width: '100%' }}>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 6,
          }}
        >
          <CircularProgress size={24} />
        </Box>
      ) : noticeRows.length === 0 ? (
        <Box
          sx={{
            py: 6,
            textAlign: 'center',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            You're all caught up for now.
          </Typography>
        </Box>
      ) : (
        <TableViewTemplate columns={noticeColumns} rows={noticeRows} />
      )}
    </Box>
  );
};

export default SeeNotice;