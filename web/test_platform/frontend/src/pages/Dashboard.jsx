import React from 'react';
import { Users, Activity, DollarSign, CheckCircle, BarChart2, PieChart } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pt-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl card-hover">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <Users className="w-5 h-5 text-gray-700" />
            </div>
            <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
              12%
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">1,234</h3>
            <p className="text-sm font-medium text-gray-400 mt-1">Total Test Cases</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl card-hover">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <Activity className="w-5 h-5 text-gray-700" />
            </div>
            <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
              5.2%
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">856</h3>
            <p className="text-sm font-medium text-gray-400 mt-1">Executions Today</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl card-hover">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-gray-700" />
            </div>
            <span className="flex items-center text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md">
              2.4%
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">42</h3>
            <p className="text-sm font-medium text-gray-400 mt-1">Bugs Found</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl card-hover">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-gray-700" />
            </div>
            <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
              1.2%
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">98.5%</h3>
            <p className="text-sm font-medium text-gray-400 mt-1">Pass Rate</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
