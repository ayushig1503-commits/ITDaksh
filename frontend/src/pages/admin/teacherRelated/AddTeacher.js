import { useEffect, useState } from "react";
import {
  Box,
  Select,
  InputLabel,
  FormControl,
  Typography,
  MenuItem,
  Stack
} from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getSubjectDetails, getSclassByClassGroup } from "../../../redux/sclassRelated/sclassHandle";
import { registerUser } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";

import AppButton from "../../../components/ui/AppButton";
import StyledField from "../../../components/ui/StyledField";
import FormCard from "../../../components/ui/FormCard";
import Popup from "../../../components/Popup";
import { UI } from "../../../theme/constants";


const AddTeacher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const subjectID = params.id;

  const { status, response } = useSelector((state) => state.user);
  const { subjectDetails } = useSelector((state) => state.sclass);
  const { sclassesList } = useSelector((state) => state.sclass);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sclassID, setSclassID] = useState("");

  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

// DEBUG 1: Watch the Subject Load
useEffect(() => {
    console.log("DEBUG [AddTeacher]: Fetching Subject Details for ID:", subjectID);
    dispatch(getSubjectDetails(subjectID, "Subject"));
}, [dispatch, subjectID]);

// DEBUG 2: Watch the ClassGroup -> Section transition
useEffect(() => {
    if (subjectDetails) {
        console.log("DEBUG [AddTeacher]: Subject Details Loaded:", subjectDetails);
        
        if (subjectDetails.classGroup?._id) {
            console.log("DEBUG [AddTeacher]: Found ClassGroup ID, fetching Sections:", subjectDetails.classGroup._id);
            dispatch(getSclassByClassGroup(subjectDetails.classGroup._id));
        } else {
            console.warn("DEBUG [AddTeacher]: CRITICAL - subjectDetails exists but classGroup ID is MISSING.");
        }
    }
}, [subjectDetails, dispatch]);

// DEBUG 3: Watch the Sections list arrive
useEffect(() => {
    console.log("DEBUG [AddTeacher]: Current SclassesList in Redux:", sclassesList);
}, [sclassesList]);

// DEBUG 4: Watch the Registration Status (The "Stuck Spinner" Fixer)
useEffect(() => {
    console.log("DEBUG [AddTeacher]: Current Redux Status:", status);
    
    if (status === "added") {
        console.log("DEBUG [AddTeacher]: SUCCESS SIGNAL RECEIVED. Navigating...");
        dispatch(underControl());
        setLoader(false); 
        navigate("/Admin/teachers");
    } else if (status === "failed") {
        console.error("DEBUG [AddTeacher]: REGISTRATION FAILED. Response:", response);
        setMessage(response || "Failed to register teacher.");
        setShowPopup(true);
        setLoader(false);
    } else if (status === "error") {
        console.error("DEBUG [AddTeacher]: NETWORK/SERVER ERROR.");
        setMessage("Network Error");
        setShowPopup(true);
        setLoader(false);
    }
}, [status, response, navigate, dispatch]);

  const submitHandler = (event) => {
    event.preventDefault();

    const trimmedName = name.trim().replace(/\s+/g, " ");
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setMessage("Please enter the teacher's name.");
      setShowPopup(true);
      return;
    }

    if (!normalizedEmail) {
      setMessage("Please enter an email address.");
      setShowPopup(true);
      return;
    }

    if (password.trim().length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setShowPopup(true);
      return;
    }

    if (!subjectDetails?._id) {
      setMessage("Subject details could not be loaded.");
      setShowPopup(true);
      return;
    }

    setLoader(true);

const fields = {
  name: trimmedName,
  email: normalizedEmail,
  password: password.trim(),
  role: "Teacher",
  school: subjectDetails.school,

  assignments: [
    { 
      subject: subjectDetails._id, 
      sclass: sclassID 
    }
  ],
};

    dispatch(registerUser(fields, "Teacher"));
  };

  return (
    <>
      <FormCard maxWidth={480}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            component="h1"
            sx={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: UI.textPrimary,
              mb: 0.5,
            }}
          >
            Add Teacher
          </Typography>

          <Typography
            sx={{
              fontSize: "0.875rem",
              color: UI.textSecondary,
            }}
          >
            Register a faculty member for this subject.
          </Typography>
        </Box>

        {subjectDetails && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: UI.radiusMd,
              border: `1px solid ${UI.border}`,
              bgcolor: UI.surfaceSoft,
            }}
          >
            <Stack spacing={1}>
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: UI.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 0.25,
                  }}
                >
                  Subject
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.92rem",
                    fontWeight: 600,
                    color: UI.textPrimary,
                  }}
                >
                  {subjectDetails.subName}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: UI.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 0.25,
                  }}
                >
                  Class
                </Typography>

<Typography
  sx={{
    fontSize: "0.92rem",
    fontWeight: 600,
    color: UI.textPrimary,
  }}
>
  {subjectDetails.sclassName?.sclassName}
  {subjectDetails.sclassName?.sectionName
    ? ` — Section ${subjectDetails.sclassName.sectionName}`
    : ""}
</Typography>
              </Box>
            </Stack>
          </Box>
        )}

        <Box component="form" onSubmit={submitHandler}>
          <Stack spacing={3}>
            <FormControl fullWidth required>
  <InputLabel id="section-select-label">Select Section</InputLabel>
  <Select
    labelId="section-select-label"
    id="section-select"
    value={sclassID}
    label="Select Section"
    onChange={(e) => setSclassID(e.target.value)}
  >
    {sclassesList && sclassesList.length > 0 ? (
      sclassesList.map((sclass) => (
        <MenuItem key={sclass._id} value={sclass._id}>
          {sclass.sclassName} {sclass.sectionName}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No sections found for this class</MenuItem>
    )}
  </Select>
</FormControl>

            <StyledField
              label="Teacher Name"
              placeholder="Enter full name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />

            <StyledField
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <StyledField
              label="Password"
              type="password"
              placeholder="Create password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <AppButton
              fullWidth
              type="submit"
              loading={loader}
              size="large"
              disabled={
                !name.trim() ||
                !email.trim() ||
                password.trim().length < 6
              }
            >
              Register Teacher
            </AppButton>

            <AppButton
              variant="ghost"
              fullWidth
              onClick={() => navigate(-1)}
              type="button"
            >
              Go Back
            </AppButton>
          </Stack>
        </Box>
      </FormCard>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default AddTeacher;