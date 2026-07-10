import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminRegisterPage = lazy(() => import('./pages/admin/AdminRegisterPage'));

const App = () => {
  const { currentRole } = useSelector(state => state.user);
  const isAuthResolved = currentRole !== null && currentRole !== undefined;

  return (
    <Router>
      <Suspense fallback={<div style={{ height: "100vh" }} />}>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Navigate to="/AdminLogin" replace />} />
          <Route path="/AdminLogin" element={<LoginPage role="Admin" />} />
          <Route path="/Studentlogin" element={<LoginPage role="Student" />} />
          <Route path="/Teacherlogin" element={<LoginPage role="Teacher" />} />
          <Route path="/AdminRegister" element={<AdminRegisterPage />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/Admin/*"
            element={
              !isAuthResolved ? null :
              currentRole === "Admin"
                ? <AdminDashboard />
                : <Navigate to="/AdminLogin" />
            }
          />

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;