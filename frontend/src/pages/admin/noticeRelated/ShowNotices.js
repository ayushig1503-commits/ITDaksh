import React, { useEffect, useMemo, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography
} from '@mui/material';

import AddIcon from "@mui/icons-material/Add";

import {
  getAllNotices
} from '../../../redux/noticeRelated/noticeHandle';

import {
  deleteUser
} from '../../../redux/userRelated/userHandle';

import TableTemplate from '../../../components/TableTemplate';

import AppButton from '../../../components/ui/AppButton';
import PageIntro from '../../../components/ui/PageIntro';
import DataSection from '../../../components/ui/DataSection';
import PageLoader from '../../../components/ui/PageLoader';
import ConfirmDeleteDialog from '../../../components/ui/ConfirmDeleteDialog';

import { UI } from "../../../theme/constants";

const truncate = (text = "", limit = 120) => {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}...`;
};

const ShowNotices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    noticesList = [],
    loading,
    response
  } = useSelector((state) => state.notice);

  const { currentUser } = useSelector((state) => state.user);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(
        getAllNotices(
          currentUser._id,
          "Notice"
        )
      );
    }
  }, [currentUser?._id, dispatch]);

  const handleDelete = async () => {
    if (!selectedNotice) return;

    await dispatch(
      deleteUser(
        selectedNotice.id,
        "Notice"
      )
    );

    dispatch(
      getAllNotices(
        currentUser._id,
        "Notice"
      )
    );

    setConfirmOpen(false);
    setSelectedNotice(null);
  };

  const noticeRows = useMemo(() => {
    return noticesList.map((notice) => {
      const date = new Date(notice.date);

      const formattedDate =
        date.toString() !== "Invalid Date"
          ? date.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short"
            })
          : "—";

      return {
        id: notice._id,

        announcement: (
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.9rem",
                mb: 0.5
              }}
            >
              {notice.title}
            </Typography>

            <Typography
              sx={{
                fontSize: "0.84rem",
                color: UI.textSecondary,
                lineHeight: 1.6
              }}
            >
              {truncate(notice.details)}
            </Typography>
          </Box>
        ),

        published: (
          <Typography
            sx={{
              fontSize: "0.82rem",
              color: UI.textMuted,
              whiteSpace: "nowrap"
            }}
          >
            {formattedDate}
          </Typography>
        )
      };
    });
  }, [noticesList]);

  const noticeColumns = [
    {
      id: "announcement",
      label: "Announcement",
      width: "80%"
    },

    {
      id: "published",
      label: "Publish Date",
      width: "20%"
    }
  ];

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Box sx={{ width: "100%", pb: 4 }}>

      {/* ── PAGE INTRO ── */}
      <PageIntro
        title="Announcements"
        subtitle={`${noticeRows.length} Active Notices`}
        action={
          <AppButton
            startIcon={<AddIcon />}
            onClick={() =>
              navigate("/Admin/addnotice")
            }
          >
            Add Notice
          </AppButton>
        }
      />

      {/* ── CONTENT ── */}
      <DataSection
        title="Notice Board"
        isEmpty={
          response ||
          noticeRows.length === 0
        }
        emptyText="No announcements yet."
      >
        <TableTemplate
          columns={noticeColumns}
          rows={noticeRows}
          disablePaper={false}
          onRowClick={(row) => {
            setSelectedNotice(row);
            setConfirmOpen(true);
          }}
        />
      </DataSection>

      {/* ── DELETE DIALOG ── */}
      <ConfirmDeleteDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setSelectedNotice(null);
        }}
        onConfirm={handleDelete}
        title="Delete Announcement"
        description="This announcement will be permanently removed."
        confirmText="Delete Notice"
        consequences={[
          "Students and staff will no longer see this notice",
          "This action cannot be undone"
        ]}
      />
    </Box>
  );
};

export default ShowNotices;