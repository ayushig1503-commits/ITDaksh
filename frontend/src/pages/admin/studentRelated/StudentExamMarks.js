import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList, getMarkingScheme } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import Popup from '../../../components/Popup';
import {
    Box, MenuItem, Select, Typography,
    Stack, CircularProgress, FormControl,
    InputLabel, Paper
} from '@mui/material';
import AppButton from '../../../components/ui/AppButton';
import styled from 'styled-components';

const StudentExamMarks = ({ situation }) => {
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList, markingScheme } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams();

    const [studentID, setStudentID] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [term, setTerm] = useState("");
    const [examType, setExamType] = useState("");
    const [marksObtained, setMarksObtained] = useState("");
    
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    // Initial Fetch: Triggered only when URL parameters change
    useEffect(() => {
        if (situation === "Student" && params.id) {
            setStudentID(params.id);
            dispatch(getUserDetails(params.id, "Student"));
        } else if (situation === "Subject" && params.studentID) {
            setStudentID(params.studentID);
            dispatch(getUserDetails(params.studentID, "Student"));
            setChosenSubName(params.subjectID);
        }
    }, [situation, params.id, params.studentID, params.subjectID, dispatch]);

    // Secondary Data: Fetching Class and Marking Info
// Secondary Data: Fetching Class and Marking Info
useEffect(() => {
    // 1. Resolve IDs
    const classId = userDetails?.sclassName?._id || userDetails?.sclassName;
    const schoolId = currentUser?.school?._id || currentUser?.school || currentUser?._id;

    if (!classId || !schoolId) return; 

    // 2. Fetch Subjects first (This is the bridge to the ClassGroup)
    if (subjectsList.length === 0) {
        dispatch(getSubjectList(classId, "ClassSubjects"));
    }
    
    // 3. Resolve ClassGroup
    // Check student details first, then fallback to the subjects list
    let classGroup = userDetails?.sclassName?.classGroup?._id || userDetails?.sclassName?.classGroup;
    
    if (!classGroup && subjectsList.length > 0) {
        // If the student's class info is shallow, subjects usually carry the group ID
        classGroup = subjectsList[0].classGroup?._id || subjectsList[0].classGroup; 
    }

    // 4. Fetch Marking Scheme
    if (classGroup && !markingScheme) {
        console.log("DEBUG: Fetching Marking Scheme for Group:", classGroup);
        dispatch(getMarkingScheme(classGroup, schoolId));
    }

}, [dispatch, userDetails, subjectsList, markingScheme, currentUser]);

    // Logic: Derive assessments from the loaded scheme
    const availableAssessments = useMemo(() => {
        if (!markingScheme?.assessments || !term) return [];
        return markingScheme.assessments.filter(a => a.term === Number(term));
    }, [markingScheme, term]);

    const selectedAssessment = useMemo(() => {
        return availableAssessments.find(a => a.name === examType) || null;
    }, [availableAssessments, examType]);

    // Memoize options to prevent UI jitter
    const marksOptions = useMemo(() => {
        if (!selectedAssessment) return [];
        return Array.from({ length: selectedAssessment.maxMarks + 1 }, (_, i) => i);
    }, [selectedAssessment]);

    const handleTermChange = (e) => {
        setTerm(e.target.value);
        setExamType(""); 
        setMarksObtained("");
    };

const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedAssessment || !chosenSubName) return;
    setLoader(true);

    dispatch(updateStudentFields(studentID, {
        subName: chosenSubName,
        marksObtained: Number(marksObtained),
        maxMarks: selectedAssessment.maxMarks,
        term: Number(term),
        examType,
        adminID: currentUser._id,
    }, "UpdateExamResult"));
};

