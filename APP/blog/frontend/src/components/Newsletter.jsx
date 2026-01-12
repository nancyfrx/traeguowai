import React, { useState } from 'react';
import { subscriptionApi } from '../api';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    setStatus(null);
    try {
      await subscriptionApi.subscribe(email);
      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Subscription failed:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-32 py-24 text-center border-t border-zinc-100 dark:border-zinc-900">
      <div className="max-w-2xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold tracking-tight italic">订阅以获取每周艺术与文化动态</h2>
        <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="输入您的电子邮箱..."
            required
            className="w-full px-8 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-zinc-400 border-t-white rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            )}
          </button>
        </form>
        
        {status === 'success' && (
          <p className="text-green-600 dark:text-green-400 text-xs font-bold animate-fade-in">感谢您的订阅！随机文章已发送至您的模拟收件箱。</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 dark:text-red-400 text-xs font-bold animate-fade-in">订阅失败，请稍后重试。</p>
        )}

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          已有超过 15,000 名订阅者。无垃圾邮件，仅限优质内容。
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
