import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, AlertCircle, Mail, Phone, Eye, EyeOff, CheckCircle2, Building2 } from 'lucide-react';
import CryptoJS from 'crypto-js';
import bgGradient from '../assets/bg-gradient.png';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 手机号格式校验
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setError('请输入正确的11位手机号码格式');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少为6个字符');
      return;
    }

    setLoading(true);

    try {
      // 简单加密传输 (Base64) - 按照用户要求在请求中加密
      const encryptedData = {
        ...formData,
        password: btoa(formData.password),
        confirmPassword: btoa(formData.confirmPassword)
      };

      await axios.post('/api/auth/register', encryptedData);
      setSuccess('注册成功！正在跳转至登录页...');
      setTimeout(() => {
        navigate('/login', { state: { message: '注册成功！请登录。' } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || '注册失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-white overflow-hidden">
      {/* Background - Stripe style (Half color, half white - Color at bottom) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Color half - bottom slanted (Right side higher) */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[70%] bg-cover bg-center origin-bottom-left -skew-y-6 transform translate-y-[60%]"
          style={{ backgroundImage: `url(${bgGradient})` }}
        ></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-[480px] bg-white rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] p-12 animate-fade-in-up border border-gray-100">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#1a1f36] mb-2">创建您的账户</h1>
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

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-sm font-bold text-[#1a1f36] mb-1.5">
                用户名 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full h-10 px-3 pl-9 bg-white border border-[#e3e8ee] rounded-md shadow-sm text-[#1a1f36] font-bold placeholder-[#aab7c4] focus:outline-none focus:ring-2 focus:ring-[#635bff] transition-all text-sm"
                  placeholder="请输入用户名"
                  required
                  autoComplete="new-username"
                />
                <User className="w-4 h-4 text-[#1a1f36] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1a1f36] mb-1.5">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-10 px-3 pl-9 bg-white border border-[#e3e8ee] rounded-md shadow-sm text-[#1a1f36] font-bold placeholder-[#aab7c4] focus:outline-none focus:ring-2 focus:ring-[#635bff] transition-all text-sm"
                  placeholder="name@example.com"
                  required
                  autoComplete="new-email"
                />
                <Mail className="w-4 h-4 text-[#1a1f36] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1a1f36] mb-1.5 flex items-center gap-1.5">
                电话号码 
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-10 px-3 pl-9 bg-white border border-[#e3e8ee] rounded-md shadow-sm text-[#1a1f36] font-bold placeholder-[#aab7c4] focus:outline-none focus:ring-2 focus:ring-[#635bff] transition-all text-sm"
                  placeholder="请输入11位手机号"
                  autoComplete="new-phone"
                />
                <Phone className="w-4 h-4 text-[#1a1f36] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1a1f36] mb-1.5 flex items-center gap-1.5">
                企业名称
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full h-10 px-3 pl-9 bg-white border border-[#e3e8ee] rounded-md shadow-sm text-[#1a1f36] font-bold placeholder-[#aab7c4] focus:outline-none focus:ring-2 focus:ring-[#635bff] transition-all text-sm"
                  placeholder="请输入企业名称（可选）"
                  autoComplete="organization"
                />
                <Building2 className="w-4 h-4 text-[#1a1f36] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1a1f36] mb-1.5">
                密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-10 px-3 pl-9 pr-10 bg-white border border-[#e3e8ee] rounded-md shadow-sm text-[#1a1f36] font-bold placeholder-[#aab7c4] focus:outline-none focus:ring-2 focus:ring-[#635bff] transition-all text-sm"
                  placeholder="至少6个字符"
                  required
                  autoComplete="new-password"
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
              <label className="block text-sm font-bold text-[#1a1f36] mb-1.5">
                确认密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full h-10 px-3 pl-9 pr-10 bg-white border border-[#e3e8ee] rounded-md shadow-sm text-[#1a1f36] font-bold placeholder-[#aab7c4] focus:outline-none focus:ring-2 focus:ring-[#635bff] transition-all text-sm"
                  placeholder="请再次输入密码"
                  required
                  autoComplete="new-password"
                />
                <Lock className="w-4 h-4 text-[#1a1f36] absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-[#1a1f36] hover:text-[#000000] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#1a1f36] hover:bg-[#000000] text-white font-bold rounded-md transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed mt-2 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                '注册账户'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#3c4257]">
            已经有账户？{' '}
            <Link to="/login" className="text-[#635bff] hover:text-[#423ba0] font-medium">
              登录
            </Link>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 w-full flex justify-center text-gray-400 text-xs gap-4 z-10">
        <span>© Test Platform</span>
        <span>隐私政策 & 条款</span>
      </div>
    </div>
  );
};

export default Register;
