import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import {
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  CircularProgress,
  FormControl,
  Paper
} from '@mui/material';

import {
  PersonOutline,
  EventAvailable
} from '@mui/icons-material';

import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import Popup from '../../../components/Popup';

const StudentAttendance = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const lastFetchedId = useRef(null);

  const { userDetails, loading } = useSelector((state) => state.user);
  const { response, error, statestatus } = useSelector((state) => state.student);

  const [studentID, setStudentID] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  // 1. Fetch Student Details
  useEffect(() => {
    // We only care about params.id now for Daily Attendance
    const currentId = params.id;

    if (currentId && currentId !== lastFetchedId.current) {
      lastFetchedId.current = currentId;
      setStudentID(currentId);
      dispatch(getUserDetails(currentId, "Student"));
    }
  }, [params.id, dispatch]);

  // 2. Handle API Responses
useEffect(() => {
    if (statestatus === "added") {
        setLoader(false);
        setShowPopup(true);
        setMessage("Daily Attendance marked successfully!");
        setStatus("");
        setDate("");
        
        // CRITICAL: Reset the Redux status so the popup doesn't re-trigger
        // dispatch(underControl()); // Or whatever your "reset" action is named
    } else if (error) {
        setLoader(false);
        setShowPopup(true);
        setMessage("Something went wrong");
    } else if (response) {
        setLoader(false);
        setShowPopup(true);
        setMessage(response);
    }
}, [response, error, statestatus, dispatch]);

const submitHandler = (event) => {
  event.preventDefault();

const fields = {
  status,
  date
};

  setLoader(true);
  dispatch(updateStudentFields(studentID, fields, "StudentAttendance"));
};

  return (
    <>
      {loading ? (
        <LoaderWrap>
          <CircularProgress sx={{ color: '#65429c' }} />
        </LoaderWrap>
      ) : (
        <PageWrapper>
          <ContentCard elevation={0}>
            <HeaderSection>
              <Title>Daily Attendance</Title>
              <Subtitle>Roll call for the entire school day</Subtitle>
            </HeaderSection>

            <InfoGrid>
              <InfoChip>
                <PersonOutline fontSize="small" />
                <span>{userDetails?.name || "Student"}</span>
              </InfoChip>
              <InfoChip>
                 <span>Class: {userDetails?.sclassName?.sclassName || "N/A"}</span>
              </InfoChip>
            </InfoGrid>

            <Form onSubmit={submitHandler}>
              <Stack spacing={2.2}>
                <StyledControl fullWidth>
                  <InputLabel>Attendance Status</InputLabel>
                  <Select
                    value={status}
                    label="Attendance Status"
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <MenuItem value="Present">Present</MenuItem>
                    <MenuItem value="Absent">Absent</MenuItem>
                  </Select>
                </StyledControl>

                <StyledField
                  fullWidth
                  label="Select Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Stack>

              <SubmitButton type="submit" disabled={loader} fullWidth>
                {loader ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  <>
                    <EventAvailable sx={{ fontSize: 18 }} />
                    Mark Daily Attendance
                  </>
                )}
              </SubmitButton>
            </Form>
          </ContentCard>

          <Popup
            message={message}
            setShowPopup={setShowPopup}
            showPopup={showPopup}
          />
        </PageWrapper>
      )}
    </>
  );
};

export default StudentAttendance;

/* ---------------- STYLES ---------------- */

const LoaderWrap = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 36px 18px;
  background: radial-gradient(circle at top left, #f3eaff 0%, transparent 28%),
              linear-gradient(180deg, #f8f9fc 0%, #ffffff 100%);
`;

const ContentCard = styled(Paper)`
  width: 100%;
  max-width: 500px;
  padding: 34px;
  border-radius: 24px !important;
  background: rgba(255, 255, 255, 0.9) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05) !important;
`;

const HeaderSection = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
`;

const Subtitle = styled.p`
  margin: 5px 0 0;
  color: #6b7280;
  font-size: 0.95rem;
`;

const InfoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
`;

const InfoChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 12px;
  background: #f4ebff;
  color: #65429c;
  font-size: 0.875rem;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledControl = styled(FormControl)`
  & .MuiOutlinedInput-root { border-radius: 12px; }
`;

const StyledField = styled(TextField)`
  & .MuiOutlinedInput-root { border-radius: 12px; }
`;

const SubmitButton = styled.button`
  margin-top: 24px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: #65429c;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;