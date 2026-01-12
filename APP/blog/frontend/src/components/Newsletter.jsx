import React from 'react';

const Newsletter = () => (
  <section className="mt-32 py-24 text-center border-t border-zinc-100 dark:border-zinc-900">
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Subscribe for weekly updates on art and culture</h2>
      <div className="relative max-w-lg mx-auto">
        <input 
          type="email" 
          placeholder="Enter your email..."
          className="w-full px-8 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
        </button>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
        Over 15,000 subscribers. No spam, just quality content.
      </p>
    </div>
  </section>
);

export default Newsletter;
