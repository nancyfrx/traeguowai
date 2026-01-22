import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import UserProfileModal from './UserProfileModal';
import { 
  LayoutDashboard, 
  Sparkles, 
  FolderOpen, 
  Zap, 
  Monitor, 
  Layers, 
  Search, 
  Bell, 
  Moon, 
  ChevronRight,
  Menu,
  LogOut,
  Database,
  Repeat,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Feng Ruxue');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleUpdateSuccess = (newUsername) => {
    localStorage.setItem('username', newUsername);
    setUsername(newUsername);
  };

  return (
    <div className="bg-[#fcfcfc] text-gray-800 h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 z-20 hidden md:flex" id="sidebar">
        {/* Logo */}
        <div className="h-20 flex items-center px-8">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-gray-900">
            <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
              <img src={logo} className="w-full h-full object-contain" alt="Logo" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white shadow-lg shadow-gray-200 hidden">
                <Search className="w-6 h-6" />
              </div>
            </div>
            Q-Lab
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-6">
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard className="w-4 h-4" />
            数据大盘
          </NavLink>

          <NavLink to="/ai-generator" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Sparkles className="w-4 h-4" />
            AI 生成用例
          </NavLink>
          
          <NavLink to="/case-management" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <FolderOpen className="w-4 h-4" />
            用例管理
          </NavLink>
          
          <NavLink to="/interface-test" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Zap className="w-4 h-4" />
            接口测试
          </NavLink>
          
          <NavLink to="/ui-automation" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Monitor className="w-4 h-4" />
            UI 自动化
          </NavLink>

          <NavLink to="/data-factory" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Database className="w-4 h-4" />
            数据工厂
          </NavLink>

          <NavLink to="/traffic-replay" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Repeat className="w-4 h-4" />
            流量回放
          </NavLink>

          <NavLink to="/chaos-engineering" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <AlertTriangle className="w-4 h-4" />
            故障演练
          </NavLink>

          <NavLink to="/fund-security" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <ShieldCheck className="w-4 h-4" />
            资金安全
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#fcfcfc]">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 z-50">
          <div className="flex items-center gap-6">
            <button className="md:hidden text-gray-500 hover:text-gray-900 transition-colors" onClick={() => document.getElementById('sidebar').classList.toggle('hidden')}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors" />
              <input type="text" placeholder="Type to search..." className="pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-100 w-64 transition-all placeholder-gray-400 text-gray-700" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="glass-btn p-2.5 rounded-full relative text-gray-500 hover:text-black">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-3 w-2 h-2 bg-black rounded-full border-2 border-white"></span>
            </button>
            <button className="glass-btn p-2.5 rounded-full text-gray-500 hover:text-black mr-2" title="Switch Theme">
              <Moon className="w-5 h-5" />
            </button>
            
            {/* Simplified User Profile in header */}
            <div 
              className="relative"
            >
              <div 
                onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
                className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-100 group"
              >
                <img 
                  src={`https://robohash.org/${username}?set=set3`} 
                  className="w-10 h-10 rounded-xl bg-gray-50 ring-2 ring-white shadow-sm group-hover:shadow-md transition-all" 
                  alt="User" 
                />
              </div>

              {/* User Profile Modal / Dropdown */}
              <UserProfileModal 
                isOpen={isProfileModalOpen} 
                onClose={() => setIsProfileModalOpen(false)} 
                username={username}
                onUpdateSuccess={handleUpdateSuccess}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </header>

        {/* Main Scroll Area */}
        <main className="flex-1 overflow-y-auto px-8 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
