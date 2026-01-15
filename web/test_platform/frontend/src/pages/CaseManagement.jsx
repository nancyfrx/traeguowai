import React from 'react';
import { FolderOpen, Plus, Filter, MoreHorizontal } from 'lucide-react';

const CaseManagement = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pt-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Cases</h2>
          <p className="text-gray-500 text-sm mt-1">Manage and organize your test scenarios</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4" />
          New Case
        </button>
      </div>

      <div className="bg-white rounded-2xl card-hover overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="relative">
              <input type="text" placeholder="Search cases..." className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-black/5 w-64" />
              <FolderOpen className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <button className="glass-btn px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 flex items-center gap-2">
            <Filter className="w-3 h-3" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-xs uppercase font-bold text-gray-400 tracking-wider">
              <tr>
                <th className="px-8 py-5">ID</th>
                <th className="px-8 py-5">Title</th>
                <th className="px-8 py-5">Module</th>
                <th className="px-8 py-5">Priority</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5 font-mono text-gray-400">TC-00{item}</td>
                  <td className="px-8 py-5 font-semibold text-gray-900">Verify user login with valid credentials</td>
                  <td className="px-8 py-5 text-gray-500">Authentication</td>
                  <td className="px-8 py-5"><span className="text-orange-500 font-bold text-xs">P{item % 3 + 1}</span></td>
                  <td className="px-8 py-5"><span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-green-50 text-green-600 border border-green-100">ACTIVE</span></td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-gray-400 hover:text-black transition-colors p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
          <span>Showing 1-5 of 24 results</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded hover:bg-gray-100">Prev</button>
            <button className="px-3 py-1 rounded bg-black text-white">1</button>
            <button className="px-3 py-1 rounded hover:bg-gray-100">2</button>
            <button className="px-3 py-1 rounded hover:bg-gray-100">3</button>
            <button className="px-3 py-1 rounded hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseManagement;
