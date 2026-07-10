import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/ui/AuthForm';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const LoginPage = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { status, currentRole, loading, error } = useSelector(state => state.user);

  const fields = useMemo(() => {
    const common = [{ name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' }];
    
    if (role === 'Student') {
      return [
        { name: 'rollNumber', label: 'Roll Number', type: 'number', placeholder: 'e.g. 2024001' },
        { name: 'studentName', label: 'Student Name', type: 'text', placeholder: 'Full Name' },
        ...common
      ];
    }
    return [
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@school.edu', autoFocus: true },
      ...common
    ];
  }, [role]);

  // CRITICAL FIX: Map the backend string error to specific form fields so AuthForm can display them inline
  const fieldErrors = useMemo(() => {
    if (!error || typeof error !== 'string') return {};
    
    const lowerError = error.toLowerCase();
    const mapped = {};

    if (lowerError.includes('password')) {
      mapped.password = error;
    } else if (lowerError.includes('email') || lowerError.includes('user not found')) {
      mapped.email = error;
    } else if (lowerError.includes('roll')) {
      mapped.rollNumber = error;
    } else if (lowerError.includes('name')) {
      mapped.studentName = error;
    } else {
      // Fallback for general errors (like "All fields are required")
      fields.forEach(field => {
        mapped[field.name] = error;
      });
    }
    return mapped;
  }, [error, fields]);

  const handleLogin = (data) => {
    dispatch(loginUser(data, role));
  };

  useEffect(() => {
    if (status === 'success' && currentRole) {
      navigate(`/${currentRole}`, { replace: true });
    }
  }, [status, currentRole, navigate]);

  return (
    <>
      <AuthForm
        role={role}
        fields={fields}
        onSubmit={handleLogin}
        loading={loading}
        errors={fieldErrors} // FIXED: Changed from serverError={error} to match AuthForm's API
      />
      {status === 'error' && <Popup message={error} />}
    </>
  );
};

export default LoginPage;