useEffect(() => {
    if (response || error || statestatus === "added") {
        setLoader(false);
        setShowPopup(true);
        // Ensure the message color depends on whether 'error' exists
        setMessage(error ? "Failed to save" : "Marks saved successfully");
    }
}, [response, statestatus, error]);

    if (loading) return (
        <LoaderWrap><CircularProgress sx={{ color: '#65429c' }} /></LoaderWrap>
    );

    return (
        <PageWrapper>
            <FormCard elevation={0}>
                <Header>
                    <Title>Update Marks</Title>
                    <Subtitle>Record weighted exam results for this student</Subtitle>
                </Header>

                <Stack spacing={0.5} sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: "0.9rem", color: "#374151" }}>
                        Student: <strong>{userDetails?.name}</strong>
                    </Typography>
                    {currentUser?.teachSubject && (
                        <Typography sx={{ fontSize: "0.9rem", color: "#374151" }}>
                            Subject: <strong>{currentUser.teachSubject?.subName}</strong>
                        </Typography>
                    )}
                </Stack>

                <form onSubmit={submitHandler}>
                    <Stack spacing={2.5}>
                        <StyledControl fullWidth>
                            <InputLabel>Select Term</InputLabel>
                            <Select value={term} label="Select Term" onChange={handleTermChange} required>
                                <MenuItem value={1}>Term 1</MenuItem>
                                <MenuItem value={2}>Term 2</MenuItem>
                            </Select>
                        </StyledControl>

                        <StyledControl fullWidth disabled={!term}>
                            <InputLabel>Assessment Type</InputLabel>
                            <Select value={examType} label="Assessment Type" onChange={(e) => setExamType(e.target.value)} required>
                                {availableAssessments.map((a) => (
                                    <MenuItem key={a.name} value={a.name}>
                                        {a.name} (Max: {a.maxMarks})
                                    </MenuItem>
                                ))}
                            </Select>
                        </StyledControl>

                        {situation === "Student" && (
                            <StyledControl fullWidth>
                                <InputLabel>Select Subject</InputLabel>
                                <Select
                                    value={chosenSubName}
                                    label="Select Subject"
                                    onChange={(e) => setChosenSubName(e.target.value)}
                                    required
                                >
                                    {subjectsList?.map((s) => (
                                        <MenuItem key={s._id} value={s._id}>{s.subName}</MenuItem>
                                    ))}
                                </Select>
                            </StyledControl>
                        )}

                        <Box>
                            <StyledControl fullWidth>
                                <InputLabel>Marks Obtained</InputLabel>
                                <Select
                                    value={marksObtained}
                                    label="Marks Obtained"
                                    onChange={(e) => setMarksObtained(e.target.value)}
                                    disabled={!examType}
                                    required
                                >
                                    {marksOptions.map((n) => (
                                        <MenuItem key={n} value={n}>{n}</MenuItem>
                                    ))}
                                </Select>
                            </StyledControl>
                            {selectedAssessment && (
                                <Typography sx={{ fontSize: "0.75rem", color: "#6b7280", mt: 0.5, pl: 0.5 }}>
                                    Weightage: {selectedAssessment.weightage}% towards final grade.
                                </Typography>
                            )}
                        </Box>

                        <AppButton type="submit" loading={loader} fullWidth>
                            Save Marks
                        </AppButton>
                    </Stack>
                </form>
            </FormCard>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </PageWrapper>
    );
};

export default StudentExamMarks;

/* --- STYLES --- */
const PageWrapper = styled(Box)`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at top left, #f2eaff 0%, transparent 28%), 
                linear-gradient(180deg, #f8f9fc 0%, #ffffff 100%);
    padding: 24px;
`;

const FormCard = styled(Paper)`
    width: 100%;
    max-width: 560px;
    padding: 32px 28px;
    border-radius: 24px !important;
    background: rgba(255,255,255,0.86) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.72) !important;
    box-shadow: 0 12px 32px rgba(17,24,39,0.06), 0 4px 10px rgba(17,24,39,0.04);
`;

const Header = styled.div`margin-bottom: 24px;`;
const Title = styled.h2`margin: 0; font-size: 1.75rem; font-weight: 700; color: #111827;`;
const Subtitle = styled.p`margin-top: 6px; color: #6b7280; font-size: 0.95rem;`;
const StyledControl = styled(FormControl)`& .MuiOutlinedInput-root { border-radius: 14px; background: #ffffff; }`;
const LoaderWrap = styled.div`min-height: 300px; display: flex; align-items: center; justify-content: center;`;