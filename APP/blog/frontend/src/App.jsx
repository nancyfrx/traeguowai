import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Sun, Moon, Search, Menu, X, Github, Twitter, Rss, Bell } from 'lucide-react';

import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ArticleEdit from './pages/ArticleEdit';
import Marketplace from './pages/Marketplace';
import SubscriptionModal from './components/SubscriptionModal';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const GeometricIcon = ({ className }) => (
  <div className={`relative w-8 h-8 flex items-center justify-center ${className}`}>
    <div className="absolute inset-0 border-2 border-current transform rotate-45" />
    <div className="absolute inset-1 border border-current" />
    <div className="w-1.5 h-1.5 bg-current" />
  </div>
);

const Navbar = ({ isDark, setIsDark }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isArticleDetail = location.pathname.startsWith('/article/');
  const isMarketPage = location.pathname === '/market';
  const isTransparentHeroPage = isHomePage || isArticleDetail;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-900 py-4' 
          : isTransparentHeroPage ? 'bg-transparent py-8' : 'bg-white dark:bg-black py-6'
      }`}>
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="text-3xl font-black tracking-tighter italic flex items-center gap-4 group">
            <GeometricIcon className={!isScrolled && isTransparentHeroPage ? 'text-white' : 'text-black dark:text-white'} />
            <span className={!isScrolled && isTransparentHeroPage ? 'text-white' : 'text-black dark:text-white'}>如雪艺术博客</span>
          </Link>

          {/* 极简菜单 */}
          <div className={`hidden md:flex items-center gap-10 text-[13px] font-black uppercase tracking-[0.3em] ${
            !isScrolled && isTransparentHeroPage ? 'text-white/70' : 'text-zinc-500'
          }`}>
            <Link to="/" className={`hover:text-black dark:hover:text-white transition-colors ${isHomePage ? 'text-black dark:text-white' : ''}`}>首页</Link>
            <Link to="/market" className={`hover:text-black dark:hover:text-white transition-colors ${isMarketPage ? 'text-rose-500' : ''}`}>艺术市场</Link>
            <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">特色专题</Link>
            <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">关于我们</Link>
            {user && <Link to="/admin/dashboard" className="text-rose-500">管理后台</Link>}
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className={`p-2 rounded-full transition-colors ${
                !isScrolled && isHomePage ? 'text-white hover:bg-white/10' : 'text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              title="订阅周刊"
            >
              <Bell size={18} />
            </button>
            <button 
              onClick={() => setIsDark(!isDark)} 
              className={`p-2 rounded-full transition-colors ${
                !isScrolled && isHomePage ? 'text-white hover:bg-white/10' : 'text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link 
              to="/admin/article/new"
              className={`hidden md:block px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                !isScrolled && isHomePage 
                  ? 'bg-white text-black hover:bg-zinc-200' 
                  : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'
              }`}
            >
              发布作品
            </Link>
          </div>
        </div>
      </nav>
      <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

const Footer = () => (
  <footer className="bg-white dark:bg-black mt-20">
    {/* 画廊风格横幅 */}
    <div className="max-w-[1600px] mx-auto px-6 mb-20">
      <div className="relative h-[400px] w-full overflow-hidden rounded-sm group">
        <img 
          src="https://images.unsplash.com/photo-1493306454983-c5c073fba6bd?q=80&w=2000&auto=format&fit=crop" 
          alt="Art Gallery" 
          className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
        />
        {/* 文字叠加层 */}
        <div className="absolute inset-0 p-10 flex flex-col justify-between text-white font-medium tracking-widest text-xs uppercase">
          <div className="flex justify-between items-start">
            <span className="backdrop-blur-sm bg-black/10 px-2 py-1">离线...</span>
            <span className="backdrop-blur-sm bg-black/10 px-2 py-1">画廊由</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-lg font-black tracking-tighter italic">如雪艺术博客</span>
            <span className="backdrop-blur-sm bg-black/10 px-2 py-1">243 Bowery NYC</span>
          </div>
        </div>
      </div>
    </div>

    {/* 底部链接 */}
    <div className="max-w-[1600px] mx-auto px-6 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-20 border-t border-zinc-100 dark:border-zinc-900">
        {/* 左侧：支持 */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center gap-3 text-zinc-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer group">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <span className="text-xs font-black uppercase tracking-widest">技术支持</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer group">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <span className="text-xs font-black uppercase tracking-widest">帮助中心</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer group">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            </div>
            <span className="text-xs font-black uppercase tracking-widest">如雪.XYZ</span>
          </div>
        </div>

        {/* 中间：社交 */}
        <div className="md:col-span-2 flex gap-6 items-start justify-center md:justify-start">
          <Twitter size={20} className="text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors" />
          <Github size={20} className="text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors" />
          <Rss size={20} className="text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors" />
        </div>

        {/* 右侧：法律与资源 */}
        <div className="md:col-span-3 space-y-4">
          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">服务与隐私</p>
          <ul className="space-y-4 text-xs font-bold text-zinc-500">
            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">服务条款</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">隐私声明</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">举报内容</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Cookie 设置</a></li>
          </ul>
        </div>

        <div className="md:col-span-2 space-y-4">
          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">社区与销售</p>
          <ul className="space-y-4 text-xs font-bold text-zinc-500">
            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">社区准则</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">私人销售</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">$如雪 桥接</a></li>
          </ul>
        </div>

        {/* 版权 */}
        <div className="md:col-span-2 flex flex-col items-end justify-start space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            © 2026 如雪艺术博客
          </p>
        </div>
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
          <Route path="/market" element={<Marketplace />} />
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
