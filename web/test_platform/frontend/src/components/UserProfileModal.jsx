import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building2, 
  Phone, 
  Mail, 
  Settings, 
  FileText, 
  MessageSquare,
  Camera,
  Check,
  AlertCircle,
  LogOut,
  Users
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfileModal = ({ isOpen, onClose, username, onUpdateSuccess, onLogout }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: username || '',
    companyName: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserInfo();
    }
  }, [isOpen]);

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/user/info');
      setUserInfo(response.data);
    } catch (err) {
      console.error('Failed to fetch user info', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop to close on click outside */}
      <div className="fixed inset-0 z-[90]" onClick={onClose}></div>
      
      {/* Dropdown container - Redesigned vertical card */}
      <div className="absolute top-full right-0 mt-3 w-[360px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in slide-in-from-top-2 duration-200 z-[100] border border-gray-100 flex flex-col">
        
        {/* Header Background - Black/White/Gray Gradient */}
        <div className="h-32 bg-gradient-to-br from-gray-900 via-gray-500 to-gray-100 relative">
          {/* Top Right Icon */}
          <button className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-xl transition-colors text-white backdrop-blur-md">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="px-6 pb-6 -mt-12 relative flex flex-col">
          {/* Large Avatar */}
          <div className="relative inline-block self-start">
            <div className="relative group">
              <img 
                src={`https://robohash.org/${userInfo.username}?set=set3`} 
                className="w-28 h-28 rounded-2xl bg-white ring-8 ring-white shadow-xl group-hover:opacity-90 transition-all object-cover" 
                alt="Avatar" 
              />
              <button className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-500 hover:text-black transition-all hover:scale-110 active:scale-95">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User Basic Info */}
          <div className="mt-4 space-y-1">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{userInfo.username}</h2>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">{userInfo.companyName || '未设置公司'}</span>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 shadow-sm">
                <Check className="w-3 h-3 fill-current" />
                <span className="text-[10px] font-bold">高级认证</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4 group cursor-pointer p-1 -ml-1 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">邮箱</span>
                <span className="text-sm font-semibold text-gray-700">{userInfo.email || '未设置'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 group cursor-pointer p-1 -ml-1 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-green-500 transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">电话</span>
                <span className="text-sm font-semibold text-gray-700">{userInfo.phone || '未设置'}</span>
              </div>
            </div>
          </div>

          {/* Action Menu Items */}
          <div className="mt-8 pt-6 border-t border-gray-50 space-y-1">
            <button 
              onClick={() => {
                navigate('/department-management');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-2xl transition-all group"
            >
              <Users className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
              部门管理
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-2xl transition-all group">
              <Settings className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
              个人设置
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-2xl transition-all group">
              <FileText className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
              帮助文档
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-2xl transition-all group">
              <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
              联系我们
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
            >
              <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-500 transition-colors" />
              退出登录
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileModal;
