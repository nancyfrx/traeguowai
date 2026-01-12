import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  RefreshCw, 
  Volume2, 
  Maximize2, 
  MoreHorizontal,
  Info,
  Activity,
  Tag,
  Share2,
  Heart,
  Check,
  CreditCard,
  Smartphone,
  X
} from 'lucide-react';
import { articleApi } from '../api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Details');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handlePayment = () => {
    if (!selectedMethod) return;
    // 模拟支付过程
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentSuccess(true);
      setSelectedMethod(null);
      setTimeout(() => setPaymentSuccess(false), 3000);
    }, 800);
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await articleApi.getById(id);
        setArticle(res.data);
      } catch (error) {
        console.error('Failed to fetch article details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) return <div className="min-h-screen flex items-center justify-center">作品未找到</div>;

  const metadata = [
    { label: 'Medium', value: 'Video (MP4)' },
    { label: 'File Size', value: '166.4 MB' },
    { label: 'Dimensions', value: '1920 × 1080' },
    { label: 'Contract Address', value: '0xa25...0C446' },
    { label: 'Token Standard', value: 'ERC-721' },
    { label: 'Blockchain', value: 'Ethereum' },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-[1600px] mx-auto min-h-screen bg-white dark:bg-black">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Side: Image Display */}
        <div className="space-y-6">
          <div className="relative aspect-square bg-zinc-50 dark:bg-zinc-900/50 rounded-xl flex items-center justify-center p-12 overflow-hidden shadow-inner">
            <img 
              src={article.coverImage} 
              alt={article.title}
              className="max-w-full max-h-full object-contain 
                shadow-[0_30px_60px_rgba(0,0,0,0.4)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.8)]
                ring-1 ring-black/5 dark:ring-white/10"
            />
            
            {/* Control Icons */}
            <div className="absolute bottom-6 right-6 flex items-center gap-3">
              <button className="p-2.5 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg hover:bg-white dark:hover:bg-black transition-all shadow-sm">
                <RefreshCw size={16} />
              </button>
              <button className="p-2.5 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg hover:bg-white dark:hover:bg-black transition-all shadow-sm">
                <Volume2 size={16} />
              </button>
              <button className="p-2.5 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg hover:bg-white dark:hover:bg-black transition-all shadow-sm">
                <Maximize2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Information */}
        <div className="space-y-10">
          <div className="flex items-start justify-between">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-2">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all">
                  <ChevronLeft size={20} />
                </button>
                <MoreHorizontal size={20} className="text-zinc-400 cursor-pointer" />
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {article.title}
              </h1>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200">
                  <img 
                    src={article.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.id}`} 
                    alt="Author" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {article.author?.nickname || '艺术家'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Current Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-zinc-900 dark:text-white">
                    {article.price ? article.price.toFixed(3) : (article.likeCount / 1000).toFixed(3)}Ξ
                  </span>
                  <span className="text-zinc-400 font-bold">
                    (${(article.price ? article.price * 3100 : article.likeCount * 3.1).toFixed(0)})
                  </span>
                </div>
              </div>
            </div>

            <button 
              className="w-full py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-sm rounded-xl transition-all
                shadow-[0_8px_0_0_#444] dark:shadow-[0_8px_0_0_#ccc]
                hover:shadow-[0_4px_0_0_#444] dark:hover:shadow-[0_4px_0_0_#ccc] hover:translate-y-[4px]
                active:shadow-none active:translate-y-[8px]"
              onClick={() => setShowPaymentModal(true)}
            >
              BUY
            </button>
          </div>

          {/* Tabs */}
          <div className="space-y-8">
            <div className="flex items-center gap-10 border-b border-zinc-100 dark:border-zinc-900">
              {['Details', 'Activity', 'Traits'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-[11px] font-black uppercase tracking-widest relative transition-all ${
                    activeTab === tab 
                      ? 'text-black dark:text-white' 
                      : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="tabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[100px]">
              {activeTab === 'Details' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {article.summary || "She loves how it feels and does it again and again."}
                  </p>

                  {/* Collection Box */}
                  <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-6 group cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-all">
                      <img src={article.coverImage} alt="Collection" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Collection</p>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-rose-500 transition-colors">
                        Blossom <span className="text-zinc-400 ml-1">#2 of 2</span>
                      </h4>
                    </div>
                  </div>

                  {/* Metadata Table */}
                  <div className="grid grid-cols-2 gap-y-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    {metadata.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">{item.label}</p>
                        <p className="text-[12px] font-bold text-zinc-900 dark:text-zinc-100">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">选择支付方式</h2>
                  <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'wechat', name: '微信支付', icon: Smartphone, color: 'text-green-500', bg: 'bg-green-50' },
                    { id: 'alipay', name: '支付宝', icon: Smartphone, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { id: 'card', name: '银行卡', icon: CreditCard, color: 'text-orange-500', bg: 'bg-orange-50' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full flex items-center justify-between p-6 rounded-xl transition-all group border ${
                        selectedMethod === method.id 
                          ? 'bg-zinc-100 dark:bg-zinc-800 border-black dark:border-white' 
                          : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full ${method.bg} dark:bg-opacity-10 flex items-center justify-center`}>
                          <method.icon className={method.color} size={24} />
                        </div>
                        <span className="font-bold text-zinc-900 dark:text-white">{method.name}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedMethod === method.id 
                          ? 'border-black dark:border-white bg-black dark:bg-white' 
                          : 'border-zinc-200 group-hover:border-black dark:group-hover:border-white'
                      }`}>
                        {selectedMethod === method.id && <Check size={12} className="text-white dark:text-black" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handlePayment}
                    disabled={!selectedMethod}
                    className={`w-full py-5 font-black uppercase tracking-[0.2em] text-sm rounded-xl transition-all
                      ${selectedMethod 
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-[0_8px_0_0_#444] dark:shadow-[0_8px_0_0_#ccc] hover:shadow-[0_4px_0_0_#444] dark:hover:shadow-[0_4px_0_0_#ccc] hover:translate-y-[4px] active:shadow-none active:translate-y-[8px]' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                      }`}
                  >
                    立即支付
                  </button>
                </div>

                <p className="text-center text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
                  安全支付保障 · 极速确认
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-[200] bg-white dark:bg-zinc-900 px-8 py-4 rounded-full shadow-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check size={18} className="text-white" />
            </div>
            <span className="text-sm font-black uppercase tracking-widest">支付成功</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
