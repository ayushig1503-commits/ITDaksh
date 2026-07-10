import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Typography,
  MenuItem,
  Stack
} from '@mui/material';

import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';

// UI Components
import AppButton from "../../../components/ui/AppButton";
import StyledField from "../../../components/ui/StyledField";
import FormCard from "../../../components/ui/FormCard";

import Popup from '../../../components/Popup';

const AddNotice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { status, currentUser } = useSelector((state) => state.user);

  const prefillDate = location.state?.prefillDate || '';

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState(prefillDate);
  const [category, setCategory] = useState('Announcement');
  const [showOnCalendar, setShowOnCalendar] = useState(!!prefillDate);

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');

  const adminID = currentUser?._id;

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(
      addStuff(
        { title, details, date, adminID, category, showOnCalendar },
        "Notice"
      )
    );
  };

  useEffect(() => {
    if (status === 'added') {
      navigate('/Admin/notices');
      dispatch(underControl());
    } else if (status === 'error') {
      setMessage("Network Error");
      setShowPopup(true);
      setLoading(false);
    }
  }, [status, navigate, dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        py: 4,
        px: 2,
      }}
    >
      <FormCard>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Add Notice
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Post an announcement or schedule an event
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={submitHandler}>
          <Stack spacing={2.5}>
            <StyledField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />

            <StyledField
              label="Category"
              select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
            >
              <MenuItem value="Announcement">Announcement</MenuItem>
              <MenuItem value="Event">School Event</MenuItem>
              <MenuItem value="Holiday">Public Holiday</MenuItem>
              <MenuItem value="Exam">Examination</MenuItem>
            </StyledField>

            <StyledField
              label="Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              multiline
              rows={4}
              fullWidth
              required
            />

            <StyledField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              sx={{
                bgcolor: prefillDate ? 'action.hover' : 'transparent',
                borderRadius: 1,
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={showOnCalendar}
                  onChange={(e) => setShowOnCalendar(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Pin to calendar / upcoming events
                </Typography>
              }
            />

            <AppButton type="submit" loading={loading} fullWidth>
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Post Notice"
              )}
            </AppButton>

            <AppButton
              variant="ghost"
              fullWidth
              onClick={() => navigate(-1)}
              type="button"
            >
              Cancel
            </AppButton>
          </Stack>
        </Box>
      </FormCard>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Box>
  );
};

export default AddNotice;