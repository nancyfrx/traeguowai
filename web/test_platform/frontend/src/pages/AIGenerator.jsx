import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, Zap, Copy, Trash2, FileText, Loader2, History, Upload, 
  Send, ChevronRight, ChevronLeft, X, Calendar, User, File, Eye, ChevronDown, CheckCircle2, Check, Tag, Flag, Play, List, Image as ImageIcon, Save, FileImage, FileSpreadsheet, FileCode, FileType
} from 'lucide-react';
import axios from 'axios';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { i18nChangeLanguage } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';

// Configure WangEditor i18n to rename labels
i18nChangeLanguage('zh-CN', {
  fontSize: {
    title: '字号',
  },
  lineHeight: {
    title: '行高',
  }
});

// Custom styles for WangEditor
const editorStyles = `
  .w-e-full-screen-container {
    z-index: 2100 !important;
  }
  .w-e-drop-panel, .w-e-select-list, .w-e-bar-item-menus-container {
    z-index: 5000 !important;
  }
  .w-e-toolbar {
    border-top-left-radius: 14px !important;
    border-top-right-radius: 14px !important;
    border-bottom: 1px solid #f3f4f6 !important;
    border-color: #f3f4f6 !important;
    background: #f9fafb !important;
    flex-wrap: wrap !important;
    overflow: visible !important;
    padding: 2px 10px !important;
    width: 100% !important;
    box-sizing: border-box !important;
    position: relative !important;
    z-index: 10 !important; /* Ensure tooltips are above text container */
  }
  /* Fix dropdown and tooltip clipping */
  .w-e-bar-item-menus-container, .w-e-select-list, .w-e-drop-panel, .w-e-tooltip-container {
    z-index: 10000 !important;
  }
  /* Ensure the editor group and its children don't clip */
  .editor-group, .rounded-2xl {
    overflow: visible !important;
  }
  .w-e-toolbar-container {
    flex-wrap: wrap !important;
    overflow: visible !important;
  }
  .w-e-bar-item {
    padding: 2px !important;
    flex-shrink: 0 !important;
    overflow: visible !important; /* Allow tooltips to overflow item */
  }
  .w-e-bar-item button {
    padding: 0 8px !important;
  }
  .w-e-bar-divider {
    margin: 0 8px !important;
  }
  .w-e-text-container {
    border-bottom-left-radius: 14px !important;
    border-bottom-right-radius: 14px !important;
    border-color: #f3f4f6 !important;
    height: auto !important; /* Allow auto height */
    min-height: 300px !important; /* Set a reasonable min height to avoid wangeditor warnings */
    background: #fff !important;
    position: relative !important;
    z-index: 1 !important;
  }
  .w-e-text-container [data-slate-editor] {
    min-height: 300px !important;
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
`;

const MODELS = [
    { id: 'glm-4.6', name: 'GLM-4.6', icon: Sparkles, desc: '最新旗舰，超强推理' },
    { id: 'glm-4.6v', name: 'GLM-4.6v', icon: ImageIcon, desc: '视觉增强，多模态支持' },
    { id: 'deepseek-chat', name: 'DeepSeek-V3', icon: Zap, desc: '智能对话，快速响应' },
    { id: 'deepseek-reasoner', name: 'DeepSeek-R1', icon: Zap, desc: '深度思考，逻辑严密' },
];

const AIGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('glm-4.6');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [generatedCases, setGeneratedCases] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [drawerData, setDrawerData] = useState({});
  const [editorPre, setEditorPre] = useState(null);
  const fileInputRef = useRef(null);
  const [editorSteps, setEditorSteps] = useState(null);
  const [editorExp, setEditorExp] = useState(null);
  const [isEditorsVisible, setIsEditorsVisible] = useState(false);
  const drawerKey = drawerData.id || 'new';

  const toolbarConfig = useMemo(() => ({
    toolbarKeys: [
      'fullScreen', '|', 'undo', 'redo', '|', 
      'headerSelect', 'fontSize', '|',
      'bold', 'italic', 'underline', 'through', '|', 
      'color', 'bgColor', '|', 
      'bulletedList', 'numberedList', 'todo', '|', 
      'insertTable', 'insertLink'
    ]
  }), []);

  const editorConfig = useMemo(() => ({
    placeholder: '请输入内容...',
  }), []);

  useEffect(() => {
    return () => {
        if (editorPre) { editorPre.destroy(); setEditorPre(null); }
        if (editorSteps) { editorSteps.destroy(); setEditorSteps(null); }
        if (editorExp) { editorExp.destroy(); setEditorExp(null); }
    };
  }, [editorPre, editorSteps, editorExp]);
  
  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [caseTypes, setCaseTypes] = useState([]);
  const [isAddingType, setIsAddingType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [generationType, setGenerationType] = useState('功能用例');
  const [generationModule, setGenerationModule] = useState('默认模块');
  const [activeResultTab, setActiveResultTab] = useState('table');
  const [rawResult, setRawResult] = useState({ input: '', output: '' });

  const formatContent = (content) => {
    if (!content) return '';
    return content.replace(/\n/g, '<br/>');
  };

  const formatField = (val) => {
    if (!val) return '无';
    if (Array.isArray(val)) return val.join('\n');
    return val;
  };

  const parseContent = (content) => {
    if (!content) return null;
    try {
        let jsonStr = content;
        if (typeof jsonStr === 'string') {
            // Clean markdown
            if (jsonStr.includes('```json')) {
                jsonStr = jsonStr.split('```json')[1].split('```')[0];
            } else if (jsonStr.includes('```')) {
                jsonStr = jsonStr.split('```')[1].split('```')[0];
            }
            // Try to parse
            try {
                const parsed = JSON.parse(jsonStr.trim());
                return Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                // If parse fails, return raw content
                return null;
            }
        } else if (typeof jsonStr === 'object') {
             return Array.isArray(jsonStr) ? jsonStr : [jsonStr];
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
  };

  const generateFormattedText = (content) => {
    const parsedCases = parseContent(content);
    if (!parsedCases) return content || '暂无内容';

    return parsedCases.map((tc, index) => {
        return `${index + 1}.用例标题：${tc.name || ''}\n\n` +
               `模块：${tc.module || '默认模块'}\n\n` +
               `前置条件：\n${formatField(tc.preconditions)}\n\n` +
               `测试步骤：\n${formatField(tc.steps)}\n\n` +
               `预期结果：\n${formatField(tc.expectedResult)}\n\n` +
               `优先级：${tc.priority || 'P2'}\n\n` +
               `用例类型：${tc.type || '功能用例'}`;
    }).join('\n\n\n');
  };

  const renderFormattedText = (content) => {
    const parsedCases = parseContent(content);
    if (!parsedCases) return <div className="whitespace-pre-wrap">{content || '暂无内容'}</div>;

    return (
        <div className="text-gray-700 font-mono text-sm">
            {parsedCases.map((tc, index) => (
                <div key={index} className="mb-10 border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                    <div className="mb-4">
                         <span className="font-bold text-gray-900 text-base">{index + 1}. 用例标题：{tc.name || ''}</span>
                    </div>
                    
                    <div className="mb-4">
                        <span className="font-bold text-gray-900">模块：</span>{tc.module || '默认模块'}
                    </div>

                    <div className="mb-4">
                        <div className="font-bold text-gray-900 mb-1">前置条件：</div>
                        <div className="whitespace-pre-wrap">{formatField(tc.preconditions)}</div>
                    </div>

                    <div className="mb-4">
                        <div className="font-bold text-gray-900 mb-1">测试步骤：</div>
                        <div className="whitespace-pre-wrap">{formatField(tc.steps)}</div>
                    </div>

                    <div className="mb-4">
                        <div className="font-bold text-gray-900 mb-1">预期结果：</div>
                        <div className="whitespace-pre-wrap">{formatField(tc.expectedResult)}</div>
                    </div>
                    
                    <div className="mb-4">
                         <span className="font-bold text-gray-900">优先级：</span>{tc.priority || 'P2'}
                    </div>

                    <div>
                         <span className="font-bold text-gray-900">用例类型：</span>{tc.type || '功能用例'}
                    </div>
                </div>
            ))}
        </div>
    );
  };

  const handleCopyText = () => {
    const text = generateFormattedText(rawResult.output);
    navigator.clipboard.writeText(text).then(() => {
        // You could add a toast here, for now maybe just change button text temporarily if I had state
        // or just rely on user knowing it worked.
        // Let's add a simple alert or console log, or just nothing.
        // The user asked for a button, usually implies feedback. 
        // I'll add a temporary "Copied" state.
    });
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchCaseTypes();
  }, []);

  const fetchCaseTypes = async () => {
    try {
        const res = await axios.get('/api/case-types');
        setCaseTypes(res.data);
    } catch (err) {
        console.error('Failed to fetch case types', err);
    }
  };

  const handleAddType = async () => {
    if (!newTypeName.trim()) return;
    try {
        const res = await axios.post('/api/case-types', { name: newTypeName });
        setCaseTypes([...caseTypes, res.data]);
        if (isDetailOpen) {
            setDrawerData(prev => ({ ...prev, type: res.data.name }));
        }
        setNewTypeName('');
        setIsAddingType(false);
    } catch (err) {
        alert(err.response?.data?.error || '添加失败');
    }
  };

  // Pagination Logic
  const paginatedCases = generatedCases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(generatedCases.length / pageSize);

  // History Pagination
  const [historyPage, setHistoryPage] = useState(1);
  const [historySize] = useState(10);
  const [historyTotal, setHistoryTotal] = useState(0);

  // Fetch history
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`/api/ai/history?page=${historyPage}&size=${historySize}`);
      // Backend returns PageInfo object
      setHistoryList(res.data.list || []);
      setHistoryTotal(res.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const restoreHistory = (record) => {
    setPrompt(record.inputContent || '');
    setRawResult({ input: record.inputContent || '', output: record.generatedContent || '' });
    setActiveResultTab('table');
    if (record.generatedContent) {
        try {
            let jsonStr = record.generatedContent;
            if (jsonStr.includes('```json')) {
                jsonStr = jsonStr.split('```json')[1].split('```')[0];
            } else if (jsonStr.includes('```')) {
                jsonStr = jsonStr.split('```')[1].split('```')[0];
            }
            const parsed = JSON.parse(jsonStr.trim());
            const cases = Array.isArray(parsed) ? parsed : [parsed];
            setGeneratedCases(cases.map((item, index) => ({
                ...item,
                id: index + 1,
                type: item.type || '功能用例',
                module: item.module || '默认模块',
                status: 'PENDING',
                creator: record.operator || 'AI',
                updatedAt: record.createdAt || new Date().toISOString()
            })));
        } catch (e) {
            console.error('Failed to parse history content', e);
        }
    }
    setIsHistoryOpen(false);
  };

  useEffect(() => {
    if (isHistoryOpen) {
      fetchHistory();
    }
  }, [isHistoryOpen, historyPage]); // Refetch when page changes

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('model', model);
    formData.append('operator', localStorage.getItem('username') || 'Admin');
    // Handle file upload
    if (uploadFiles.length > 0) {
      uploadFiles.forEach(file => {
        formData.append('files', file);
      });
    }

    try {
      const res = await axios.post('/api/ai/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const content = res.data.generatedContent;
      // Try to parse JSON
      try {
        let jsonStr = content;
        // Clean markdown
        if (jsonStr.includes('```json')) {
            jsonStr = jsonStr.split('```json')[1].split('```')[0];
        } else if (jsonStr.includes('```')) {
            jsonStr = jsonStr.split('```')[1].split('```')[0];
        }
        const parsed = JSON.parse(jsonStr.trim());
        if (Array.isArray(parsed)) {
            setGeneratedCases(parsed.map((item, index) => ({
                ...item,
                id: index + 1, // Temp ID
                type: item.type || generationType,
                module: item.module || generationModule,
                status: 'PENDING',
                creator: 'AI',
                updatedAt: new Date().toISOString()
            })));
        } else {
            // If object, maybe wrap in array
            setGeneratedCases([{ 
                ...parsed, 
                id: 1, 
                type: parsed.type || generationType,
                module: parsed.module || generationModule,
                status: 'PENDING', 
                creator: 'AI', 
                updatedAt: new Date().toISOString() 
            }]);
        }
      } catch (e) {
        console.error('Failed to parse AI response as JSON', e);
        // Fallback: create one case with full content
        setGeneratedCases([{
            id: 1,
            name: 'AI Generated Content',
            steps: content,
            type: generationType,
            module: generationModule,
            status: 'PENDING',
            priority: 'P1',
            creator: 'AI',
            updatedAt: new Date().toISOString()
        }]);
      }
      
      setRawResult({ input: prompt, output: content });
      setActiveResultTab('table');
      setPrompt('');
      setUploadFiles([]);
      fetchHistory(); // Refresh history
    } catch (err) {
      console.error('Generation failed', err);
      alert('生成失败: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadFiles(prev => {
        // Filter duplicates if needed, or just append
        const newFiles = [...prev, ...files];
        return newFiles;
      });
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const removeFile = (index) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const iconClass = "w-5 h-5";
    const containerClass = "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors";

    // Image
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
        return (
            <div className={`${containerClass} bg-purple-100 text-purple-600`}>
                <FileImage className={iconClass} />
            </div>
        );
    }
    // PDF
    if (['pdf'].includes(ext)) {
        return (
            <div className={`${containerClass} bg-red-100 text-red-600`}>
                <FileText className={iconClass} />
            </div>
        );
    }
    // Word
    if (['doc', 'docx'].includes(ext)) {
        return (
            <div className={`${containerClass} bg-blue-100 text-blue-600`}>
                <FileText className={iconClass} />
            </div>
        );
    }
    // Excel
    if (['xls', 'xlsx', 'csv'].includes(ext)) {
        return (
            <div className={`${containerClass} bg-green-100 text-green-600`}>
                <FileSpreadsheet className={iconClass} />
            </div>
        );
    }
    // PPT
    if (['ppt', 'pptx'].includes(ext)) {
        return (
            <div className={`${containerClass} bg-orange-100 text-orange-600`}>
                <FileType className={iconClass} />
            </div>
        );
    }
    // Code
    if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'java', 'py', 'sql', 'xml'].includes(ext)) {
        return (
            <div className={`${containerClass} bg-slate-100 text-slate-600`}>
                <FileCode className={iconClass} />
            </div>
        );
    }
    // Default
    return (
        <div className={`${containerClass} bg-gray-100 text-gray-500`}>
            <File className={iconClass} />
        </div>
    );
  };

  const openDetail = (item) => {
    setSelectedCase(item);
    setDrawerData({
        ...item,
        type: item.type || '功能用例',
        module: item.module || ''
    });
    setIsEditorsVisible(false);
    setIsDetailOpen(true);
    setTimeout(() => setIsEditorsVisible(true), 100);
  };

  const handleSaveDrawer = () => {
    setGeneratedCases(prev => prev.map(c => 
        c.id === drawerData.id ? { ...c, ...drawerData } : c
    ));
    setIsDetailOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-6 gap-6 overflow-hidden">
      {/* Top Section: Input */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative" style={{ minHeight: '300px' }}>
        
        {/* Header Row */}
        <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                AI 智能用例生成
            </h2>
            <button 
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-black transition-colors border border-transparent hover:border-gray-200 shadow-sm text-[10px] font-medium"
                title="历史记录"
            >
                <History className="w-3 h-3" />
                <span>历史记录</span>
            </button>
          {/* Add Type Modal */}
      {isAddingType && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddingType(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg shadow-gray-100">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">添加新类型</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Add New Case Type</p>
                </div>
              </div>
              <button onClick={() => setIsAddingType(false)} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500">类型名称</label>
                  <input
                    type="text"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    placeholder="输入类型名称..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-black focus:ring-0 transition-all"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddType();
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex gap-3">
              <button 
                onClick={() => setIsAddingType(false)}
                className="flex-1 py-3 border-2 border-gray-100 text-gray-400 rounded-2xl text-sm font-bold hover:bg-white hover:text-gray-600 transition-all"
              >
                取消
              </button>
              <button 
                onClick={handleAddType}
                disabled={!newTypeName.trim()}
                className="flex-[2] py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

        <div className="flex-1 relative border border-gray-200 rounded-xl bg-white flex flex-col transition-all">
            {/* File List Area */}
            {uploadFiles.length > 0 && (
                <div className="flex flex-wrap gap-3 p-3 pb-0">
                    {uploadFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl pr-8 relative group border border-gray-100 h-[52px] hover:bg-gray-100 transition-colors">
                            {getFileIcon(file.name)}
                            <div className="flex flex-col justify-center min-w-[80px]">
                                <span className="text-xs font-bold text-gray-900 truncate max-w-[100px]" title={file.name}>{file.name}</span>
                                <span className="text-[10px] font-medium text-gray-400 uppercase">{file.name.split('.').pop()} | {formatFileSize(file.size)}</span>
                            </div>
                            <button 
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 text-gray-400 hover:text-red-500 p-0.5 rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    
                    {/* Add More Button */}
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-[52px] h-[52px] flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors text-gray-500 hover:text-black"
                    >
                        <span className="text-xl font-light">+</span>
                    </button>
                </div>
            )}

            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="请输入需求描述，AI 将自动生成测试用例..."
                className="w-full flex-1 p-3 resize-none outline-none bg-transparent text-sm focus:ring-0"
            />
            
            {/* Bottom Toolbar */}
            <div className="flex justify-between items-center p-2 px-3">
                <div className="flex items-center gap-3">
                    {/* Model Custom Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                            className="flex items-center gap-2 h-9 px-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                        >
                            {(() => {
                                const m = MODELS.find(m => m.id === model);
                                const Icon = m?.icon || Sparkles;
                                return <Icon className="w-4 h-4" />;
                            })()}
                            <span>{MODELS.find(m => m.id === model)?.name}</span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {isModelDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsModelDropdownOpen(false)} />
                                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 py-1">
                                    {MODELS.map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => {
                                                setModel(m.id);
                                                setIsModelDropdownOpen(false);
                                            }}
                                            className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3 text-left">
                                                <m.icon className={`w-4 h-4 mt-0.5 ${model === m.id ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                                <div>
                                                    <div className={`text-sm ${model === m.id ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{m.name}</div>
                                                    <div className="text-[10px] text-gray-400">{m.desc}</div>
                                                </div>
                                            </div>
                                            {model === m.id && <Check className="w-4 h-4 text-green-500" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Upload */}
                    <div className="relative">
                        <input 
                            type="file" 
                            id="file-upload"
                            ref={fileInputRef}
                            className="hidden" 
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                            multiple
                        />
                        <label 
                            htmlFor="file-upload" 
                            className="cursor-pointer flex items-center gap-2 h-9 px-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200"
                        >
                            <Upload className="w-4 h-4" />
                            {uploadFiles.length > 0 ? <span className="max-w-[80px] truncate text-xs">{uploadFiles.length} 个文件</span> : <span className="text-xs">上传文件</span>}
                        </label>
                    </div>
                </div>

                {/* Send Button */}
                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="flex items-center gap-2 h-9 px-4 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-gray-200"
                >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    {loading ? '生成中...' : '生成'}
                </button>
            </div>
        </div>
      </div>

      {/* Bottom Section: Table */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    生成结果预览
                </h3>
                <div className="flex bg-gray-200/50 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveResultTab('table')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            activeResultTab === 'table' 
                                ? 'bg-white text-black shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        表格视图
                    </button>
                    <button
                        onClick={() => setActiveResultTab('text')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            activeResultTab === 'text' 
                                ? 'bg-white text-black shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        文本视图
                    </button>
                </div>
            </div>
            <span className="text-xs text-gray-500">共 {generatedCases.length} 条用例</span>
        </div>
        
        <div className="flex-1 overflow-auto">
            {activeResultTab === 'table' ? (
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">用例标题</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">模块</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">优先级</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedCases.length > 0 ? (
                            paginatedCases.map((tc, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">TC-{String(tc.id).padStart(3, '0')}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{tc.name}</td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
                                            {tc.module || 'Default'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                                            tc.priority === 'P0' ? 'bg-red-50 text-red-600' :
                                            tc.priority === 'P1' ? 'bg-orange-50 text-orange-600' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {tc.priority || 'P2'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => openDetail(tc)}
                                            className="text-gray-400 hover:text-black transition-colors"
                                            title="查看详情"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <Sparkles className="w-8 h-8 opacity-20" />
                                        <p>暂无生成结果，请在上方输入需求后点击生成</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            ) : (
                <div className="p-6 h-full relative">
                    <button
                        onClick={handleCopyText}
                        className="absolute top-8 right-8 p-2 bg-white/80 hover:bg-white border border-gray-200 rounded-lg shadow-sm text-gray-500 hover:text-black transition-all z-10 flex items-center gap-2 text-xs font-bold"
                        title="复制内容"
                    >
                        {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copySuccess ? '已复制' : '复制结果'}
                    </button>
                    <div className="w-full h-full bg-gray-50 rounded-xl p-4 border border-gray-100 overflow-auto font-mono text-sm whitespace-pre-wrap text-gray-700">
{renderFormattedText(rawResult.output)}

{rawResult.input && (
<>
<br/>
<br/>
----------------------------------------
<br/>
<span className="font-bold text-gray-400">输入提示词：</span>
<br/>
<br/>
{rawResult.input}
</>
)}
                    </div>
                </div>
            )}
        </div>
        
        {/* Pagination Controls */}
        {activeResultTab === 'table' && generatedCases.length > 0 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="text-xs text-gray-500">
                    显示 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, generatedCases.length)} 条，共 {generatedCases.length} 条
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors text-gray-500"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                                    currentPage === page
                                        ? 'bg-black text-white shadow-lg shadow-gray-200'
                                        : 'text-gray-500 hover:bg-white'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors text-gray-500"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* History Drawer */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsHistoryOpen(false)} />
            <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <History className="w-4 h-4" /> 生成历史
                    </h3>
                    <button onClick={() => setIsHistoryOpen(false)} className="p-1 hover:bg-gray-200 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {historyList.map(record => (
                        <div 
                            key={record.id} 
                            onClick={() => restoreHistory(record)}
                            className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-black/10 relative"
                        >
                            {/* Top Right: Model Icon */}
                            <div className="absolute top-4 right-4 flex items-center gap-2 text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                                <span className="text-[10px] font-bold">{MODELS.find(m => m.id === record.model)?.name || record.model}</span>
                                {(() => {
                                    const Icon = MODELS.find(m => m.id === record.model)?.icon || Sparkles;
                                    return <Icon className="w-3.5 h-3.5" />;
                                })()}
                            </div>

                            {/* Top Left: Title (Input Content) */}
                            <div className="pr-20 mb-6">
                                <p className="text-sm text-gray-800 font-medium truncate" title={record.inputContent}>{record.inputContent}</p>
                            </div>

                            {/* Bottom Left: Operator/File */}
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" /> {record.operator}
                                </span>
                                {record.uploadFileName && (
                                    <span className="flex items-center gap-1 text-blue-500">
                                        <File className="w-3 h-3" /> {record.uploadFileName}
                                    </span>
                                )}
                            </div>

                            {/* Bottom Right: Date */}
                            <div className="absolute bottom-4 right-4 text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(record.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                    {historyList.length === 0 && (
                        <div className="text-center text-gray-400 py-10">暂无历史记录</div>
                    )}
                </div>
                
                {/* History Pagination */}
                {historyTotal > 0 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                         <div className="text-xs text-gray-500">
                            {historyTotal} 条记录
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                                disabled={historyPage === 1}
                                className="p-1.5 rounded-lg hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors text-gray-500"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-medium text-gray-600">
                                {historyPage} / {Math.ceil(historyTotal / historySize)}
                            </span>
                            <button
                                onClick={() => setHistoryPage(p => Math.min(Math.ceil(historyTotal / historySize), p + 1))}
                                disabled={historyPage >= Math.ceil(historyTotal / historySize)}
                                className="p-1.5 rounded-lg hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors text-gray-500"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Case Detail Drawer */}
      {isDetailOpen && selectedCase && (
        <div className="fixed inset-0 z-50 flex justify-end">
            <style>{editorStyles}</style>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsDetailOpen(false)} />
            <div className="relative w-full max-w-4xl bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm text-gray-400">TC-{String(drawerData.id).padStart(3, '0')}</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                                drawerData.priority === 'P0' ? 'bg-red-50 text-red-600' :
                                drawerData.priority === 'P1' ? 'bg-orange-50 text-orange-600' :
                                'bg-gray-100 text-gray-600'
                            }`}>{drawerData.priority || 'P2'}</span>
                        </div>
                        <div className="text-xl font-bold text-gray-900 w-full">{drawerData.name || ''}</div>
                    </div>
                    <button onClick={() => setIsDetailOpen(false)} className="p-2 hover:bg-gray-200 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 bg-white">
                  <div className="max-w-4xl mx-auto space-y-8 pb-10">
                    
                    {/* Meta Info Grid */}
                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                        <div className="grid grid-cols-3 gap-6">
                            {/* Priority */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Flag className="w-3.5 h-3.5" /> <strong>优先级 / Priority</strong>
                                </label>
                                <div className="bg-white p-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-900">
                                    {drawerData.priority || 'P2'}
                                </div>
                            </div>

                            {/* Type */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Tag className="w-3.5 h-3.5" /> <strong>类型 / Type</strong>
                                </label>
                                <div className="bg-white p-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-900">
                                    {drawerData.type || '功能用例'}
                                </div>
                            </div>

                            {/* Module */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5" /> <strong>模块 / Module</strong>
                                </label>
                                <div className="bg-white p-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-900">
                                    {drawerData.module || 'Default'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preconditions */}
                    <div className="editor-group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5" /> <strong>前置步骤 / Preconditions</strong>
                      </label>
                      <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 min-h-[100px] prose prose-sm max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: formatContent(drawerData.preconditions) || '<span class="text-gray-400 italic">无前置步骤</span>' }} />
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="editor-group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <List className="w-3.5 h-3.5" /> <strong>正文步骤 / Steps</strong>
                      </label>
                      <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 min-h-[200px] prose prose-sm max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: formatContent(drawerData.steps) || '<span class="text-gray-400 italic">无步骤内容</span>' }} />
                      </div>
                    </div>

                    {/* Expected Result */}
                    <div className="editor-group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5" /> <strong>预期结果 / Expected Result</strong>
                      </label>
                      <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 min-h-[100px] prose prose-sm max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: formatContent(drawerData.expectedResult) || '<span class="text-gray-400 italic">无预期结果</span>' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50/50 backdrop-blur-md border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => setIsDetailOpen(false)}
                    className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                  >
                    取消
                  </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AIGenerator;
