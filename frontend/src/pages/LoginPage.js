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

  const fieldErrors = useMemo(() => {
    if (!error || typeof error !== 'string') return {};
    
    const lowerError = error.toLowerCase();
    const mapped = {};

    // 1. Check for password errors
    if (lowerError.includes('password')) {
      mapped.password = error;
    } 
    
    // 2. Check for email/user errors (Independent 'if' allows both to trigger!)
    if (lowerError.includes('email') || lowerError.includes('user not found')) {
      mapped.email = error;
    } 
    
    // 3. Check for student unique identifiers
    if (lowerError.includes('roll')) {
      mapped.rollNumber = error;
    } 
    if (lowerError.includes('student name')) {
      mapped.studentName = error;
    }

    // 4. Fallback: If it's a generic validation message that didn't catch above, highlight everything
    if (Object.keys(mapped).length === 0) {
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