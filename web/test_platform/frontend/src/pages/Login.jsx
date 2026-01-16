import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, RefreshCw, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import bgGradient from '../assets/bg-gradient.png';

const Login = () => {
  const [formData, setFormData] = useState({
    username: localStorage.getItem('lastLoginUsername') || '',
    password: (() => {
      const saved = localStorage.getItem('lastLoginPassword');
      if (!saved) return '';
      try {
        return atob(saved);
      } catch (e) {
        return saved;
      }
    })(),
    captcha: ''
  });
  const [captchaImage, setCaptchaImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCaptcha = async () => {
    try {
      const response = await axios.get('/auth/captcha');
      setCaptchaImage(response.data.image);
    } catch (err) {
      console.error('获取验证码失败', err);
    }
  };

  useEffect(() => {
    fetchCaptcha();
    if (location.state?.message) {
      setSuccess(location.state.message);
      // 清除 state 避免刷新页面再次显示
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // 简单加密传输 (Base64)
      const encryptedData = {
        ...formData,
        password: btoa(formData.password)
      };

      await axios.post('/auth/login', encryptedData);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', formData.username);
      localStorage.setItem('lastLoginUsername', formData.username);
      localStorage.setItem('lastLoginPassword', btoa(formData.password));
      setSuccess('登录成功！正在跳转...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || '登录失败，请检查您的信息');
      fetchCaptcha();
      setFormData(prev => ({ ...prev, captcha: '' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-white overflow-hidden">
      {/* Top Left Logo/Text */}
      <div className="absolute top-8 left-8 z-20">
        <span className="text-2xl font-bold text-white drop-shadow-sm">Q-Lab</span>
      </div>

      {/* Background - Stripe style (Half color, half white) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Color half - top left slanted */}
        <div 
          className="absolute top-0 left-0 w-full h-[60%] bg-cover bg-center origin-top-left -skew-y-6 transform translate-y-[-20%]"
          style={{ backgroundImage: `url(${bgGradient})` }}
        ></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-[480px] bg-white rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] p-12 animate-fade-in-up border border-gray-100">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#1a1f36] mb-2">登录您的账户</h1>
            <p className="text-[#8792a2] text-sm">欢迎回到Q-Lab测试平台</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#1a1f36] mb-1.5">用户名 / 邮箱 / 手机号</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full h-10 px-3 pl-9 bg-white border border-[#e3e8ee] rounded-md shadow-sm text-[#1a1f36] font-bold placeholder-[#aab7c4] focus:outline-none focus:ring-2 focus:ring-[#635bff] transition-all text-sm"
                  placeholder="请输入用户名、邮箱或手机号"
                  required
                />
                <User className="w-4 h-4 text-[#1a1f36] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-bold text-[#1a1f36]">密码</label>
                <Link to="/forgot-password" size="sm" className="text-sm text-[#635bff] hover:text-[#423ba0]">忘记密码？</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-10 px-3 pl-9 pr-10 bg-white border border-[#e3e8ee] rounded-md shadow-sm text-[#1a1f36] font-bold placeholder-[#aab7c4] focus:outline-none focus:ring-2 focus:ring-[#635bff] transition-all text-sm"
                  placeholder="请输入密码"
                  required
                />
                <Lock className="w-4 h-4 text-[#1a1f36] absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#1a1f36] hover:text-[#000000] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1a1f36] mb-1.5">安全验证</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={formData.captcha}
                    onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-[#e3e8ee] rounded-md shadow-sm text-[#1a1f36] font-bold placeholder-[#aab7c4] focus:outline-none focus:ring-2 focus:ring-[#635bff] transition-all text-sm uppercase"
                    placeholder="请输入验证码"
                    required
                    maxLength={4}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-10 w-24 bg-gray-100 rounded-md overflow-hidden cursor-pointer border border-[#e3e8ee]"
                    onClick={fetchCaptcha}
                    title="点击刷新"
                  >
                    {captchaImage && <img src={captchaImage} alt="Captcha" className="w-full h-full object-cover" />}
                  </div>
                  <button
                    type="button"
                    onClick={fetchCaptcha}
                    className="p-2 text-[#697386] hover:text-[#3c4257] transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#1a1f36] hover:bg-[#000000] text-white font-bold rounded-md transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed mt-2 flex items-center justify-center"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                '登录'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#e3e8ee] text-center">
            <p className="text-[#3c4257] text-sm">
              还没有账号？{' '}
              <Link to="/register" className="text-[#635bff] font-semibold hover:text-[#423ba0] transition-colors">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-8 text-center relative z-10">
        <p className="text-[#8792a2] text-xs">
          &copy; 2026 Q-Lab Test Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
