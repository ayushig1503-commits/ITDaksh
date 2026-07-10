import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Box, 
    Typography, 
    Checkbox, 
    FormControlLabel, 
    OutlinedInput, // Changed to OutlinedInput for cleaner rendering without floating labels
    FormHelperText,
    FormControl,
    InputAdornment, 
    IconButton,
    Stack,
    Link,
    Container
} from '@mui/material';
import { Visibility, VisibilityOff, ChevronLeft } from '@mui/icons-material';
import styled from 'styled-components';

import { registerUser } from '../../redux/userRelated/userHandle';
import Popup from '../../components/Popup';
import AppButton from '../../components/ui/AppButton'; 
import { UI } from '../../theme/constants';

const AdminRegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

    const [toggle, setToggle] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [errors, setErrors] = useState({
        adminName: false,
        schoolName: false,
        email: false,
        password: false
    });

    const role = "Admin";

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('adminName');
        const schoolName = data.get('schoolName');
        const email = data.get('email');
        const password = data.get('password');

        if (!name || !schoolName || !email || !password) {
            setErrors({
                adminName: !name,
                schoolName: !schoolName,
                email: !email,
                password: !password
            });
            return;
        }

        // Verify with your backend if key should be 'name' or 'adminName'
        const fields = { name, email, password, role, schoolName };
        setLoader(true);
        dispatch(registerUser(fields, role));
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        setErrors(prev => ({ ...prev, [name]: false }));
    };

    useEffect(() => {
        if (status === 'success' || (currentUser !== null && currentRole === 'Admin')) {
            navigate('/Admin');
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error' || error) { // CRITICAL FIX: Turned off loader if standard network error hits
            setLoader(false);
            if (error) {
                setMessage(typeof error === 'string' ? error : "An error occurred");
                setShowPopup(true);
            }
        }
    }, [status, currentUser, currentRole, navigate, error, response]);

    return (
        <PageWrap>
            <BackNav onClick={() => navigate(-1)}>
                <ChevronLeft sx={{ fontSize: 18, mr: 0.5 }} /> Back
            </BackNav>

            <Container maxWidth="sm">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    
                    <Typography variant="h1" sx={{ textAlign: 'center', mb: 1 }}>
                        Institution Portal
                    </Typography>
                    
                    <Typography variant="body2" sx={{ textAlign: 'center', mb: 5, color: UI.textSecondary, maxWidth: 420 }}>
                        Initialize your digital management system. Register your school 
                        to begin managing faculty, students, and curriculum.
                    </Typography>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
                        <Stack spacing={2.5}>
                            
                            {/* CRITICAL UI FIX: Wrapped inputs in proper FormControls to layout correctly without built-in labels */}
                            <FormControl error={errors.adminName} fullWidth>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: UI.textSecondary }}>
                                    Full Name
                                </Typography>
                                <OutlinedInput
                                    required
                                    id="adminName" name="adminName"
                                    autoComplete="name" autoFocus
                                    placeholder="Enter your full name"
                                    onChange={handleInputChange}
                                />
                                {errors.adminName && <FormHelperText>Name is required</FormHelperText>}
                            </FormControl>

                            <FormControl error={errors.schoolName} fullWidth>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: UI.textSecondary }}>
                                    Institution Name
                                </Typography>
                                <OutlinedInput
                                    required
                                    id="schoolName" name="schoolName"
                                    placeholder="Enter school name"
                                    onChange={handleInputChange}
                                />
                                {errors.schoolName && <FormHelperText>School name is required</FormHelperText>}
                            </FormControl>

                            <FormControl error={errors.email} fullWidth>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: UI.textSecondary }}>
                                    Official Email Address
                                </Typography>
                                <OutlinedInput
                                    required
                                    id="email" name="email"
                                    autoComplete="email"
                                    placeholder="email@institution.com"
                                    onChange={handleInputChange}
                                />
                                {errors.email && <FormHelperText>Email is required</FormHelperText>}
                            </FormControl>

                            <FormControl error={errors.password} fullWidth>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: UI.textSecondary }}>
                                    Secure Password
                                </Typography>
                                <OutlinedInput
                                    required
                                    name="password"
                                    type={toggle ? 'text' : 'password'}
                                    id="password"
                                    placeholder="••••••••"
                                    onChange={handleInputChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setToggle(!toggle)} edge="end">
                                                {toggle ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                {errors.password && <FormHelperText>Password is required</FormHelperText>}
                            </FormControl>
                        </Stack>
                        
                        <Box sx={{ mt: 1.5 }}>
                            <FormControlLabel
                                control={<Checkbox value="remember" required />}
                                label="Agree to Terms & Conditions"
                            />
                        </Box>

                        <AppButton
                            type="submit"
                            fullWidth
                            loading={loader}
                            sx={{ mt: 4, mb: 3 }}
                        >
                            Complete Registration
                        </AppButton>

                        <Typography variant="body2" sx={{ textAlign: 'center', color: UI.textSecondary }}>
                            Already a member?{' '}
                            <Link component={RouterLink} to="/AdminLogin" sx={{ fontWeight: 600 }}>
                                Log in here
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </PageWrap>
    );
}

const PageWrap = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${UI.background};
    padding: 40px;
    position: relative;
`;

const BackNav = styled.button`
    position: absolute;
    top: 40px;
    left: 40px;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-family: inherit;
    font-size: ${UI.typography.label.fontSize};
    color: ${UI.textSecondary};
    font-weight: 500;
    padding: 8px;
    border-radius: ${UI.radiusXs};
    transition: all 0.2s;

    &:hover {
        color: ${UI.textPrimary};
        background-color: ${UI.backgroundSubtle};
    }
`;

export default AdminRegisterPage;