import React, { useState } from 'react';
import { ShoppingCart, Search, ChevronLeft, CreditCard, Check, Package, Clock } from 'lucide-react';
import { mockProducts, mockOrders as initialOrders } from '../data';
import { cn } from '../utils';

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState('shop'); // 'shop' or 'orders'
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('wechat'); // 'wechat', 'alipay', 'card'

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showMessage = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleAddToCart = (product) => {
    setCart([...cart, { ...product, cartId: Date.now() }]);
    showMessage(`已将 ${product.name} 加入购物车`);
  };

  const startCheckout = (product) => {
    setCheckoutItem(product);
    setShowPayment(true);
  };

  const handlePayment = () => {
    // Simulate payment process
    setTimeout(() => {
      const newOrder = {
        id: 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        name: checkoutItem.name,
        price: checkoutItem.price,
        status: '已支付',
        time: new Date().toLocaleString(),
        image: checkoutItem.image,
        method: paymentMethod
      };
      setOrders([newOrder, ...orders]);
      setShowPaymentSuccess(true);
      setShowPayment(false);
      setCheckoutItem(null);
      setSelectedProduct(null);
      
      // If paying from cart, remove that item (simpler to just clear for now or find by id)
      if (showCart) {
        setCart([]); // Clear cart for simplicity in this mock
        setShowCart(false);
      }
      
      setTimeout(() => {
        setShowPaymentSuccess(false);
        setActiveTab('orders');
      }, 2000);
    }, 1000);
  };

  const renderPaymentModal = () => {
    if (!showPayment || !checkoutItem) return null;
    return (
      <div className="fixed inset-0 z-[150] bg-black/90 flex flex-col animate-slide-up">
        <div className="p-4 flex items-center bg-zinc-900">
          <button onClick={() => setShowPayment(false)} className="p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="flex-1 text-center font-bold">确认支付</h2>
          <div className="w-10" />
        </div>

        <div className="flex-1 p-6 space-y-8">
          <div className="text-center space-y-2">
            <p className="text-white/60 text-sm">支付金额</p>
            <p className="text-4xl font-bold font-mono text-tiktok-red">¥{checkoutItem.price}</p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-4 space-y-4">
            <p className="text-sm font-bold text-white/40 mb-2">选择支付方式</p>
            
            <button 
              onClick={() => setPaymentMethod('wechat')}
              className={cn("w-full flex items-center justify-between p-4 rounded-xl border transition-all", 
                paymentMethod === 'wechat' ? "border-green-500 bg-green-500/10" : "border-white/5 bg-white/5")}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">微信支付</span>
              </div>
              {paymentMethod === 'wechat' && <Check className="w-5 h-5 text-green-500" />}
            </button>

            <button 
              onClick={() => setPaymentMethod('alipay')}
              className={cn("w-full flex items-center justify-between p-4 rounded-xl border transition-all", 
                paymentMethod === 'alipay' ? "border-blue-500 bg-blue-500/10" : "border-white/5 bg-white/5")}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">支</div>
                <span className="font-bold">支付宝</span>
              </div>
              {paymentMethod === 'alipay' && <Check className="w-5 h-5 text-blue-500" />}
            </button>

            <button 
              onClick={() => setPaymentMethod('card')}
              className={cn("w-full flex items-center justify-between p-4 rounded-xl border transition-all", 
                paymentMethod === 'card' ? "border-yellow-500 bg-yellow-500/10" : "border-white/5 bg-white/5")}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">银行卡支付</span>
              </div>
              {paymentMethod === 'card' && <Check className="w-5 h-5 text-yellow-500" />}
            </button>
          </div>
        </div>

        <div className="p-4 pb-10 bg-zinc-950 border-t border-white/10">
          <button 
            onClick={handlePayment}
            className="w-full bg-tiktok-red py-4 rounded-full font-bold text-lg active:scale-95 transition-transform"
          >
            立即支付 ¥{checkoutItem.price}
          </button>
        </div>
      </div>
    );
  };

  const renderCart = () => {
    if (!showCart) return null;
    return (
      <div className="fixed inset-0 z-[120] bg-black flex flex-col animate-slide-up">
        <div className="p-4 flex items-center bg-zinc-900">
          <button onClick={() => setShowCart(false)} className="p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="flex-1 text-center font-bold">购物车 ({cart.length})</h2>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-4">
              <ShoppingCart className="w-16 h-16" />
              <p>购物车还是空的</p>
              <button 
                onClick={() => setShowCart(false)}
                className="px-8 py-2 border border-white/20 rounded-full text-white"
              >
                去逛逛
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.cartId} className="bg-zinc-900 rounded-xl p-3 flex space-x-4">
                <img src={item.image} className="w-20 h-20 rounded-lg object-cover" alt="" />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold line-clamp-2">{item.name}</p>
                    <button onClick={() => setCart(cart.filter(c => c.cartId !== item.cartId))} className="text-white/20 text-xs">移除</button>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-tiktok-red font-bold">¥{item.price}</span>
                    <button 
                      onClick={() => startCheckout(item)}
                      className="bg-tiktok-red px-4 py-1.5 rounded-full text-xs font-bold"
                    >
                      去结算
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderProductDetail = () => {
    if (!selectedProduct) return null;
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-slide-up">
        <div className="p-4 flex items-center bg-zinc-900 sticky top-0">
          <button onClick={() => setSelectedProduct(null)} className="p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="flex-1 text-center font-bold">商品详情</h2>
          <div className="w-10" />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <img src={selectedProduct.image} alt="" className="w-full aspect-square object-cover" />
          <div className="p-4 space-y-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-tiktok-red text-3xl font-bold font-mono">¥{selectedProduct.price}</span>
              <span className="text-white/40 text-sm line-through">¥{parseInt(selectedProduct.price) + 100}</span>
            </div>
            <h1 className="text-xl font-bold leading-snug">{selectedProduct.name}</h1>
            <p className="text-white/60 text-sm leading-relaxed">{selectedProduct.description}</p>
            
            <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center text-sm">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-tiktok-red" />
                <span>快递免运费</span>
              </div>
              <span className="text-white/40">24小时内发货</span>
            </div>

            <div className="py-4 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">保障</span>
                <span className="flex-1 ml-4">假一赔十 · 极速退款 · 七天无理由</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">选择</span>
                <span className="flex-1 ml-4">默认规格</span>
                <span className="text-white/20">{'>'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 flex space-x-3 pb-8 bg-zinc-950">
          <button 
            onClick={() => handleAddToCart(selectedProduct)}
            className="flex-1 bg-white/10 py-3 rounded-full font-bold flex items-center justify-center space-x-2 active:scale-95 transition-transform"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>加入购物车</span>
          </button>
          <button 
            onClick={() => startCheckout(selectedProduct)}
            className="flex-1 bg-tiktok-red py-3 rounded-full font-bold flex items-center justify-center space-x-2 active:scale-95 transition-transform"
          >
            <CreditCard className="w-5 h-5" />
            <span>立即购买</span>
          </button>
        </div>
      </div>
    );
  };

  const renderOrders = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-white/40">
          <Package className="w-16 h-16 mb-4" />
          <p>暂无订单</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="bg-zinc-900 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40">订单号: {order.id}</span>
              <span className="text-tiktok-red font-bold">{order.status}</span>
            </div>
            <div className="flex space-x-3">
              <img src={order.image} className="w-20 h-20 rounded-lg object-cover" alt="" />
              <div className="flex-1 flex flex-col justify-between">
                <p className="text-sm font-bold line-clamp-2">{order.name}</p>
                <div className="flex justify-between items-baseline">
                  <span className="text-white/60 text-xs">{order.time}</span>
                  <span className="font-bold">¥{order.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="flex-1 bg-zinc-950 flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <div className="p-4 bg-zinc-900 flex flex-col space-y-4 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">抖音商城</h1>
          <div className="flex space-x-4">
            <Search className="w-6 h-6" />
            <div className="relative cursor-pointer" onClick={() => setShowCart(true)}>
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-tiktok-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-8 text-sm">
          <button 
            onClick={() => setActiveTab('shop')}
            className={cn("pb-2 relative font-bold", activeTab === 'shop' ? "text-white" : "text-white/40")}
          >
            逛一逛
            {activeTab === 'shop' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-tiktok-red rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={cn("pb-2 relative font-bold", activeTab === 'orders' ? "text-white" : "text-white/40")}
          >
            我的订单
            {activeTab === 'orders' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-tiktok-red rounded-full" />}
          </button>
        </div>
      </div>
      
      {/* Content Area - Ensure it fills space and scrolls */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'shop' ? (
          <div className="p-2 grid grid-cols-2 gap-2 pb-32">
            {mockProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-zinc-900 rounded-lg overflow-hidden active:scale-95 transition-transform cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
                <div className="p-2">
                  <p className="text-sm line-clamp-2 h-10 leading-tight">{product.name}</p>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-tiktok-red font-bold text-lg">¥{product.price}</span>
                    <span className="text-zinc-500 text-[10px]">已售{product.sales}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pb-32">
            {renderOrders()}
          </div>
        )}
      </div>

      {/* Overlays */}
      {renderProductDetail()}
      {renderCart()}
      {renderPaymentModal()}
      
      {showPaymentSuccess && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex flex-col items-center justify-center animate-fade-in">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <Check className="w-12 h-12 text-white" />
          </div>
          <p className="mt-4 text-xl font-bold">支付成功</p>
          <p className="text-white/60 mt-2">订单已生成，请等待发货</p>
        </div>
      )}

      {showToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[300] bg-zinc-800/90 text-white px-6 py-3 rounded-full flex items-center gap-2 animate-fade-in">
          <Check className="w-5 h-5 text-green-500" />
          {toastMsg}
        </div>
      )}
    </div>
  );
}
