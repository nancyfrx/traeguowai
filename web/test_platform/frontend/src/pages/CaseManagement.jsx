import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  FolderOpen, Plus, Filter, MoreHorizontal, ChevronRight, ChevronDown, 
  Search, Play, Trash2, Edit2, FolderPlus, FilePlus, Layout,
  X, Home, Mail, PieChart, Flag, MessageSquare, Leaf,
  Save, Eye, Image as ImageIcon, List
} from 'lucide-react';
import axios from 'axios';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';

// Custom styles for WangEditor
const editorStyles = `
  .w-e-full-screen-container {
    z-index: 2100 !important;
  }
  .w-e-toolbar {
    border-top-left-radius: 12px !important;
    border-top-right-radius: 12px !important;
    border-color: #f3f4f6 !important;
    background: #f9fafb !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    scrollbar-width: none; /* Firefox */
  }
  .w-e-toolbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  .w-e-text-container {
    border-bottom-left-radius: 12px !important;
    border-bottom-right-radius: 12px !important;
    border-color: #f3f4f6 !important;
    min-height: 200px !important;
  }
  .editor-group:focus-within .w-e-toolbar,
  .editor-group:focus-within .w-e-text-container {
    border-color: #000 !important;
    transition: all 0.2s;
  }
  .w-e-text-placeholder {
    top: 20px !important;
    font-style: normal !important;
    color: #9ca3af !important;
  }
  /* Make toolbar buttons more compact */
  .w-e-bar-item {
    padding: 0 4px !important;
  }
  /* Hide text labels for specific menus and show icons */
  .w-e-bar-item[data-menu-key="fontFamily"] button span,
  .w-e-bar-item[data-menu-key="fontSize"] button span,
  .w-e-bar-item[data-menu-key="lineHeight"] button span {
    display: none !important;
  }
  .w-e-bar-item[data-menu-key="fontFamily"] button::before {
    content: 'F';
    font-weight: bold;
    font-family: serif;
  }
  .w-e-bar-item[data-menu-key="fontSize"] button::before {
    content: 'T';
    font-size: 14px;
    font-weight: bold;
  }
  .w-e-bar-item[data-menu-key="lineHeight"] button::before {
    content: '↕';
    font-weight: bold;
  }
  .preview-content {
    padding: 20px;
    min-height: 300px;
    line-height: 1.6;
  }
  .preview-content img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 10px 0;
  }
  .preview-content table {
    border-collapse: collapse;
    width: 100%;
    margin: 10px 0;
  }
  .preview-content table th,
  .preview-content table td {
    border: 1px solid #e5e7eb;
    padding: 8px 12px;
    text-align: left;
  }
  .preview-content table th {
    background-color: #f9fafb;
  }
`;

const CaseManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null); // { type: 'project' | 'module', id: number }
  const [testCases, setTestCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCaseIds, setSelectedCaseIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add'); // 'add', 'edit'
  const [drawerData, setDrawerData] = useState({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Modal State
  const [modalType, setModalType] = useState(null); // 'project', 'module'
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // WangEditor instances
  const [editorPre, setEditorPre] = useState(null);
  const [editorExp, setEditorExp] = useState(null);
  const [editorAct, setEditorAct] = useState(null);

  // WangEditor configs
  const toolbarConfig = useMemo(() => ({
    excludeKeys: [
      'fullScreen',
      'uploadVideo',
      'insertVideo',
      'group-video'
    ]
  }), []);

  const editorConfig = useMemo(() => ({
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        server: '/api/files/upload',
        fieldName: 'file',
        maxFileSize: 5 * 1024 * 1024, // 5MB
        base64LimitSize: 0, // 禁用 base64
        timeout: 10 * 1000, // 10s
        onBeforeUpload(file) {
          console.log('Before upload', file);
          return file;
        },
        onSuccess(file, res) {
          console.log('Upload success', file, res);
        },
        onFailed(file, res) {
          console.error('Upload failed', file, res);
        },
        onError(file, err, res) {
          console.error('Upload error', file, err, res);
        }
      }
    }
  }), []);

  // Timely destroy editors
  useEffect(() => {
    return () => {
      if (editorPre) editorPre.destroy();
      if (editorExp) editorExp.destroy();
      if (editorAct) editorAct.destroy();
    };
  }, [editorPre, editorExp, editorAct]);

  // Auto-save timer
  const autoSaveTimerRef = useRef(null);

  // Auto-save logic
  useEffect(() => {
    if (isDrawerOpen && drawerData.name) {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        localStorage.setItem('case_draft', JSON.stringify(drawerData));
        console.log('Draft auto-saved');
      }, 2000);
    }
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [drawerData, isDrawerOpen]);

  // 初始化获取部门
  useEffect(() => {
    fetchDepartments();
  }, []);

  // 切换部门时加载项目
  useEffect(() => {
    if (selectedDeptId) {
      fetchProjects(selectedDeptId);
    } else {
      setTreeData([]);
    }
  }, [selectedDeptId]);

  // 获取部门列表
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/departments');
      const data = response.data;
      if (Array.isArray(data)) {
        setDepartments(data);
        if (data.length > 0 && !selectedDeptId) {
          setSelectedDeptId(data[0].id);
        }
      } else {
        console.error('Expected departments array but got:', data);
        setDepartments([]);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      setDepartments([]);
    }
  };

  // 获取项目列表并构建树结构初态
  const fetchProjects = async (deptId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/cases/projects?departmentId=${deptId}`);
      if (Array.isArray(response.data)) {
        const projects = response.data.map(p => ({
          ...p,
          type: 'project',
          children: [],
          loaded: false
        }));
        setTreeData(projects);
      } else {
        console.error('Expected projects array but got:', response.data);
        setTreeData([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setTreeData([]);
      setLoading(false);
    }
  };

  // 获取模块列表
  const fetchModules = async (projectId, parentId = null) => {
    try {
      let url = `/api/cases/modules?projectId=${projectId}`;
      if (parentId) url += `&parentId=${parentId}`;
      const response = await axios.get(url);
      if (Array.isArray(response.data)) {
        return response.data.map(m => ({
          ...m,
          type: 'module',
          children: [],
          loaded: false
        }));
      }
      console.error('Expected modules array but got:', response.data);
      return [];
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      return [];
    }
  };

  // 获取用例列表
  const fetchTestCases = async (moduleId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/cases/list?moduleId=${moduleId}`);
      if (Array.isArray(response.data)) {
        setTestCases(response.data);
      } else {
        console.error('Expected cases array but got:', response.data);
        setTestCases([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch cases:', error);
      setTestCases([]);
      setLoading(false);
    }
  };

  // 递归更新树数据中的节点
  const updateTreeNode = (data, nodeId, nodeType, updates) => {
    if (!Array.isArray(data)) return [];
    return data.map(node => {
      if (node.id === nodeId && node.type === nodeType) {
        return { ...node, ...updates };
      }
      if (node.children && node.children.length > 0) {
        return { ...node, children: updateTreeNode(node.children, nodeId, nodeType, updates) };
      }
      return node;
    });
  };

  // 展开/收起树节点
  const toggleNode = async (node) => {
    const newExpanded = new Set(expandedNodes);
    const nodeKey = `${node.type}-${node.id}`;
    
    if (newExpanded.has(nodeKey)) {
      newExpanded.delete(nodeKey);
    } else {
      newExpanded.add(nodeKey);
      
      // 如果未加载过子节点，则加载
      if (!node.loaded) {
        let children = [];
        if (node.type === 'project') {
          children = await fetchModules(node.id);
        } else if (node.type === 'module') {
          const projectId = node.project?.id || node.projectId;
          children = await fetchModules(projectId, node.id);
        }
        
        setTreeData(prev => updateTreeNode(prev, node.id, node.type, { children, loaded: true }));
      }
    }
    setExpandedNodes(newExpanded);
  };

  // 点击节点
  const handleNodeClick = (node) => {
    setSelectedNode(node);
    if (node.type === 'module') {
      fetchTestCases(node.id);
    } else {
      setTestCases([]);
    }
  };

  // --- CRUD Operations ---
  // Load draft on open
  const handleOpenDrawer = (mode, node, caseData = null) => {
    setDrawerMode(mode);
    if (mode === 'add') {
      const savedDraft = localStorage.getItem('case_draft');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          // Only use draft if it's for the same module
          if (draft.moduleId === node.id) {
            setDrawerData({ ...draft, moduleId: node.id });
          } else {
            setDrawerData({ moduleId: node.id, priority: 'P1', status: 'PENDING' });
          }
        } catch (e) {
          setDrawerData({ moduleId: node.id, priority: 'P1', status: 'PENDING' });
        }
      } else {
        setDrawerData({ moduleId: node.id, priority: 'P1', status: 'PENDING' });
      }
    } else {
      setDrawerData(caseData);
    }
    setIsDrawerOpen(true);
  };

  const handleOpenModal = (type, mode, node = null) => {
    setModalType(type);
    setModalMode(mode);
    if (mode === 'edit') {
      setFormData(node);
    } else {
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleSaveDrawer = async () => {
    try {
      if (!drawerData.name) {
        alert('请输入用例名称');
        return;
      }

      const url = drawerMode === 'add' ? '/api/cases/test-case' : `/api/cases/test-case/${drawerData.id}`;
      const method = drawerMode === 'add' ? 'post' : 'put';
      
      const payload = {
        ...drawerData,
        module: { id: drawerData.moduleId }
      };

      await axios[method](url, payload);
      
      // Clear draft on success
      if (drawerMode === 'add') {
        localStorage.removeItem('case_draft');
      }
      
      if (selectedNode?.id === drawerData.moduleId) {
        fetchTestCases(drawerData.moduleId);
      }
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Save test case failed:', error);
      alert(error.response?.data?.message || '保存失败');
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.name) {
        alert('请输入名称');
        return;
      }

      let url = '';
      let data = { ...formData };
      
      if (modalType === 'project') {
        if (!selectedDeptId) {
          alert('请先在上方选择部门后再创建项目');
          return;
        }
        url = '/api/cases/projects';
        data.department = { id: selectedDeptId };
      } else if (modalType === 'module') {
        url = '/api/cases/modules';
        if (modalMode === 'add') {
          const projectId = selectedNode?.type === 'project' ? selectedNode.id : selectedNode.project?.id;
          data.project = { id: projectId };
          if (selectedNode?.type === 'module') {
            data.parentId = selectedNode.id;
          }
        }
      }

      await axios.post(url, data);
      setIsModalOpen(false);
      
      // Refresh data
      if (modalType === 'project') {
        fetchProjects(selectedDeptId);
        if (modalMode === 'add') {
          setSelectedNode(null);
          setTestCases([]);
        }
      } else if (modalType === 'module') {
        const projectId = selectedNode?.type === 'project' ? selectedNode.id : selectedNode.project?.id;
        const parentId = selectedNode?.type === 'module' ? (modalMode === 'add' ? selectedNode.id : selectedNode.parentId) : null;
        const modules = await fetchModules(projectId, parentId);
        
        if (parentId) {
          setTreeData(prev => updateTreeNode(prev, parentId, 'module', { children: modules, loaded: true }));
        } else {
          setTreeData(prev => updateTreeNode(prev, projectId, 'project', { children: modules, loaded: true }));
        }
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleDeleteNode = async (e, node) => {
    e.stopPropagation();
    if (!window.confirm(`确定要删除${node.type === 'project' ? '项目' : '模块'} "${node.name}" 吗？`)) return;
    
    try {
      const url = node.type === 'project' ? `/api/cases/projects/${node.id}` : `/api/cases/modules/${node.id}`;
      await axios.delete(url);
      
      if (node.type === 'project') {
        fetchProjects(selectedDeptId);
      } else {
        const projectId = node.project?.id || node.projectId;
        const parentId = node.parentId;
        const modules = await fetchModules(projectId, parentId);
        
        if (parentId) {
          setTreeData(prev => updateTreeNode(prev, parentId, 'module', { children: modules }));
        } else {
          setTreeData(prev => updateTreeNode(prev, projectId, 'project', { children: modules }));
        }
      }
      
      if (selectedNode?.id === node.id && selectedNode?.type === node.type) {
        setSelectedNode(null);
        setTestCases([]);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleDeleteCase = async (caseId) => {
    if (!window.confirm('确定要删除该用例吗？')) return;
    try {
      await axios.delete(`/api/cases/test-case/${caseId}`);
      fetchTestCases(selectedNode.id);
    } catch (error) {
      console.error('Delete case failed:', error);
    }
  };

  // 选择用例
  const toggleCaseSelection = (caseId) => {
    const newSelection = new Set(selectedCaseIds);
    if (newSelection.has(caseId)) {
      newSelection.delete(caseId);
    } else {
      newSelection.add(caseId);
    }
    setSelectedCaseIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedCaseIds.size === filteredTestCases.length) {
      setSelectedCaseIds(new Set());
    } else {
      setSelectedCaseIds(new Set(filteredTestCases.map(c => c.id)));
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedCaseIds.size === 0) return;
    if (!window.confirm(`确定要删除选中的 ${selectedCaseIds.size} 个用例吗？`)) return;

    try {
      await axios.post('/api/cases/test-case/batch-delete', Array.from(selectedCaseIds));
      setSelectedCaseIds(new Set());
      if (selectedNode && selectedNode.type === 'module') {
        fetchTestCases(selectedNode.id);
      }
    } catch (error) {
      console.error('Batch delete failed:', error);
    }
  };

  // 批量执行
  const handleBatchExecute = async () => {
    if (selectedCaseIds.size === 0) return;
    alert(`开始执行选中的 ${selectedCaseIds.size} 个用例... (演示模式)`);
    // 实际项目中这里会调用后端执行引擎接口
  };

  // 过滤后的用例列表
  const filteredTestCases = (Array.isArray(testCases) ? testCases : []).filter(tc => 
    tc && tc.name && tc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tc && tc.id && tc.id.toString().includes(searchTerm)
  );

  // 渲染树节点
  const renderTreeNode = (node, depth = 0) => {
    if (!node) return null;
    const isExpanded = expandedNodes.has(`${node.type}-${node.id}`);
    const isSelected = selectedNode?.type === node.type && selectedNode?.id === node.id;
    const hasChildren = node.type === 'project' || node.type === 'module';

    return (
      <div key={`${node.type}-${node.id}`}>
        <div 
          className={`flex items-center py-2 px-3 cursor-pointer rounded-lg transition-colors group ${
            isSelected ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-700'
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => handleNodeClick(node)}
        >
          <div className="flex items-center flex-1 min-w-0">
            {hasChildren ? (
              <button 
                onClick={(e) => { e.stopPropagation(); toggleNode(node); }}
                className="p-1 hover:bg-white/10 rounded mr-1"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <div className="w-5" />
            )}
            {node.type === 'project' ? (
              <FolderOpen className={`w-4 h-4 mr-2 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
            ) : (
              <Layout className={`w-4 h-4 mr-2 ${isSelected ? 'text-white' : 'text-yellow-500'}`} />
            )}
            <span className="truncate text-sm font-medium">{node.name}</span>
          </div>
          
          <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'text-white' : 'text-gray-400'}`}>
            {/* 新增用例按钮 (Plus) */}
            <button 
              onClick={(e) => { e.stopPropagation(); handleOpenDrawer('add', node); }}
              className="p-1 hover:bg-black/10 rounded" title="新增用例"
            >
              <Plus className="w-3 h-3" />
            </button>
            {/* 新增子模块按钮 (FolderPlus) - 仅在深度小于2时显示（项目为0，一级模块为1，二级模块为2，以此类推） */}
            {depth < 2 && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleOpenModal('module', 'add', node); }}
                className="p-1 hover:bg-black/10 rounded" title="新增子模块"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); handleOpenModal(node.type, 'edit', node); }}
              className="p-1 hover:bg-black/10 rounded" title="编辑"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button 
              onClick={(e) => handleDeleteNode(e, node)}
              className="p-1 hover:bg-black/10 rounded hover:text-red-400" title="删除"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {isExpanded && Array.isArray(node.children) && node.children.map(child => renderTreeNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-[1600px] mx-auto pt-4 gap-4">
      <style>{editorStyles}</style>
      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[2000] overflow-hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-[1200px] bg-white shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="h-full flex flex-col">
                <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-200">
                      <FilePlus className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">
                        {drawerMode === 'add' ? '新增测试用例' : '编辑测试用例'}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        {drawerMode === 'add' ? 'Creating new test scenario' : `Editing Case ID: ${drawerData.id}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-xl mr-2">
                      <button 
                        onClick={() => setIsPreviewMode(false)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!isPreviewMode ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        编辑模式
                      </button>
                      <button 
                        onClick={() => setIsPreviewMode(true)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${isPreviewMode ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        预览模式
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg mr-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-black text-green-600 uppercase">Draft Saved</span>
                    </div>
                    <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-black">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  {/* Name and Priority Row */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">用例名称 / Case Name</label>
                      <input 
                        type="text" 
                        value={drawerData.name || ''} 
                        onChange={(e) => setDrawerData({...drawerData, name: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-black/5 rounded-2xl text-base font-bold focus:ring-0 transition-all placeholder:text-gray-300"
                        placeholder="请输入用例名称..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Flag className="w-3.5 h-3.5" /> 优先级 / Priority
                        </label>
                        <div className="flex bg-gray-50 p-1.5 rounded-2xl border-2 border-transparent focus-within:border-black/5 transition-all">
                          {['P0', 'P1', 'P2', 'P3'].map((p) => (
                            <button
                              key={p}
                              onClick={() => setDrawerData({ ...drawerData, priority: p })}
                              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                                drawerData.priority === p 
                                  ? 'bg-white text-black shadow-sm' 
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      {drawerMode === 'edit' && (
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Play className="w-3.5 h-3.5" /> 执行状态 / Execution Status
                          </label>
                          <div className="flex bg-gray-50 p-1.5 rounded-2xl border-2 border-transparent focus-within:border-black/5 transition-all">
                            {[
                              { label: '待执行', value: 'PENDING', color: 'blue' },
                              { label: '成功', value: 'SUCCESS', color: 'green' },
                              { label: '失败', value: 'FAILED', color: 'red' }
                            ].map((s) => (
                              <button
                                key={s.value}
                                onClick={() => setDrawerData({ ...drawerData, status: s.value })}
                                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${
                                  drawerData.status === s.value 
                                    ? 'bg-white text-black shadow-sm' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                              >
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rich Text Areas */}
                  <div className="space-y-8">
                    <div className="editor-group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5" /> 前置步骤 / Preconditions
                      </label>
                      <div className="rounded-2xl overflow-hidden border-2 border-gray-50 bg-white">
                        {!isPreviewMode ? (
                          <>
                            <Toolbar
                              editor={editorPre}
                              defaultConfig={toolbarConfig}
                              mode="default"
                            />
                            <Editor
                              key={`pre-${drawerData.id || 'new'}`}
                              defaultConfig={{...editorConfig, placeholder: '详细描述测试执行前需要满足的条件和准备工作...'}}
                              defaultHtml={drawerData.preconditions || ''}
                              onCreated={setEditorPre}
                              onChange={editor => setDrawerData(prev => ({...prev, preconditions: editor.getHtml()}))}
                              mode="default"
                              style={{ height: '300px', overflowY: 'hidden' }}
                            />
                          </>
                        ) : (
                          <div 
                            className="preview-content prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: drawerData.preconditions || '<p className="text-gray-400 italic">暂无前置步骤</p>' }}
                          />
                        )}
                      </div>
                    </div>

                    <div className="editor-group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <List className="w-3.5 h-3.5" /> 预期效果 / Expected Result
                      </label>
                      <div className="rounded-2xl overflow-hidden border-2 border-gray-50 bg-white">
                        {!isPreviewMode ? (
                          <>
                            <Toolbar
                              editor={editorExp}
                              defaultConfig={toolbarConfig}
                              mode="default"
                            />
                            <Editor
                              key={`exp-${drawerData.id || 'new'}`}
                              defaultConfig={{...editorConfig, placeholder: '描述在执行上述步骤后，系统应该呈现的状态或返回的结果...'}}
                              defaultHtml={drawerData.expectedResult || ''}
                              onCreated={setEditorExp}
                              onChange={editor => setDrawerData(prev => ({...prev, expectedResult: editor.getHtml()}))}
                              mode="default"
                              style={{ height: '300px', overflowY: 'hidden' }}
                            />
                          </>
                        ) : (
                          <div 
                            className="preview-content prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: drawerData.expectedResult || '<p className="text-gray-400 italic">暂无预期效果</p>' }}
                          />
                        )}
                      </div>
                    </div>

                    <div className="editor-group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5" /> 实际结果 / Actual Result
                      </label>
                      <div className="rounded-2xl overflow-hidden border-2 border-gray-50 bg-white">
                        {!isPreviewMode ? (
                          <>
                            <Toolbar
                              editor={editorAct}
                              defaultConfig={toolbarConfig}
                              mode="default"
                            />
                            <Editor
                              key={`act-${drawerData.id || 'new'}`}
                              defaultConfig={{...editorConfig, placeholder: '记录在测试执行过程中，系统实际呈现的状态或返回的结果...'}}
                              defaultHtml={drawerData.actualResult || ''}
                              onCreated={setEditorAct}
                              onChange={editor => setDrawerData(prev => ({...prev, actualResult: editor.getHtml()}))}
                              mode="default"
                              style={{ height: '300px', overflowY: 'hidden' }}
                            />
                          </>
                        ) : (
                          <div 
                            className="preview-content prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: drawerData.actualResult || '<p className="text-gray-400 italic">暂无实际结果</p>' }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-gray-50/50 backdrop-blur-md border-t border-gray-100 flex gap-4">
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-8 py-4 text-sm font-black text-gray-400 hover:text-black transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleSaveDrawer}
                    className="flex-1 bg-black text-white py-4 rounded-2xl text-sm font-black hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-[0.98] flex items-center justify-center gap-3 group"
                  >
                    <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    保存并同步用例
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50">
              <h3 className="text-2xl font-black text-gray-900">
                {modalMode === 'add' ? '新增' : '编辑'}
                {modalType === 'project' ? '项目' : '模块'}
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">名称</label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all"
                  placeholder={`请输入${modalType === 'project' ? '项目' : '模块'}名称`}
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
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Area */}
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
              className={`flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border transition-all min-w-[200px] justify-between group shadow-sm ${
                isDeptDropdownOpen ? 'border-blue-600 ring-4 ring-blue-50' : 'border-gray-200 hover:border-blue-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className={`w-5 h-5 ${isDeptDropdownOpen ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="text-sm font-bold text-gray-900">
                  {departments.find(d => d.id === selectedDeptId)?.name || '选择部门'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDeptDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
            </button>

            {isDeptDropdownOpen && (
              <>
                <div className="fixed inset-0 z-[100]" onClick={() => setIsDeptDropdownOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-[101] animate-in fade-in zoom-in-95 duration-200">
                  {Array.isArray(departments) && departments.map((dept, index) => {
                    const icons = [Mail, PieChart, Flag, MessageSquare, Leaf];
                    const Icon = icons[index % icons.length];
                    return (
                      <button
                        key={dept.id}
                        onClick={() => {
                          setSelectedDeptId(dept.id);
                          setIsDeptDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group ${
                          selectedDeptId === dept.id ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          selectedDeptId === dept.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-400 group-hover:text-gray-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-sm font-bold ${
                          selectedDeptId === dept.id ? 'text-blue-600' : 'text-gray-700'
                        }`}>{dept.name}</span>
                        {selectedDeptId === dept.id && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedCaseIds.size > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
              <span className="text-xs font-bold text-gray-500">已选 {selectedCaseIds.size} 项</span>
              <button 
                onClick={handleBatchDelete}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-red-100 transition-colors shadow-sm shadow-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" /> 批量删除
              </button>
              <button 
                onClick={handleBatchExecute}
                className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-green-100 transition-colors shadow-sm shadow-green-50"
              >
                <Play className="w-3.5 h-3.5" /> 批量执行
              </button>
              <div className="w-px h-6 bg-gray-100 mx-1" />
            </div>
          )}
          <button 
            onClick={() => handleOpenDrawer('add', selectedNode)}
            disabled={!selectedNode}
            className="bg-black text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-all hover:shadow-xl active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> 新增用例
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 px-4 overflow-hidden pb-4">
        {/* Left Tree Area */}
        <div className="w-80 bg-white rounded-[32px] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <span className="text-sm font-black text-gray-900 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-500" />
              用例目录
            </span>
            <button 
              onClick={() => handleOpenModal('project', 'add')}
              disabled={!selectedDeptId}
              className={`p-2 rounded-xl transition-all shadow-sm border border-transparent ${!selectedDeptId ? 'text-gray-200 cursor-not-allowed' : 'hover:bg-white hover:border-gray-100 text-gray-400 hover:text-black'}`}
              title={!selectedDeptId ? "请先选择部门" : "新建项目"}
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {Array.isArray(treeData) && treeData.length > 0 ? (
              treeData.map(node => renderTreeNode(node))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 space-y-2">
                <Search className="w-8 h-8 opacity-20" />
                <span className="text-xs">暂无项目数据</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="搜索用例名称或ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5 w-64 transition-all"
                />
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
              <Filter className="w-3 h-3" /> 筛选器
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 sticky top-0 z-10">
                <tr className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                  <th className="px-6 py-4 w-10">
                    <input 
                      type="checkbox" 
                      checked={filteredTestCases.length > 0 && selectedCaseIds.size === filteredTestCases.length}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                  </th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">用例名称</th>
                  <th className="px-6 py-4">状态</th>
                  <th className="px-6 py-4">优先级</th>
                  <th className="px-6 py-4">创建人</th>
                  <th className="px-6 py-4">更新时间</th>
                  <th className="px-6 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs">正在加载用例...</span>
                      </div>
                    </td>
                  </tr>
                ) : (Array.isArray(filteredTestCases) && filteredTestCases.length > 0) ? (
                  filteredTestCases.map((tc) => (
                    <tr key={tc.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          checked={selectedCaseIds.has(tc.id)}
                          onChange={() => toggleCaseSelection(tc.id)}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">TC-{tc.id.toString().padStart(4, '0')}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{tc.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          tc.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                          tc.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {tc.status === 'SUCCESS' ? '执行成功' :
                           tc.status === 'FAILED' ? '执行失败' :
                           '待执行'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold ${
                          tc.priority === 'P0' ? 'text-red-500' :
                          tc.priority === 'P1' ? 'text-orange-500' :
                          'text-blue-500'
                        }`}>{tc.priority}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">{tc.creator || 'Admin'}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {tc.updatedAt ? new Date(tc.updatedAt).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenDrawer('edit', selectedNode, tc)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCase(tc.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-20 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <FilePlus className="w-10 h-10 opacity-10" />
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium">暂无测试用例</p>
                          <p className="text-xs">请先在左侧选择模块或点击右上角新增</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {testCases.length > 0 && (
            <div className="p-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 bg-gray-50/30">
              <span>共 {testCases.length} 条数据</span>
              <div className="flex gap-1">
                <button className="px-2 py-1 rounded hover:bg-white border border-transparent hover:border-gray-200 transition-all">上一页</button>
                <button className="px-2 py-1 rounded bg-black text-white font-bold">1</button>
                <button className="px-2 py-1 rounded hover:bg-white border border-transparent hover:border-gray-200 transition-all">下一页</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default CaseManagement;
