import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AIGenerator from './pages/AIGenerator';
import CaseManagement from './pages/CaseManagement';
import InterfaceTest from './pages/InterfaceTest';
import UIAutomation from './pages/UIAutomation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
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
