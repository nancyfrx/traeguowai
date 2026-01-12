import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Sun, Moon, Search, Menu, X, Github, Twitter, Rss } from 'lucide-react';

import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ArticleEdit from './pages/ArticleEdit';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Navbar = ({ isDark, setIsDark }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-900 py-4' 
        : isHomePage ? 'bg-transparent py-8' : 'bg-white dark:bg-black py-6'
    }`}>
      <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter italic flex items-center gap-2">
          <span className={!isScrolled && isHomePage ? 'text-white' : 'text-black dark:text-white'}>中文艺术博客.</span>
        </Link>

        {/* 极简菜单 */}
        <div className={`hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] ${
          !isScrolled && isHomePage ? 'text-white/70' : 'text-zinc-500'
        }`}>
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">艺术市场</Link>
          <Link to="/admin/article/new" className="hover:text-black dark:hover:text-white transition-colors text-rose-500 font-black">发布作品</Link>
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">特色专题</Link>
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">关于我们</Link>
          {user && <Link to="/admin/dashboard" className="text-rose-500">管理后台</Link>}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsDark(!isDark)} 
            className={`p-2 rounded-full transition-colors ${
              !isScrolled && isHomePage ? 'text-white hover:bg-white/10' : 'text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className={`hidden md:block px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            !isScrolled && isHomePage 
              ? 'bg-white text-black hover:bg-zinc-200' 
              : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'
          }`}>
            连接钱包
          </button>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="border-t border-zinc-100 dark:border-zinc-900 py-32 px-6 bg-white dark:bg-black">
    <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
      <div className="space-y-10">
        <h3 className="text-3xl font-black uppercase tracking-tighter italic">中文艺术博客.</h3>
        <p className="text-sm text-zinc-500 leading-relaxed max-w-xs font-medium">
          全球领先的数字艺术画廊。在这里发现并收藏独一无二的数字艺术作品，探索创意的无限可能。
        </p>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm">
            <Github size={18} />
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm">
            <Twitter size={18} />
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-black mb-10 text-[10px] uppercase tracking-[0.4em] text-zinc-300">艺术市场</h4>
        <ul className="space-y-6 text-xs font-black uppercase tracking-[0.2em]">
          <li><a href="#" className="hover:text-zinc-400 transition-colors">所有作品</a></li>
          <li><a href="#" className="hover:text-zinc-400 transition-colors">系列专题</a></li>
          <li><a href="#" className="hover:text-zinc-400 transition-colors">艺术家</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-black mb-10 text-[10px] uppercase tracking-[0.4em] text-zinc-300">关于</h4>
        <ul className="space-y-6 text-xs font-black uppercase tracking-[0.2em]">
          <li><a href="#" className="hover:text-zinc-400 transition-colors">我们的故事</a></li>
          <li><a href="#" className="hover:text-zinc-400 transition-colors">职业机会</a></li>
          <li><a href="#" className="hover:text-zinc-400 transition-colors">联系我们</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-black mb-10 text-[10px] uppercase tracking-[0.4em] text-zinc-300">资源</h4>
        <ul className="space-y-6 text-xs font-black uppercase tracking-[0.2em]">
          <li><a href="#" className="hover:text-zinc-400 transition-colors">帮助中心</a></li>
          <li><a href="#" className="hover:text-zinc-400 transition-colors">社区准则</a></li>
          <li><a href="#" className="hover:text-zinc-400 transition-colors">技术支持</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-[1600px] mx-auto mt-32 pt-12 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
        © 2024 中文艺术博客. ALL RIGHTS RESERVED.
      </p>
      <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
        <a href="#" className="hover:text-black dark:hover:text-white transition-colors">隐私政策</a>
        <a href="#" className="hover:text-black dark:hover:text-white transition-colors">服务条款</a>
      </div>
    </div>
  </footer>
);

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/article/new" element={
            <ProtectedRoute>
              <ArticleEdit />
            </ProtectedRoute>
          } />
          <Route path="/admin/article/edit/:id" element={
            <ProtectedRoute>
              <ArticleEdit />
            </ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default App;
