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

  // Clean data comes directly from AuthForm
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
        serverError={error}
      />
      {status === 'error' && <Popup message={error} />}
    </>
  );
};

export default LoginPage;