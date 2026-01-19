import React, { useState } from 'react';
import { Users, Activity, DollarSign, CheckCircle, BarChart2, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: '支付中心', score: 85 },
  { name: '用户中心', score: 92 },
  { name: '商品中心', score: 78 },
  { name: '订单中心', score: 88 },
  { name: '物流中心', score: 95 },
  { name: '营销中心', score: 82 },
  { name: '数据中心', score: 90 },
];

const Dashboard = () => {
  const [chartType, setChartType] = useState('line');

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

      {/* Line/Bar Chart Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 card-hover">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">各部门质量评分趋势</h3>
            <p className="text-sm font-medium text-gray-400 mt-1">Quality Scores by Department</p>
          </div>
          <button 
            onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
            className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-100 hover:border-gray-200 group shadow-sm active:scale-95"
            title={chartType === 'line' ? '切换为柱状图' : '切换为折线图'}
          >
            {chartType === 'line' ? (
              <BarChart2 className="w-5 h-5 text-gray-700 group-hover:text-black" />
            ) : (
              <TrendingUp className="w-5 h-5 text-gray-700 group-hover:text-black" />
            )}
          </button>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} 
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} 
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}
                  cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#000000" 
                  strokeWidth={2}
                  dot={{ r: 5, fill: '#ffffff', strokeWidth: 2, stroke: '#000000' }}
                  activeDot={{ r: 7, fill: '#000000', stroke: '#fff', strokeWidth: 2 }}
                  animationDuration={1500}
                />
              </LineChart>
            ) : (
              <BarChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} 
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} 
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}
                  cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
                />
                <Bar 
                  dataKey="score" 
                  fill="#4b5563" 
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
