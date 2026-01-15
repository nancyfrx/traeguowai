import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import logo from '../assets/logo.png';
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
  Menu
} from 'lucide-react';

const Layout = () => {
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
        </nav>

        {/* User Profile Bottom */}
        <div className="p-6 border-t border-gray-50">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-100">
            <img src="https://ui-avatars.com/api/?name=Feng+Ruxue&background=000000&color=ffffff" className="w-9 h-9 rounded-full ring-2 ring-gray-100" alt="User" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Feng Ruxue</p>
              <p className="text-[11px] text-gray-400 truncate uppercase tracking-wider font-medium">Admin</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#fcfcfc]">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 z-10">
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
            <button className="glass-btn p-2.5 rounded-full text-gray-500 hover:text-black" title="Switch Theme">
              <Moon className="w-5 h-5" />
            </button>
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
