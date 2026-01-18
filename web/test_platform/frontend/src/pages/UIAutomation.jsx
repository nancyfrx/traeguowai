import React from 'react';
import { Monitor, Play, RotateCw, Video, AlertCircle } from 'lucide-react';

const UIAutomation = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pt-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">UI Automation</h2>
          <p className="text-gray-500 text-sm mt-1">Selenium / Playwright Test Runner</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors">
          <Play className="w-4 h-4" />
          Run All Tests
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Status Overview */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl card-hover flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-black">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Active Nodes</p>
              <h3 className="text-2xl font-bold text-gray-900">4 / 6</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl card-hover flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <RotateCw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Running Jobs</p>
              <h3 className="text-2xl font-bold text-gray-900">2</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl card-hover flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Failed Steps</p>
              <h3 className="text-2xl font-bold text-gray-900">0</h3>
            </div>
          </div>
        </div>

        {/* Live View */}
        <div className="lg:col-span-3 bg-white rounded-2xl card-hover overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Video className="w-4 h-4 text-red-500 animate-pulse" />
              Live Execution
            </h3>
            <span className="text-xs font-mono text-gray-400">Node-1: Chrome 114.0</span>
          </div>
          <div className="aspect-video bg-gray-900 flex items-center justify-center relative group cursor-pointer">
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="glass-btn px-6 py-2 rounded-full text-white font-bold border-white/20 hover:bg-white/20">View Stream</button>
            </div>
            <p className="text-gray-500 font-mono text-sm">
              [14:23:01] Opening https://example.com<br/>
              [14:23:02] Click element #login-btn<br/>
              [14:23:03] Waiting for navigation...
            </p>
          </div>
        </div>

        {/* Recent Runs */}
        <div className="bg-white rounded-2xl card-hover p-6">
          <h3 className="font-bold text-gray-900 mb-4">Recent Runs</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-800">Checkout Flow</h4>
                  <p className="text-xs text-gray-400">2 mins ago</p>
                </div>
                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">#42{i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIAutomation;
