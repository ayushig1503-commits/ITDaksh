import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  Grid,
  Box,
  Typography,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";

import AppButton from "../../../components/ui/AppButton";
import StyledField from "../../../components/ui/StyledField";
import FormCard from "../../../components/ui/FormCard";

import Popup from "../../../components/Popup";

/* ---------------- LAYOUT & LOCAL STYLES ---------------- */

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 40px;
  width: 100%;
`;

const Header = styled(Box)`
  text-align: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.85rem;
`;

const SubjectRowCard = styled.div`
  padding: 20px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #7965b0;
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  }
`;

const SubjectForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const { status, currentUser, response } = useSelector((state) => state.user);

  const [subjects, setSubjects] = useState([
    { subName: "", subCode: "", sessions: "" },
  ]);

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 KEY CHANGE: params.id is now expected to be the classGroupId
  const classGroup = params.id; 
  const adminID = currentUser?._id;
  const address = "Subject";

  const totalSubjects = useMemo(() => subjects.length, [subjects]);

  const updateSubject = (index, key, value) => {
    setSubjects((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    );
  };

  const addSubjectRow = () => {
    setSubjects((prev) => [
      ...prev,
      { subName: "", subCode: "", sessions: "" },
    ]);
  };

  const removeSubjectRow = (index) => {
    if (subjects.length === 1) return;
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const invalid = subjects.some(
      (item) =>
        !item.subName.trim() ||
        !item.subCode.trim() ||
        item.sessions === "" ||
        Number(item.sessions) < 0
    );

    if (invalid) {
      setMessage("Please complete all subject fields.");
      setShowPopup(true);
      return;
    }

    const fields = {
      // 🔥 KEY CHANGE: Sending classGroup instead of sclassName
      classGroup, 
      adminID,
      subjects: subjects.map((item) => ({
        subName: item.subName.trim(),
        subCode: item.subCode.trim(),
        sessions: Number(item.sessions) || 0,
      })),
    };

    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added") {
      setLoader(false);
      dispatch(underControl());
      navigate("/Admin/subjects");
    } else if (status === "failed") {
      setLoader(false);
      setMessage(response || "Unable to save subjects.");
      setShowPopup(true);
    } else if (status === "error") {
      setLoader(false);
      setMessage("Network error. Please try again.");
      setShowPopup(true);
    }
  }, [status, response, navigate, dispatch]);

  return (
    <Container>
      <FormCard>
        <Header>
          <Title>Add Subjects</Title>
          <Subtitle>Create subjects for the entire grade level</Subtitle>
          <Typography variant="caption" sx={{ color: '#94a3b8', mt: 1, display: 'block' }}>
            Total Subjects to Add: {totalSubjects}
          </Typography>
        </Header>

        <Box component="form" onSubmit={submitHandler} noValidate>
          <Stack spacing={3}>
            {subjects.map((subject, index) => (
              <SubjectRowCard key={index}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ color: '#7965b0', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    SUBJECT #{index + 1}
                  </Typography>

                  {subjects.length > 1 && (
                    <Tooltip title="Remove row">
                      <IconButton
                        size="small"
                        onClick={() => removeSubjectRow(index)}
                        sx={{ color: '#ef4444', '&:hover': { background: '#fef2f2' } }}
                      >
                        <RemoveCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={5}>
                    <StyledField
                      fullWidth
                      label="Subject Name"
                      placeholder="e.g. Mathematics"
                      value={subject.subName}
                      onChange={(e) => updateSubject(index, "subName", e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <StyledField
                      fullWidth
                      label="Subject Code"
                      placeholder="e.g. MATH101"
                      value={subject.subCode}
                      onChange={(e) => updateSubject(index, "subCode", e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <StyledField
                      fullWidth
                      label="Sessions"
                      type="number"
                      value={subject.sessions}
                      onChange={(e) => updateSubject(index, "sessions", e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>
              </SubjectRowCard>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
              <AppButton
                variant="ghost"
                onClick={addSubjectRow}
                style={{ border: '1px dashed #7965b0', background: 'rgba(121, 101, 176, 0.02)' }}
              >
                <AddCircleOutlineIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                Add Another Subject
              </AppButton>
            </Box>

            <Divider />

            <Stack direction="row" spacing={2}>
              <AppButton
                variant="ghost"
                fullWidth
                onClick={() => navigate(-1)}
                type="button"
              >
                <ArrowBackIcon sx={{ mr: 1, fontSize: '1rem' }} />
                Back
              </AppButton>

              <AppButton
                type="submit"
                fullWidth
                loading={loader}
              >
                {loader ? "Saving..." : "Save All Subjects"}
              </AppButton>
            </Stack>
          </Stack>
        </Box>
      </FormCard>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Container>
  );
};

export default SubjectForm;