import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  X,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [currentDept, setCurrentDept] = useState({ id: null, name: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);

  useEffect(() => {
    fetchDepartments();
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('/api/user/info');
      if (response.data && response.data.companyName) {
        setCompanyName(response.data.companyName);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/departments');
      if (Array.isArray(response.data)) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type, dept = { id: null, name: '' }) => {
    setModalType(type);
    setCurrentDept(dept);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!currentDept.name.trim()) {
      alert('请输入部门名称');
      return;
    }

    try {
      if (modalType === 'add') {
        await axios.post('/api/departments', { name: currentDept.name });
      } else {
        await axios.put(`/api/departments/${currentDept.id}`, { name: currentDept.name });
      }
      setIsModalOpen(false);
      fetchDepartments();
    } catch (error) {
      console.error('Failed to save department:', error);
      alert(error.response?.data?.error || '保存失败');
    }
  };

  const handleDelete = async () => {
    if (!deptToDelete) return;
    
    setIsDeleting(true);
    try {
      await axios.delete(`/api/departments/${deptToDelete.id}`);
      setDeptToDelete(null);
      fetchDepartments();
    } catch (error) {
      console.error('Failed to delete department:', error);
      alert(error.response?.data?.error || '删除失败');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-black text-white text-[10px] font-black rounded-md uppercase tracking-widest">
              {companyName || 'Corporate'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Users className="w-10 h-10" />
            部门管理
          </h1>
          <p className="text-gray-500 font-medium mt-2">管理您的企业部门架构</p>
        </div>
        <button 
          onClick={() => handleOpenModal('add')}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          新增部门
        </button>
      </div>

      {/* Search & Stats */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="relative w-full md:w-96 group">
          <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" />
          <input 
            type="text" 
            placeholder="搜索部门名称..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-100 transition-all font-medium"
          />
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">部门总数</span>
            <span className="text-xl font-black text-gray-900">{departments.length}</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <span className="font-bold">加载中...</span>
          </div>
        ) : filteredDepartments.length > 0 ? (
          filteredDepartments.map(dept => (
            <div key={dept.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                <button 
                  onClick={() => handleOpenModal('edit', dept)}
                  className="p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-400 hover:text-black transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setDeptToDelete(dept)}
                  className="p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-400 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all mb-4">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">{dept.name}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Department ID: {dept.id}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
            <Users className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-bold text-lg">暂无部门数据</p>
            <p className="text-sm">点击右上角新增一个部门吧</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 flex justify-between items-center border-b border-gray-50">
              <h2 className="text-2xl font-black text-gray-900">{modalType === 'add' ? '新增部门' : '编辑部门'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">部门名称</label>
                <input 
                  type="text" 
                  value={currentDept.name}
                  onChange={(e) => setCurrentDept({ ...currentDept, name: e.target.value })}
                  placeholder="例如：研发部、产品部..."
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gray-100 transition-all"
                  autoFocus
                />
              </div>
            </div>
            <div className="px-8 py-6 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-black transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                className="flex-[2] bg-black text-white py-3 rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-95"
              >
                保存部门
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deptToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">确认删除？</h3>
              <p className="text-gray-500 font-medium mb-8">
                您确定要删除部门 <span className="text-black font-bold">“{deptToDelete.name}”</span> 吗？此操作不可撤销。
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeptToDelete(null)}
                  className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-black transition-colors"
                  disabled={isDeleting}
                >
                  取消
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 text-white py-3 rounded-2xl text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;