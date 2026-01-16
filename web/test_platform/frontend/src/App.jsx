import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AIGenerator from './pages/AIGenerator';
import CaseManagement from './pages/CaseManagement';
import InterfaceTest from './pages/InterfaceTest';
import UIAutomation from './pages/UIAutomation';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const base = import.meta.env.MODE === 'production' ? '/testplatform' : '';

  return (
    <Router basename={base}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ai-generator" element={<AIGenerator />} />
          <Route path="case-management" element={<CaseManagement />} />
          <Route path="interface-test" element={<InterfaceTest />} />
          <Route path="ui-automation" element={<UIAutomation />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
