import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, AlertCircle, CheckCircle2, ArrowLeft, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import bgGradient from '../assets/bg-gradient.png';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset Password
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/auth/forgot-password', { email });
      setStep(2);
      setSuccess('验证码已发送至您的邮箱');
    } catch (err) {
      setError(err.response?.data?.error || '发送失败，请检查邮箱是否正确');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      const encryptedData = {
        email,
        code: formData.code,
        newPassword: btoa(formData.newPassword),
        confirmPassword: btoa(formData.confirmPassword)
      };

      await axios.post('/auth/reset-password', encryptedData);
      setSuccess('密码重置成功！正在跳转至登录页...');
      setTimeout(() => {
        navigate('/login', { state: { message: '密码已重置，请重新登录。' } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || '重置失败，验证码可能已过期');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-white overflow-hidden font-sans">
      {/* Background - Same as login/register */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div 
          className="absolute bottom-0 left-0 w-full h-[70%] bg-cover bg-center origin-bottom-left -skew-y-6 transform translate-y-[60%]"
          style={{ backgroundImage: `url(${bgGradient})` }}
        ></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-[480px] bg-white rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] p-12 animate-fade-in-up border border-gray-100">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#1a1f36] mb-3">重置您的密码</h1>
            <p className="text-[#4f566b] text-[15px] leading-relaxed">
              {step === 1 
                ? "输入您的账户关联的邮件地址，我们会给您发送一个重置密码的验证码。" 
                : "请输入您邮箱收到的 6 位验证码，并设置您的新密码。"}
            </p>
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

          {step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-[14px] font-bold text-[#1a1f36] mb-2">
                  邮件地址 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 pl-10 bg-white border border-[#e3e8ee] rounded-lg shadow-sm text-[#1a1f36] font-bold placeholder-[#aab7c4] focus:outline-none focus:ring-2 focus:ring-[#635bff] transition-all text-[15px]"
                    placeholder="name@example.com"
                    required
                    autoComplete="off"
                  />
                  <Mail className="w-4 h-4 text-[#1a1f36] absolute left-3.5 top-3.5" />
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
                    '发送验证码'
                  )}
                </button>

              <div className="text-center">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-[#635bff] hover:text-[#423ba0] font-medium text-[14px]">
                  返回登录
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5" autoComplete="off">
              <div>
                <label className="block text-[14px] font-bold text-[#1a1f36] mb-2">
                  验证码 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength="6"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full h-11 px-4 pl-10 bg-white border border-[#e3e8ee] rounded-lg shadow-sm text-[#1a1f36] font-bold placeholder-[#aab7c4] focus:outline-none focus:ring-2 focus:ring-[#635bff] transition-all text-[15px] tracking-widest"
                    placeholder="请输入6位验证码"
                    required
                    autoComplete="off"
                  />
                  <ShieldCheck className="w-4 h-4 text-[#1a1f36] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#1a1f36] mb-2">
                  新密码 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full h-11 px-4 pl-10 pr-10 bg-white border border-[#e3e8ee] rounded-lg shadow-sm text-[#1a1f36] font-bold placeholder-[#aab7c4] focus:outline-none focus:ring-2 focus:ring-[#635bff] transition-all text-[15px]"
                    placeholder="至少6个字符"
                    required
                    autoComplete="new-password"
                  />
                  <Lock className="w-4 h-4 text-[#1a1f36] absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[#1a1f36] hover:text-[#000000] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#1a1f36] mb-2">
                  确认新密码 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full h-11 px-4 pl-10 pr-10 bg-white border border-[#e3e8ee] rounded-lg shadow-sm text-[#1a1f36] font-bold placeholder-[#aab7c4] focus:outline-none focus:ring-2 focus:ring-[#635bff] transition-all text-[15px]"
                    placeholder="请再次输入新密码"
                    required
                    autoComplete="new-password"
                  />
                  <Lock className="w-4 h-4 text-[#1a1f36] absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-[#1a1f36] hover:text-[#000000] transition-colors"
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
                    '重置密码'
                  )}
                </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-[#635bff] hover:text-[#423ba0] font-medium text-[14px] mt-2 flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> 返回上一步
              </button>
            </form>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-6 left-0 w-full flex justify-center text-[#8792a2] text-xs gap-6 z-10">
        <span>© Test Platform</span>
        <span className="hover:text-[#3c4257] cursor-pointer transition-colors">隐私政策 & 条款</span>
      </div>
    </div>
  );
};

export default ForgotPassword;
