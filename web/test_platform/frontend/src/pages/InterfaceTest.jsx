import React from 'react';
import { Zap, Play, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';

const InterfaceTest = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pt-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Interface Testing</h2>
          <p className="text-gray-500 text-sm mt-1">API automation and validation</p>
        </div>
        <div className="flex gap-3">
          <button className="glass-btn px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 text-gray-600 hover:text-black">
            <Clock className="w-4 h-4" />
            History
          </button>
          <button className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar List */}
        <div className="bg-white rounded-2xl card-hover overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-50 bg-gray-50/30">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Collections</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {['Auth API', 'User Management', 'Product Service', 'Payment Gateway', 'Notification'].map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-700 text-sm">{item}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">{5 + idx} reqs</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className={idx % 2 === 0 ? "text-green-600" : "text-orange-500"}>●</span>
                  Last run: 2h ago
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Request Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl card-hover p-6">
            <div className="flex gap-3 mb-4">
              <select className="bg-gray-50 border-none rounded-lg text-sm font-bold text-gray-700 focus:ring-2 focus:ring-black/5 py-2.5 px-4 w-28">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
              <input type="text" placeholder="Enter request URL" className="flex-1 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-black/5 px-4" defaultValue="https://api.example.com/v1/users" />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Play className="w-4 h-4" /> Send
              </button>
            </div>

            <div className="flex gap-6 border-b border-gray-100 mb-4">
              {['Params', 'Headers', 'Body', 'Auth'].map((tab, i) => (
                <button key={tab} className={`pb-3 text-sm font-medium transition-colors relative ${i === 0 ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                  {tab}
                  {i === 0 && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-t-full"></span>}
                </button>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 h-48 border border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">
              No parameters configured
            </div>
          </div>

          <div className="bg-white rounded-2xl card-hover flex-1 flex flex-col p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Response</h3>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1 text-green-600 font-bold"><CheckCircle className="w-3 h-3" /> 200 OK</span>
                <span>245ms</span>
                <span>1.2KB</span>
              </div>
            </div>
            <div className="flex-1 bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-auto">
              {`{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Feng Ruxue",
        "role": "Admin"
      }
    ]
  }
}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterfaceTest;
