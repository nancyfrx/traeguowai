import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Send } from 'lucide-react';
import { subscriptionApi } from '../api';

const SubscriptionModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    setStatus(null);
    try {
      await subscriptionApi.subscribe(email);
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus(null);
        setEmail('');
      }, 2000);
    } catch (error) {
      console.error('Subscription failed:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-zinc-950 p-8 rounded-[1px] shadow-2xl z-[101] border border-zinc-100 dark:border-zinc-900"
          >
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                <Mail className="text-zinc-900 dark:text-white" size={28} />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black italic tracking-tight">订阅如雪艺术</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                  订阅以获取每周艺术与文化动态。我们将为您随机推送一篇精选艺术解析。
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="输入您的电子邮箱..."
                    required
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[1px] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-sm"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-[1px] hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>立即订阅</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </form>

              {status === 'success' && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-600 dark:text-green-400 text-xs font-bold"
                >
                  感谢订阅！首篇文章已准备就绪。
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 dark:text-red-400 text-xs font-bold"
                >
                  订阅失败，请检查网络后重试。
                </motion.p>
              )}

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 pt-4 border-t border-zinc-50 dark:border-zinc-900">
                已有超过 15,000 名艺术爱好者加入
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;
