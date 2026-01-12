import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight } from 'lucide-react';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login({ username, password });
      login(res.data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('登录失败，请检查用户名或密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-12 rounded-3xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-zinc-900 dark:bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <Lock className="text-white dark:text-zinc-900" size={28} />
          </div>
          <h1 className="text-3xl font-bold">后台管理</h1>
          <p className="text-zinc-500 mt-2">请登录以继续管理您的博客</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium px-1">用户名</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                placeholder="请输入用户名"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium px-1">密码</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                placeholder="请输入密码"
              />
            </div>
          </div>

          {error && <p className="text-rose-500 text-sm px-1">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2 group"
          >
            {loading ? '登录中...' : '立即登录'}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
