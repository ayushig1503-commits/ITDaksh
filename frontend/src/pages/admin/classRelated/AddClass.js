import { useEffect, useState } from "react";
import { Box, Stack, Typography, Chip } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { addStuff } from '../../../redux/userRelated/userHandle';
import { createClassGroup, getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { underControl } from '../../../redux/userRelated/userSlice';

import AppButton from "../../../components/ui/AppButton";
import StyledField from "../../../components/ui/StyledField";
import FormCard from "../../../components/ui/FormCard";
import Popup from "../../../components/Popup";
import { UI } from "../../../theme/constants";
import useFormContext from "../../../components/ui/useFormContext";

const AddClass = () => {
  console.log("AddClass RENDERED");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ctx = useFormContext();

  const { currentUser } = useSelector((state) => state.user);
  const { sectionOptions = [] } = useSelector((state) => state.settings);
  const { classGroupsList = [] } = useSelector((state) => state.sclass);

  const adminID = currentUser?._id;

  const isAddSection = ctx.is('add-section');

  const [sclassName, setSclassName] = useState(
    isAddSection ? ctx.get('className', '') : ""
  );

  const [selectedSections, setSelectedSections] = useState([]);
  const [capacity, setCapacity] = useState(40);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    console.log("AddClass mounted");
  }, []);

  const toggleSection = (option) => {
    if (isAddSection) {
      setSelectedSections([option]);
    } else {
      setSelectedSections((prev) =>
        prev.includes(option)
          ? prev.filter((s) => s !== option)
          : [...prev, option]
      );
    }
  };

  const submitHandler = async (event) => {
    if (event) event.preventDefault();

    console.log("FORM SUBMIT EVENT FIRED");

    if (!sclassName.trim()) {
      setMessage("Please enter a grade level.");
      setShowPopup(true);
      return;
    }

    if (selectedSections.length === 0) {
      setMessage("Please select at least one section.");
      setShowPopup(true);
      return;
    }

    setLoader(true);

    try {
      const existingGroup = classGroupsList.find(g =>
        g.name.trim().toLowerCase() === sclassName.trim().toLowerCase()
      );

      let groupData;

      if (existingGroup) {
        console.log("Using existing group:", existingGroup._id);
        groupData = existingGroup;
      } else {
        console.log("Creating new class group");
        const res = await dispatch(createClassGroup({
          name: sclassName.trim(),
          adminID
        }));

        groupData = res;
      }

      console.log("Final groupData:", groupData);

      if (!groupData || !groupData._id) {
        throw new Error("Group creation failed or missing ID");
      }

console.log(`Creating ${selectedSections.length} section(s)`);

const promises = selectedSections.map(async (sectionName) => {
    const response = await dispatch(
        addStuff(
            {
                sclassName: sclassName.trim(),
                sectionName,
                adminID,
                classGroup: groupData._id,
                capacity 
            },
            "Sclass"
        )
    );
    return response; 
});

const results = await Promise.all(promises);
console.log("All sections created:", results);


      dispatch(underControl());

      console.log("Refreshing class list...");
      await dispatch(getAllSclasses(adminID, "Sclass"));

      console.log("Navigating to /Admin/classes");
      navigate("/Admin/classes");

    } catch (err) {
      console.error("submitHandler error:", err);
      setMessage("Something went wrong.");
      setShowPopup(true);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <FormCard maxWidth={480}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            component="h1"
            sx={{ fontSize: '1.5rem', fontWeight: 700, color: UI.textPrimary, mb: 0.5 }}
          >
            {isAddSection ? "Add Section" : "Create New Class"}
          </Typography>

          <Typography sx={{ fontSize: '0.875rem', color: UI.textSecondary }}>
            {isAddSection
              ? `Add a new section to ${sclassName}.`
              : "Define the grade level and select its sections."}
          </Typography>
        </Box>

        <Box component="form" onSubmit={submitHandler}>
          <Stack spacing={3}>

            <StyledField
              label="Grade Level"
              placeholder="e.g., VI or Grade 10"
              fullWidth
              value={sclassName}
              onChange={(e) => setSclassName(e.target.value)}
              required
              autoFocus={!isAddSection}
              disabled={isAddSection}
            />

            {/* 2. Added Section Capacity field */}
            <StyledField
              label="Section Capacity"
              placeholder="e.g., 40"
              type="number"
              fullWidth
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              inputProps={{ min: 1, max: 100 }}
            />

            <Box>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: UI.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 1.5
                }}
              >
                Section{!isAddSection && "s"}
              </Typography>

              {sectionOptions.length === 0 ? (
                <Typography sx={{ fontSize: '0.875rem', color: UI.textMuted }}>
                  No section options configured.{" "}
                  <Box
                    component="span"
                    onClick={() => navigate("/Admin/settings")}
                    sx={{
                      color: UI.accent,
                      cursor: 'pointer',
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Go to Settings
                  </Box>
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {sectionOptions.map((option) => {
                    const selected = selectedSections.includes(option);

                    return (
                      <Chip
                        key={option}
                        label={`Section ${option}`}
                        onClick={() => toggleSection(option)}
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          borderRadius: UI.radiusSm,
                          border: `1px solid ${selected ? UI.accent : UI.border}`,
                          bgcolor: selected ? UI.accentSubtle : UI.surface,
                          color: selected ? UI.accent : UI.textSecondary,
                          transition: 'all 0.15s ease',
                        }}
                      />
                    );
                  })}
                </Box>
              )}
            </Box>

            <AppButton
              fullWidth
              type="submit"
              loading={loader}
              size="large"
              disabled={selectedSections.length === 0 || !sclassName.trim()}
            >
              {isAddSection ? "Add Section" : "Create Class"}
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

export default AddClass;