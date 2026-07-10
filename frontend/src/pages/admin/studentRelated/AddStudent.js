import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
    Box,
    Chip,
    Typography,
    Stack,
    MenuItem,
    Divider
} from '@mui/material';

import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';

import Popup from '../../../components/Popup';
import FormCard from '../../../components/ui/FormCard';
import AppButton from '../../../components/ui/AppButton';
import StyledField from '../../../components/ui/StyledField';

import { UI } from '../../../theme/constants';
import useFormContext from "../../../components/ui/useFormContext";

/* ─────────────────────────────
    STYLES
───────────────────────────── */

const SECTION_TITLE = {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: UI.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    mb: 1.5
};

const ROW_PROPS = {
    direction: { xs: 'column', sm: 'row' },
    spacing: 2
};

const AddStudent = ({ situation }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const ctx = useFormContext();

    const { status, currentUser, response } = useSelector(
        (state) => state.user
    );

    const { sclassesList } = useSelector(
        (state) => state.sclass
    );

    const adminID = currentUser._id;

    /* ─────────────────────────────
        CONTEXT
    ───────────────────────────── */

    const fromClass =
        ctx.is('add-student-from-class') ||
        (situation === "Class" &&
            ctx.get('sections', []).length > 0);

    const prefilledClassName =
        ctx.get('sclassName') || null;

    const prefilledSections =
        ctx.get('sections', []);

    /* ─────────────────────────────
        FORM STATE
    ───────────────────────────── */

    const [formData, setFormData] = useState({

        // Basic
        name: '',
        rollNum: '',
        password: '',
        sclassName: '',

        admissionDate: '',
        dob: '',
        gender: '',
        category: '',

        // Address
        address: '',

        // Parent Details
        fatherName: '',
        fatherPhone: '',

        motherName: '',
        motherPhone: '',

        guardianName: '',
        guardianRelation: '',
        guardianPhone: '',

        // Medical
        bloodGroup: '',
        medicalHistory: '',
    });

    const [loader, setLoader] = useState(false);

    const [popup, setPopup] = useState({
        show: false,
        message: ''
    });

    /* ─────────────────────────────
        FETCH CLASSES
    ───────────────────────────── */

    useEffect(() => {

        if (situation === "Student") {
            dispatch(
                getAllSclasses(adminID, "Sclass")
            );
        }

    }, [adminID, dispatch, situation]);

    /* ─────────────────────────────
        LEGACY URL SUPPORT
    ───────────────────────────── */

    useEffect(() => {

        if (
            situation === "Class" &&
            !fromClass &&
            params.id
        ) {
            setFormData(prev => ({
                ...prev,
                sclassName: params.id
            }));
        }

    }, [params.id, situation, fromClass]);

    /* ─────────────────────────────
        HANDLERS
    ───────────────────────────── */

    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const showError = (message) => {
        setPopup({
            show: true,
            message
        });
    };

    const submitHandler = (event) => {

        event.preventDefault();

        if (!formData.sclassName) {
            showError("Please select a section.");
            return;
        }

        setLoader(true);

        dispatch(
            registerUser(
                {
                    ...formData,
                    adminID,
                    role: "Student",
                    attendance: []
                },
                "Student"
            )
        );
    };

    /* ─────────────────────────────
        STATUS
    ───────────────────────────── */

    useEffect(() => {

        if (status === 'added') {

            dispatch(underControl());
            navigate(-1);
        }

        else if (status === 'failed') {

            showError(
                response || "Unable to add student."
            );

            setLoader(false);
        }

        else if (status === 'error') {

            showError("Network Error");

            setLoader(false);
        }

    }, [status, response, navigate, dispatch]);

    /* ─────────────────────────────
        RENDER
    ───────────────────────────── */

    return (
        <>
            <FormCard>

                {/* ───────────────── HEADER ───────────────── */}

                <Box sx={{ textAlign: 'center', mb: 4 }}>

                    <Typography
                        component="h1"
                        sx={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: UI.textPrimary,
                            mb: 0.5
                        }}
                    >
                        Add Student
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: '0.875rem',
                            color: UI.textSecondary
                        }}
                    >
                        Create a complete student profile
                    </Typography>

                </Box>

                {/* ───────────────── FORM ───────────────── */}

                <Box
                    component="form"
                    onSubmit={submitHandler}
                >

                    <Stack spacing={4}>

                        {/* ───────────────── BASIC INFO ───────────────── */}

                        <Box>

                            <Typography sx={SECTION_TITLE}>
                                Basic Information
                            </Typography>

                            <Stack spacing={2.5}>

                                <StyledField
                                    label="Student Name"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    required
                                    fullWidth
                                />

                                <Stack {...ROW_PROPS}>

                                    <StyledField
                                        label="Roll Number"
                                        type="number"
                                        value={formData.rollNum}
                                        onChange={handleChange('rollNum')}
                                        required
                                        fullWidth
                                    />

                                    <StyledField
                                        label="Password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange('password')}
                                        required
                                        fullWidth
                                    />

                                </Stack>

                                <Stack {...ROW_PROPS}>

                                    <StyledField
                                        label="Admission Date"
                                        type="date"
                                        value={formData.admissionDate}
                                        onChange={handleChange('admissionDate')}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />

                                    <StyledField
                                        label="Date of Birth"
                                        type="date"
                                        value={formData.dob}
                                        onChange={handleChange('dob')}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />

                                </Stack>

                                <Stack {...ROW_PROPS}>

                                    <StyledField
                                        select
                                        label="Gender"
                                        value={formData.gender}
                                        onChange={handleChange('gender')}
                                        fullWidth
                                    >
                                        <MenuItem value="Male">
                                            Male
                                        </MenuItem>

                                        <MenuItem value="Female">
                                            Female
                                        </MenuItem>

                                        <MenuItem value="Other">
                                            Other
                                        </MenuItem>

                                    </StyledField>

                                    <StyledField
                                        label="Category"
                                        placeholder="OBC / SC / ST / General"
                                        value={formData.category}
                                        onChange={handleChange('category')}
                                        fullWidth
                                    />

                                </Stack>

                            </Stack>

                        </Box>

                        <Divider />

                        {/* ───────────────── CLASS ASSIGNMENT ───────────────── */}

                        <Box>

                            <Typography sx={SECTION_TITLE}>
                                Class Assignment
                            </Typography>

                            <Stack spacing={2.5}>

                                {fromClass && (
                                    <>
                                        <StyledField
                                            label="Class"
                                            value={prefilledClassName}
                                            disabled
                                            fullWidth
                                        />

                                        <Box>

                                            <Typography
                                                sx={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    color: UI.textSecondary,
                                                    mb: 1.5
                                                }}
                                            >
                                                Section
                                            </Typography>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 1
                                                }}
                                            >

                                                {prefilledSections.map((sec) => {

                                                    const selected =
                                                        formData.sclassName === sec._id;

                                                    return (
                                                        <Chip
                                                            key={sec._id}
                                                            label={`Section ${sec.sectionName}`}
                                                            onClick={() =>
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    sclassName: sec._id
                                                                }))
                                                            }
                                                            sx={{
                                                                fontWeight: 600,
                                                                fontSize: '0.8rem',
                                                                cursor: 'pointer',
                                                                borderRadius: UI.radiusSm,
                                                                border: `1px solid ${selected ? UI.accent : UI.border}`,
                                                                bgcolor: selected
                                                                    ? UI.accentSubtle
                                                                    : UI.surface,
                                                                color: selected
                                                                    ? UI.accent
                                                                    : UI.textSecondary,
                                                            }}
                                                        />
                                                    );
                                                })}

                                            </Box>

                                        </Box>
                                    </>
                                )}

                                {!fromClass &&
                                    situation === "Student" && (
                                        <StyledField
                                            select
                                            label="Class & Section"
                                            value={formData.sclassName}
                                            onChange={handleChange('sclassName')}
                                            required
                                            fullWidth
                                        >

                                            {[...sclassesList]
                                                .sort((a, b) => {

                                                    const classCompare =
                                                        a.sclassName.localeCompare(
                                                            b.sclassName,
                                                            undefined,
                                                            { numeric: true }
                                                        );

                                                    if (classCompare !== 0) {
                                                        return classCompare;
                                                    }

                                                    return a.sectionName.localeCompare(
                                                        b.sectionName
                                                    );

                                                })
                                                .map((item) => (
                                                    <MenuItem
                                                        key={item._id}
                                                        value={item._id}
                                                    >
                                                        {item.sclassName} — Section {item.sectionName}
                                                    </MenuItem>
                                                ))}

                                        </StyledField>
                                    )}

                            </Stack>

                        </Box>

                        <Divider />

                        {/* ───────────────── ADDRESS ───────────────── */}

                        <Box>

                            <Typography sx={SECTION_TITLE}>
                                Address Information
                            </Typography>

                            <StyledField
                                label="Address"
                                multiline
                                minRows={3}
                                value={formData.address}
                                onChange={handleChange('address')}
                                fullWidth
                            />

                        </Box>

                        <Divider />

                        {/* ───────────────── PARENT INFO ───────────────── */}

                        <Box>

                            <Typography sx={SECTION_TITLE}>
                                Parent / Guardian Information
                            </Typography>

                            <Stack spacing={2.5}>

                                <Stack {...ROW_PROPS}>

                                    <StyledField
                                        label="Father Name"
                                        value={formData.fatherName}
                                        onChange={handleChange('fatherName')}
                                        fullWidth
                                    />

                                    <StyledField
                                        label="Father Phone"
                                        value={formData.fatherPhone}
                                        onChange={handleChange('fatherPhone')}
                                        fullWidth
                                    />

                                </Stack>

                                <Stack {...ROW_PROPS}>

                                    <StyledField
                                        label="Mother Name"
                                        value={formData.motherName}
                                        onChange={handleChange('motherName')}
                                        fullWidth
                                    />

                                    <StyledField
                                        label="Mother Phone"
                                        value={formData.motherPhone}
                                        onChange={handleChange('motherPhone')}
                                        fullWidth
                                    />

                                </Stack>

                                <Stack {...ROW_PROPS}>

                                    <StyledField
                                        label="Guardian Name"
                                        value={formData.guardianName}
                                        onChange={handleChange('guardianName')}
                                        fullWidth
                                    />

                                    <StyledField
                                        label="Guardian Relation"
                                        placeholder="Father / Uncle / Aunt"
                                        value={formData.guardianRelation}
                                        onChange={handleChange('guardianRelation')}
                                        fullWidth
                                    />

                                </Stack>

                                <StyledField
                                    label="Guardian Phone"
                                    value={formData.guardianPhone}
                                    onChange={handleChange('guardianPhone')}
                                    fullWidth
                                />

                            </Stack>

                        </Box>

                        <Divider />

                        {/* ───────────────── MEDICAL ───────────────── */}

                        <Box>

                            <Typography sx={SECTION_TITLE}>
                                Medical Information
                            </Typography>

                            <Stack {...ROW_PROPS}>

                                <StyledField
                                    label="Blood Group"
                                    value={formData.bloodGroup}
                                    onChange={handleChange('bloodGroup')}
                                    fullWidth
                                />

                                <StyledField
                                    label="Medical History"
                                    value={formData.medicalHistory}
                                    onChange={handleChange('medicalHistory')}
                                    fullWidth
                                />

                            </Stack>

                        </Box>

                        {/* ───────────────── ACTIONS ───────────────── */}

                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1.5,
                                pt: 1,
                                flexDirection: {
                                    xs: 'column',
                                    sm: 'row'
                                }
                            }}
                        >

                            <AppButton
                                variant="ghost"
                                fullWidth
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </AppButton>

                            <AppButton
                                fullWidth
                                type="submit"
                                loading={loader}
                            >
                                Add Student
                            </AppButton>

                        </Box>

                    </Stack>

                </Box>

            </FormCard>

            <Popup
                message={popup.message}
                showPopup={popup.show}
                setShowPopup={(val) =>
                    setPopup(prev => ({
                        ...prev,
                        show: val
                    }))
                }
            />
        </>
    );
};

export default AddStudent;