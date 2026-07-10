import { useState } from 'react';
import {
  Box, Checkbox, FormControl, FormHelperText, FormControlLabel,
  IconButton, InputAdornment, OutlinedInput, Typography,
  Stack, Container, Link
} from '@mui/material';
import { Visibility, VisibilityOff, ChevronLeft } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import AppButton from './AppButton';
import { UI } from '../../theme/constants';

const AuthForm = ({ role, fields, onSubmit, loading, errors = {}, title = "Log in to" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <PageWrap>
      <BackNav onClick={() => navigate(-1)}>
        <ChevronLeft sx={{ fontSize: 18, mr: 0.5 }} /> Back
      </BackNav>

      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* CRITICAL FIX: Made dynamic using the title prop */}
          <Typography variant="h1" sx={{ textAlign: 'center', mb: 1 }}>
            {title} {role} Portal
          </Typography>
          
          <Typography variant="body2" sx={{ textAlign: 'center', mb: 5, color: UI.textSecondary }}>
            Enter your credentials to access your dashboard.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', maxWidth: 400 }}>
            <Stack spacing={2.5}>
              {fields.map((field) => (
                <FormControl key={field.name} error={!!errors[field.name]} fullWidth>
                  <Typography component="label" htmlFor={field.name} variant="body2" sx={{ mb: 1, fontWeight: 500, color: UI.textSecondary, display: 'block' }}>
                    {field.label}
                  </Typography>
                  
                  <OutlinedInput
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    autoFocus={field.autoFocus}
                    // CRITICAL FIX: Ensures field data safety during validation re-renders
                    defaultValue={field.defaultValue || ''} 
                    type={field.type === 'password' ? (showPassword ? 'text' : 'password') : field.type}
                    endAdornment={field.type === 'password' && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )}
                  />
                  {errors[field.name] && <FormHelperText>{errors[field.name]}</FormHelperText>}
                </FormControl>
              ))}
            </Stack>

            {role !== 'Student' && title === "Log in to" && ( // Only show if it's actually a login action
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Remember me"
                />
                <Link component={RouterLink} to="/forgot-password">
                  Forgot password?
                </Link>
              </Box>
            )}

            <Box sx={{ mt: 3 }}>
              <AppButton type="submit" fullWidth loading={loading}>
                Continue
              </AppButton>
            </Box>

            {role === 'Admin' && title === "Log in to" && (
              <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: UI.textMuted }}>
                Need a portal?{' '}
                <Link component={RouterLink} to="/AdminRegister" sx={{ fontWeight: 600 }}>
                  Create one
                </Link>
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </PageWrap>
  );
};

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
  position: absolute; top: 40px; left: 40px;
  background: none; border: none;
  display: flex; align-items: center;
  cursor: pointer; 
  font-family: inherit;
  font-size: ${UI.typography.label.fontSize};
  color: ${UI.textSecondary};
  font-weight: 500;
  &:hover { color: ${UI.textPrimary}; }
`;

export default AuthForm;