import React from 'react';
import { Database } from 'lucide-react';

const DataFactory = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Database className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">数据工厂</h1>
      </div>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        <Database className="w-16 h-16 text-gray-200 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">数据工厂功能开发中</h2>
        <p className="text-gray-500">Data Factory feature is under development</p>
      </div>
    </div>
  );
};

export default DataFactory;
