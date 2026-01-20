import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  FolderOpen, Plus, Filter, ChevronRight, ChevronDown, ChevronsDown, ChevronsUp,
  Search, Play, Trash2, Edit2, FolderPlus, FilePlus, Layout, FileText,
  X, Home, Mail, PieChart, Flag, MessageSquare, Leaf,
  Save, Eye, Image as ImageIcon, List, AlertCircle, CheckCircle, XCircle, Clock, CheckCircle2,
  Move, Copy, Upload, RefreshCw, Tag
} from 'lucide-react';
import axios from 'axios';
import XMindImportModal from '../components/XMindImportModal';
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
  .preview-content {
    padding: 20px;
    min-height: 150px; /* Reduced from 300px */
    line-height: 1.6;
    overflow-wrap: break-word;
  }
  .preview-content img, .w-e-text-container img {
    max-width: 100% !important;
    height: auto !important;
    border-radius: 8px;
    margin: 10px 0;
    display: block;
  }
  .preview-content table, .w-e-text-container table {
    border-collapse: collapse;
    width: 100% !important;
    margin: 10px 0;
    table-layout: fixed;
  }
  .preview-content table th,
  .preview-content table td,
  .w-e-text-container table th,
  .w-e-text-container table td {
    border: 1px solid #e5e7eb;
    padding: 8px 12px;
    text-align: left;
    min-width: 50px;
  }
  .preview-content table th, .w-e-text-container table th {
    background-color: #f9fafb;
  }
  
  /* Fix header styles not showing in editor and preview */
  .w-e-text-container h1, .preview-content h1 { font-size: 2em !important; font-weight: bold !important; margin: 0.67em 0 !important; display: block !important; }
  .w-e-text-container h2, .preview-content h2 { font-size: 1.5em !important; font-weight: bold !important; margin: 0.75em 0 !important; display: block !important; }
  .w-e-text-container h3, .preview-content h3 { font-size: 1.17em !important; font-weight: bold !important; margin: 0.83em 0 !important; display: block !important; }
  .w-e-text-container h4, .preview-content h4 { font-size: 1em !important; font-weight: bold !important; margin: 1.12em 0 !important; display: block !important; }
  .w-e-text-container h5, .preview-content h5 { font-size: 0.83em !important; font-weight: bold !important; margin: 1.5em 0 !important; display: block !important; }
  
  /* Optimize link styles to black */
  .w-e-text-container a, .preview-content a {
    color: #000000 !important; /* black */
    text-decoration: underline !important;
    cursor: pointer !important;
  }
  .w-e-text-container a:hover, .preview-content a:hover {
    color: #1f2937 !important; /* gray-800 */
  }

  /* Image Loading State */
  .img-loading {
    background: #f3f4f6;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: #9ca3af;
    font-size: 12px;
  }
`;

// Helper component for local-first image loading
const CachedImage = ({ src, alt, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    // Check if the URL is an OSS/remote URL
    const isRemote = src.startsWith('http') || src.startsWith('//');
    
    if (isRemote) {
      // Create an image object to check browser cache
      const img = new Image();
      
      // If the image is already in browser cache, it will trigger onload immediately
      img.onload = () => {
        setLoading(false);
        setError(false);
      };

      img.onerror = () => {
        // If it fails, we keep the original src as fallback
        setLoading(false);
        setError(true);
      };

      img.src = src;
    } else {
      setLoading(false);
    }
  }, [src]);

  if (loading) {
    return <div className="img-loading">正在加载图片...</div>;
  }

  return (
    <img 
      src={currentSrc} 
      alt={alt || "用例图片"} 
      {...props} 
      onError={(e) => {
        if (!error) {
          setError(true);
          // If the primary loading failed, we can try to re-trigger or handle fallback here
          console.warn('Image load failed:', src);
        }
      }}
    />
  );
};

// Memoized Tree Node Component
const TreeNode = React.memo(({ 
  node, 
  depth = 0, 
  expandedNodes, 
  selectedNode, 
  toggleNode, 
  handleNodeClick, 
  handleOpenDrawer, 
  handleOpenModal, 
  handleDeleteNode,
  onRefreshNode
}) => {
  if (!node) return null;
  const isExpanded = expandedNodes.has(`${node.type}-${node.id}`);
  const isSelected = selectedNode?.type === node.type && selectedNode?.id === node.id;
  const isCase = node.type === 'case';
  const hasChildren = isCase ? false : (node.hasChildren !== false);

  return (
    <div key={`${node.type}-${node.id}`}>
      <div 
        className={`flex items-center py-2 px-3 cursor-pointer rounded-lg transition-colors group ${
          isSelected ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-700'
        } ${isCase ? 'opacity-80' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onClick={() => {
          if (isCase) {
            handleOpenDrawer('edit', null, node);
          } else {
            handleNodeClick(node);
          }
        }}
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
            <div className="w-7 flex items-center justify-center mr-1">
              {isCase && <div className="w-1 h-1 rounded-full bg-gray-400" />}
            </div>
          )}
          {node.type === 'project' ? (
            <Layout className={`w-4 h-4 mr-2 ${isSelected ? 'text-white' : 'text-black'}`} />
          ) : node.type === 'module' ? (
            <FolderOpen className={`w-4 h-4 mr-2 ${isSelected ? 'text-white' : 'text-yellow-500'}`} />
          ) : (
            <FileText className={`w-3.5 h-3.5 mr-2 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
          )}
          <span className="truncate text-sm font-bold">{node.name}</span>
        </div>
        
        {!isCase && (
          <div className={`flex items-center gap-1 transition-opacity ${isSelected ? 'text-white' : 'text-gray-400'}`}>
            <button 
              onClick={(e) => { e.stopPropagation(); handleOpenDrawer('add', node); }}
              className="p-1 hover:bg-black/10 rounded" title="新增用例"
            >
              <Plus className="w-3 h-3" />
            </button>
            {depth < 10 && (
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
        )}
      </div>
      
      {isExpanded && Array.isArray(node.children) && node.children.map(child => (
        <TreeNode 
          key={`${child.type}-${child.id}`}
          node={child} 
          depth={depth + 1}
          expandedNodes={expandedNodes}
          selectedNode={selectedNode}
          toggleNode={toggleNode}
          handleNodeClick={handleNodeClick}
          handleOpenDrawer={handleOpenDrawer}
          handleOpenModal={handleOpenModal}
          handleDeleteNode={handleDeleteNode}
          onRefreshNode={onRefreshNode}
        />
      ))}
    </div>
  );
});

// Memoized Test Case Row Component
const MoveTreeNode = React.memo(({ 
  node, 
  depth = 0, 
  expandedNodes, 
  setExpandedNodes, 
  moveTarget, 
  setMoveTarget 
}) => {
  if (!node || node.type === 'case') return null;
  const isExpanded = expandedNodes.has(`move-${node.type}-${node.id}`);
  const isSelected = moveTarget?.type === node.type && moveTarget?.id === node.id;
  const hasChildren = node.hasChildren !== false;

  return (
    <div key={`move-${node.type}-${node.id}`}>
      <div 
        className={`flex items-center py-2 px-3 cursor-pointer rounded-lg transition-colors group ${
          isSelected ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-700'
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onClick={() => {
          setMoveTarget({
            id: node.id,
            type: node.type,
            projectId: node.type === 'project' ? node.id : (node.projectId || node.project?.id),
            moduleId: node.type === 'module' ? node.id : null
          });
        }}
      >
        <div className="flex items-center flex-1 min-w-0">
          {hasChildren ? (
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setExpandedNodes(prev => {
                  const next = new Set(prev);
                  const key = `move-${node.type}-${node.id}`;
                  if (next.has(key)) next.delete(key);
                  else next.add(key);
                  return next;
                });
              }}
              className="p-1 hover:bg-white/10 rounded mr-1"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <div className="w-7 flex items-center justify-center mr-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            </div>
          )}
          {node.type === 'project' ? (
            <Layout className={`w-4 h-4 mr-2 ${isSelected ? 'text-white' : 'text-black'}`} />
          ) : (
            <FolderOpen className={`w-4 h-4 mr-2 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-black'}`} />
          )}
          <span className="text-sm font-bold truncate">{node.name}</span>
        </div>
      </div>
      {isExpanded && node.children && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          {node.children.map(child => (
            <MoveTreeNode 
              key={`move-${child.type}-${child.id}`}
              node={child} 
              depth={depth + 1}
              expandedNodes={expandedNodes}
              setExpandedNodes={setExpandedNodes}
              moveTarget={moveTarget}
              setMoveTarget={setMoveTarget}
            />
          ))}
        </div>
      )}
    </div>
  );
});

const TestCaseRow = React.memo(({ 
  tc, 
  selectedCaseIds, 
  isSelectAllPages, 
  toggleCaseSelection, 
  openStatusDropdownId, 
  setOpenStatusDropdownId, 
  handleStatusChange, 
  handleOpenDrawer, 
  handleCopyCase, 
  handleDeleteCase,
  selectedNode
}) => {
  return (
    <tr key={tc.id} className="hover:bg-gray-50/50 transition-colors group">
      <td className="px-6 py-5">
        <input 
          type="checkbox" 
          checked={selectedCaseIds.has(tc.id) || isSelectAllPages}
          onChange={() => toggleCaseSelection(tc.id)}
          className="rounded border-gray-300 text-black focus:ring-black"
        />
      </td>
      <td className="px-6 py-5 font-mono text-xs text-gray-400">TC-{tc.id.toString().padStart(4, '0')}</td>
      <td className="px-6 py-5 font-bold text-gray-900 text-sm">{tc.name}</td>
      <td className="px-6 py-5">
        <div className="relative inline-block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenStatusDropdownId(openStatusDropdownId === tc.id ? null : tc.id);
            }}
            className={`flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all hover:shadow-sm w-24 ${
              tc.status === 'SUCCESS' ? 'bg-green-50 text-green-600 border-green-200 hover:border-green-400' :
              tc.status === 'FAILED' ? 'bg-red-50 text-red-600 border-red-200 hover:border-red-400' :
              'bg-gray-50 text-black border-gray-200 hover:border-black'
            }`}
          >
            <span className="flex-1 text-center">
              {tc.status === 'SUCCESS' ? '执行成功' :
               tc.status === 'FAILED' ? '执行失败' : '待执行'}
            </span>
            <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${openStatusDropdownId === tc.id ? 'rotate-180' : ''}`} />
          </button>

          {openStatusDropdownId === tc.id && (
            <>
              <div className="fixed inset-0 z-[100]" onClick={(e) => { e.stopPropagation(); setOpenStatusDropdownId(null); }} />
              <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-[101] animate-in fade-in zoom-in-95 duration-200">
                {[
                  { value: 'PENDING', label: '待执行', color: 'text-black', dot: 'bg-black' },
                  { value: 'SUCCESS', label: '执行成功', color: 'text-green-600', dot: 'bg-green-600' },
                  { value: 'FAILED', label: '执行失败', color: 'text-red-600', dot: 'bg-red-600' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(tc, opt.value);
                      setOpenStatusDropdownId(null);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors text-left group ${
                      tc.status === opt.value ? 'bg-gray-50/50' : ''
                    }`}
                  >
                    <span className={`text-[11px] font-bold ${
                      tc.status === opt.value ? opt.color : 'text-gray-700'
                    }`}>
                      {opt.label}
                    </span>
                    {tc.status === opt.value && (
                      <div className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="w-24 flex justify-center">
          <span className={`text-[12px] font-black ${
            tc.priority === 'P0' ? 'text-red-500' :
            tc.priority === 'P1' ? 'text-orange-500' :
            'text-black'
          }`}>{tc.priority}</span>
        </div>
      </td>
      <td className="px-6 py-5 text-xs font-bold text-gray-500">{tc.creator || 'Admin'}</td>
      <td className="px-6 py-5 text-xs text-gray-400">
        {tc.updatedAt ? new Date(tc.updatedAt).toLocaleString() : '-'}
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex justify-end gap-1 transition-opacity">
          <button 
            onClick={() => handleOpenDrawer('view', selectedNode, tc)}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors"
            title="查看"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleOpenDrawer('edit', selectedNode, tc)}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors"
            title="编辑"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleCopyCase(tc.id)}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors"
            title="复制"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDeleteCase(tc.id)}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
});

// Memoized Preview Content Component to prevent double rendering
const PreviewContent = React.memo(({ html, emptyText }) => {
  return (
    <div 
      className="preview-content prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: html || `<p class="text-gray-400 italic">${emptyText}</p>` }}
    />
  );
});

const CaseManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null); // { type: 'project' | 'module', id: number }
  const [testCases, setTestCases] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [jumpPage, setJumpPage] = useState('');
  const [selectedCaseIds, setSelectedCaseIds] = useState(new Set());
  const [isSelectAllPages, setIsSelectAllPages] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0, maxHeight: 300 });
  const typeButtonRef = useRef(null);
  const [caseTypes, setCaseTypes] = useState([]); // Available case types
  const [isAddingType, setIsAddingType] = useState(false); // Modal for adding type
  const [newTypeName, setNewTypeName] = useState('');

  // Fetch case types on mount
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
        // If in create/edit mode, select the new type
        if (isDrawerOpen) {
            setDrawerData(prev => ({ ...prev, type: res.data.name }));
        }
        setNewTypeName('');
        setIsAddingType(false);
    } catch (err) {
        alert(err.response?.data?.error || '添加失败');
    }
  };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBatchStatusModalOpen, setIsBatchStatusModalOpen] = useState(false);
  const [batchUpdateError, setBatchUpdateError] = useState(null);
  const [newBatchStatus, setNewBatchStatus] = useState('SUCCESS');
  const [loading, setLoading] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false); // 详情加载专用状态
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [isPriorityFilterOpen, setIsPriorityFilterOpen] = useState(false);
  const [isBatchExecModalOpen, setIsBatchExecModalOpen] = useState(false);
  const [isBatchMoveModalOpen, setIsBatchMoveModalOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState(null); // { projectId, moduleId }
  const [batchExecStatus, setBatchExecStatus] = useState({}); // { caseId: 'pending' | 'running' | 'success' | 'failed' }
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState(null);
  const [isDrawerStatusOpen, setIsDrawerStatusOpen] = useState(false);
  const [showSelectionWarning, setShowSelectionWarning] = useState(false);
  const [isEditorsVisible, setIsEditorsVisible] = useState(false); // New state for lazy loading editors
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const statusFilterRef = useRef(null);
  const priorityFilterRef = useRef(null);
  const statusDropdownRef = useRef(null);

  // Helper to find path in tree
  const findNodePath = (nodes, targetId, targetType, path = []) => {
    if (!Array.isArray(nodes)) return null;
    for (const node of nodes) {
      const currentPath = [...path, node.name];
      if (node.id === targetId && node.type === targetType) {
        return currentPath;
      }
      if (node.children && node.children.length > 0) {
        const result = findNodePath(node.children, targetId, targetType, currentPath);
        if (result) return result;
      }
    }
    return null;
  };

  // Helper for processing HTML to use CachedImage
  const processHtmlWithCache = useCallback((html) => {
    if (!html) return html;
    
    // 过滤无效的图片 src，防止列表数据中的 raw filename 触发无效请求
    // 仅允许 http/https (OSS签名URL)、data: (Base64) 或 / (静态资源)
    return html.replace(/src=['"]([^'"]+)['"]/gi, (match, src) => {
      // 检查是否为有效 URL
      if (!src.startsWith('http') && !src.startsWith('https') && !src.startsWith('data:') && !src.startsWith('/')) {
        // 如果是相对路径或文件名（通常是未签名的 OSS key），替换为空 src
        // 这样浏览器就不会发起无效请求（404）
        return 'src="" data-pending-src="' + src + '"';
      }
      return match;
    });
  }, []);

  useEffect(() => {
    // Add a global listener for image errors to handle fallbacks if needed
    const handleGlobalImageError = (e) => {
      if (e.target.tagName === 'IMG' && (e.target.closest('.preview-content') || e.target.closest('.w-e-text-container'))) {
        console.warn('Rich text image failed to load:', e.target.src);
        // We could implement more complex fallback logic here if needed
      }
    };

    window.addEventListener('error', handleGlobalImageError, true);
    return () => window.removeEventListener('error', handleGlobalImageError, true);
  }, []);

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add'); // 'add', 'edit'
  const [drawerData, setDrawerData] = useState({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [drawerKey, setDrawerKey] = useState(Date.now());

  // Modal State
  const [modalType, setModalType] = useState(null); // 'project', 'module'
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '确认操作',
    message: '',
    onConfirm: null
  });

  // WangEditor instances
  const [editorPre, setEditorPre] = useState(null);
  const [editorSteps, setEditorSteps] = useState(null);
  const [editorExp, setEditorExp] = useState(null);
  const [editorAct, setEditorAct] = useState(null);

  // WangEditor configs
  const toolbarConfig = useMemo(() => ({
    toolbarKeys: [
      'fullScreen',
      '|',
      'undo',
      'redo',
      '|',
      'clearStyle',
      '|',
      'headerSelect',
      'fontSize',
      'bold',
      'italic',
      'through',
      'underline',
      '|',
      'color',
      'bgColor',
      '|',
      'justifyLeft',
      'justifyCenter',
      'justifyRight',
      'justifyJustify',
      '|',
      'bulletedList',
      'numberedList',
      'todo',
      'blockquote',
      '|',
      'uploadImage',
      'insertTable',
      '|',
      'indent',
      'delIndent',
      'lineHeight',
      'insertLink'
    ]
  }), []);

  const editorConfig = useMemo(() => ({
    placeholder: '请输入内容...',
    hoverbarKeys: {
      text: { menuKeys: [] },
      image: { menuKeys: [] },
      link: { menuKeys: [] },
      table: { menuKeys: [] },
      attachment: { menuKeys: [] }
    },
    MENU_CONF: {
      fontSize: {
        fontSizeList: ['12px', '13px', '14px', '15px', '16px', '19px', '22px', '24px', '29px', '32px']
      },
      uploadImage: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        // 本地预览：插入 Base64 到编辑器，点击保存按钮时后端会统一处理上传
        async customUpload(file, insertFn) {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result;
            // 插入 Base64 数据，并将原始文件名存入 alt 属性，方便后端生成有意义的文件名
            insertFn(base64, file.name, base64);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }), []);

  // Timely destroy editors
  useEffect(() => {
    return () => {
      if (editorPre) editorPre.destroy();
      if (editorSteps) editorSteps.destroy();
      if (editorExp) editorExp.destroy();
      if (editorAct) editorAct.destroy();
    };
  }, [editorPre, editorSteps, editorExp, editorAct]);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Clear editor instances when drawer closes or mode switches
  useEffect(() => {
    if (!isDrawerOpen || isPreviewMode) {
      setEditorPre(null);
      setEditorSteps(null);
      setEditorExp(null);
      setEditorAct(null);
      setIsEditorsVisible(false);
    } else {
      // 如果正在加载数据（编辑/查看模式），先不显示编辑器，避免加载空数据导致图片无法渲染
      if (drawerLoading) {
        setIsEditorsVisible(false);
        return;
      }

      // Delay showing editors to reduce initial lag when drawer opens
      const timer = setTimeout(() => {
        setIsEditorsVisible(true);
      }, 100); // 100ms delay is enough to let the drawer animation finish
      return () => clearTimeout(timer);
    }
  }, [isDrawerOpen, isPreviewMode, drawerLoading]);

  // Auto-save timer
  const autoSaveTimerRef = useRef(null);

  // 辅助函数：草稿保存前移除 Base64 图片，防止 LocalStorage 溢出
  const stripImagesForDraft = (data) => {
    if (!data) return data;
    const strip = (html) => {
      if (typeof html !== 'string') return html;
      // 使用正则替换 img 标签中的 src，避免创建 DOM 元素导致浏览器发起请求
      // 优化：使用捕获组重构字符串，避免在长字符串上调用 replace 导致栈溢出
      return html.replace(/(<img[^>]+src=['"])([^'"]+)(['"][^>]*>)/gi, (match, prefix, src, suffix) => {
        if (src && src.startsWith('data:')) {
           // 将 Base64 替换为空，并添加 alt 提示
           const newSuffix = suffix.replace(/>$/, ' alt="[图片暂存，保存后同步]">');
           return `${prefix}${newSuffix}`;
        }
        return match;
      });
    };
    return {
      ...data,
      preconditions: strip(data.preconditions),
      steps: strip(data.steps),
      expectedResult: strip(data.expectedResult),
      actualResult: strip(data.actualResult)
    };
  };

  // Auto-save logic
  useEffect(() => {
    if (isDrawerOpen && drawerData.name) {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        try {
          const draftData = stripImagesForDraft(drawerData);
          const draftStr = JSON.stringify(draftData);
          // 只有当草稿内容发生变化时才保存
          const oldDraft = localStorage.getItem('case_draft');
          if (oldDraft !== draftStr) {
            localStorage.setItem('case_draft', draftStr);
          }
        } catch (e) {
          if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            console.warn('Draft auto-save failed: LocalStorage quota exceeded. Cleaning up...');
            // 如果超限，尝试清除旧的草稿或其他非必要数据
            const keys = Object.keys(localStorage);
            for (const key of keys) {
              if (key.startsWith('case_draft_') || key === 'case_draft') {
                localStorage.removeItem(key);
              }
            }
          } else {
            console.error('Draft auto-save failed:', e);
          }
        }
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
      setSelectedNode(null);
      setShowSelectionWarning(false);
      setTestCases([]);
    } else {
      setTreeData([]);
      setSelectedNode(null);
      setShowSelectionWarning(false);
      setTestCases([]);
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
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      showToast('获取部门列表失败: ' + errorMsg, 'error');
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
          loaded: false,
          hasChildren: p.hasChildren
        }));
        setTreeData(projects);
        setLoading(false);
        return projects;
      } else {
        console.error('Expected projects array but got:', response.data);
        setTreeData([]);
        setLoading(false);
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      showToast('获取项目列表失败: ' + errorMsg, 'error');
      setTreeData([]);
      setLoading(false);
      return [];
    }
  };

  const handleImportSuccess = async (newProjectId) => {
    showToast('导入成功', 'success');
    setIsImportModalOpen(false);
    
    // Refresh tree data
    const projects = await fetchProjects(selectedDeptId);
    
    // If we have a new project ID, find and select it
    if (newProjectId && projects && projects.length > 0) {
        // Ensure newProjectId is a number if needed
        const targetId = Number(newProjectId);
        const newProject = projects.find(p => p.id === targetId);
        
        if (newProject) {
            handleNodeClick(newProject);
            
            // Auto expand the new project
            setExpandedNodes(prev => {
                const newKeys = new Set(prev);
                newKeys.add(`project-${newProject.id}`);
                return newKeys;
            });
            
            // Manually refresh the node to load its children (since fetchProjects resets loaded state)
            await refreshTreeNode(newProject.id, 'project');
        }
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
          loaded: false,
          hasChildren: m.hasChildren
        }));
      }
      console.error('Expected modules array but got:', response.data);
      return [];
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      showToast('获取模块列表失败: ' + errorMsg, 'error');
      return [];
    }
  };

  // 获取用例列表
  const fetchTestCases = async (id, type = 'module', recursive = true, page = 0, size = 10, keyword = '', status = '', priority = '') => {
    try {
      setLoading(true);
      const nodeParam = type === 'module' ? `moduleId=${id}` : `projectId=${id}`;
      let url = `/api/cases/list?${nodeParam}&recursive=${recursive}&page=${page}&size=${size}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      if (status) url += `&status=${status}`;
      if (priority) url += `&priority=${priority}`;
      
      const response = await axios.get(url);
      if (response.data && Array.isArray(response.data.content)) {
        setTestCases(response.data.content);
        setTotalElements(response.data.totalElements);
        setCurrentPage(response.data.number);
      } else {
        console.error('Expected paginated response but got:', response.data);
        setTestCases([]);
        setTotalElements(0);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch cases:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      showToast('获取用例列表失败: ' + errorMsg, 'error');
      setTestCases([]);
      setTotalElements(0);
      setLoading(false);
    }
  };

  // 当搜索、筛选或过滤条件变化时，重置页码
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedNode, searchTerm, statusFilter, priorityFilter]);

  // 当搜索、筛选或分页变化时重新加载
  useEffect(() => {
    if (selectedNode) {
      const timer = setTimeout(() => {
        fetchTestCases(
          selectedNode.id, 
          selectedNode.type, 
          true, 
          currentPage, 
          pageSize, 
          searchTerm, 
          statusFilter, 
          priorityFilter
        );
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedNode, currentPage, pageSize, searchTerm, statusFilter, priorityFilter]);

  // 处理状态快速切换
  const handleStatusChange = async (tc, newStatus) => {
    try {
      await axios.put(`/api/cases/test-case/${tc.id}`, { status: newStatus });
      // 局部更新列表状态
      setTestCases(prev => prev.map(item => item.id === tc.id ? { ...item, status: newStatus } : item));
    } catch (error) {
      console.error('Update status failed:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      showToast('更新状态失败: ' + errorMsg, 'error');
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

  // 一键展开所有项目及其已加载节点
  const expandAll = async () => {
    if (!Array.isArray(treeData) || treeData.length === 0) return;
    
    // 如果没有任何节点加载过子节点，且都是项目节点，则尝试加载第一层
    const needsInitialLoad = treeData.every(node => node.type === 'project' && !node.loaded);
    
    if (needsInitialLoad) {
      setLoading(true);
      try {
        const newTreeData = [...treeData];
        const promises = newTreeData.map(async (node, index) => {
          if (node.type === 'project' && !node.loaded) {
            const [subModules, caseRes] = await Promise.all([
              fetchModules(node.id),
              axios.get(`/api/cases/list?projectId=${node.id}&recursive=false&size=1000`).catch(() => ({ data: { content: [] } }))
            ]);
            
            const caseData = caseRes.data.content || (Array.isArray(caseRes.data) ? caseRes.data : []);
            const cases = caseData.map(tc => ({ ...tc, type: 'case', isLeaf: true }));
            const children = [...subModules, ...cases];
            
            return { ...node, children, loaded: true, hasChildren: children.length > 0 };
          }
          return node;
        });

        const updatedNodes = await Promise.all(promises);
        setTreeData(updatedNodes);
        
        const allKeys = new Set();
        updatedNodes.forEach(node => {
          allKeys.add(`${node.type}-${node.id}`);
          if (node.children) {
            node.children.forEach(child => {
              if (child.type === 'module') allKeys.add(`${child.type}-${child.id}`);
            });
          }
        });
        setExpandedNodes(allKeys);
      } catch (error) {
        console.error('Expand all failed:', error);
        const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
        showToast('一键展开失败: ' + errorMsg, 'error');
      } finally {
        setLoading(false);
      }
    } else {
      // 原有的逻辑：仅展开已加载的
      const allKeys = new Set();
      const collectKeys = (nodes) => {
        if (!Array.isArray(nodes)) return;
        nodes.forEach(node => {
          if (node.type === 'project' || node.type === 'module') {
            allKeys.add(`${node.type}-${node.id}`);
            if (Array.isArray(node.children) && node.children.length > 0) {
              collectKeys(node.children);
            }
          }
        });
      };
      collectKeys(treeData);
      setExpandedNodes(allKeys);
    }
  };

  // 一键收起所有节点
  const collapseAll = () => {
    setExpandedNodes(new Set());
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
          try {
            const [subModules, caseRes] = await Promise.all([
              fetchModules(node.id),
              axios.get(`/api/cases/list?projectId=${node.id}&recursive=false&size=1000`)
            ]);
            
            const caseData = caseRes.data.content || (Array.isArray(caseRes.data) ? caseRes.data : []);
            const cases = caseData.map(tc => ({
              ...tc,
              type: 'case',
              isLeaf: true
            }));
            children = [...subModules, ...cases];
          } catch (e) {
            console.error('Failed to fetch cases for project:', e);
            const errorMsg = e.response?.data?.message || e.response?.data?.error || e.message;
            showToast('加载用例失败: ' + errorMsg, 'error');
            // 降级只加载模块
            children = await fetchModules(node.id);
          }
        } else if (node.type === 'module') {
          const projectId = node.project?.id || node.projectId;
          try {
            const [subModules, caseRes] = await Promise.all([
              fetchModules(projectId, node.id),
              axios.get(`/api/cases/list?moduleId=${node.id}&recursive=false&size=1000`)
            ]);
            
            const caseData = caseRes.data.content || (Array.isArray(caseRes.data) ? caseRes.data : []);
            const cases = caseData.map(tc => ({
              ...tc,
              type: 'case',
              isLeaf: true
            }));
            children = [...subModules, ...cases];
          } catch (e) {
            console.error('Failed to fetch cases for tree:', e);
            const errorMsg = e.response?.data?.message || e.response?.data?.error || e.message;
            showToast('加载用例失败: ' + errorMsg, 'error');
            // 降级只加载模块
            children = await fetchModules(projectId, node.id);
          }
        }
        
        setTreeData(prev => updateTreeNode(prev, node.id, node.type, { children, loaded: true, hasChildren: children.length > 0 }));
      }
    }
    setExpandedNodes(newExpanded);
  };

  // 点击节点
  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setShowSelectionWarning(false);
    setCurrentPage(0); // 切换节点时重置分页
    // 加载该节点及其所有子节点的用例
    fetchTestCases(node.id, node.type, true, 0, pageSize, searchTerm, statusFilter, priorityFilter);
  };

  // 刷新左侧树数据（从顶级开始）
  const refreshTree = async () => {
    if (selectedDeptId) {
      await fetchProjects(selectedDeptId);
      showToast('刷新成功', 'success');
    } else {
      showToast('请先选择部门', 'warning');
    }
  };

  // 刷新指定树节点的子节点（包含模块和用例）
  const refreshTreeNode = async (nodeId, nodeType) => {
    try {
      let projectId = nodeType === 'project' ? nodeId : (treeData.find(n => n.id === nodeId && n.type === 'module')?.projectId || selectedNode?.projectId);
      if (!projectId && nodeType === 'module') {
        // 兜底方案：从树中找
        const findProjectId = (data) => {
          for (const n of data) {
            if (n.type === 'module' && n.id === nodeId) return n.projectId;
            if (n.children) {
              const res = findProjectId(n.children);
              if (res) return res;
            }
          }
          return null;
        };
        const pId = findProjectId(treeData);
        if (pId) projectId = pId;
      }

      const [subModules, caseRes] = await Promise.all([
        fetchModules(projectId, nodeType === 'module' ? nodeId : null),
        axios.get(`/api/cases/list?${nodeType === 'module' ? 'moduleId' : 'projectId'}=${nodeId}&recursive=false&size=1000`)
      ]);

      const caseData = caseRes.data.content || (Array.isArray(caseRes.data) ? caseRes.data : []);
      const children = [...subModules, ...caseData.map(tc => ({ ...tc, type: 'case', isLeaf: true }))];
      
      setTreeData(prev => updateTreeNode(prev, nodeId, nodeType, { 
        children, 
        loaded: true, 
        hasChildren: children.length > 0 
      }));
      return children;
    } catch (e) {
      console.error('Refresh tree node failed:', e);
      const errorMsg = e.response?.data?.message || e.response?.data?.error || e.message;
      showToast('刷新树节点失败: ' + errorMsg, 'error');
      return [];
    }
  };

  // Load draft on open
  const handleOpenDrawer = async (mode, node, caseData = null) => {
    setDrawerMode(mode);
    setIsPreviewMode(mode === 'view');
    setDrawerKey(Date.now()); // 每次打开抽屉都刷新 key，强制组件重置
    
    // 如果需要加载详情，提前设置为 loading 状态，防止旧数据闪烁或重复渲染
    const willFetch = mode !== 'add' && caseData && caseData.id;
    if (willFetch) {
      setDrawerLoading(true);
    } else {
      setDrawerLoading(false);
    }

    // 定义完整的基础数据结构，确保所有字段都被初始化/清空
    const emptyData = {
      name: '',
      preconditions: '',
      steps: '',
      expectedResult: '',
      actualResult: '',
      priority: 'P1',
      status: 'PENDING',
      type: '功能用例',
      projectId: node?.type === 'project' ? node.id : (node?.projectId || node?.project?.id),
      moduleId: node?.type === 'module' ? node.id : null
    };

    if (mode === 'add') {
      // 新增模式下，彻底清空数据，不再自动加载草稿以避免混淆
      setDrawerData(emptyData);
      localStorage.removeItem('case_draft'); // 清除可能的旧草稿
      setIsDrawerOpen(true);
    } else {
      // 编辑或查看模式，先设置基础数据，然后异步加载详情
      if (caseData && caseData.id) {
        // 设置初始数据（来自列表），但在加载完成前隐藏内容（通过 drawerLoading 控制 display: none）
        // 这样可以避免列表中的旧数据（可能是 raw path）触发无效的图片请求
        // 另外，为了防止图片请求，我们显式清空富文本字段
        const initialData = { ...caseData };
        initialData.preconditions = '';
        initialData.steps = '';
        initialData.expectedResult = '';
        initialData.actualResult = '';

        // 先设置数据，再打开抽屉，配合 drawerLoading=true，确保第一次渲染就是 Loading 状态
        setDrawerData({
          ...emptyData,
          ...initialData
        });
        
        // 确保 drawerLoading 在渲染前生效 (其实上面已经 setDrawerLoading(true) 了)
        // 使用 setTimeout 打开抽屉可以把状态更新放入下一个 tick，
        // 但为了防止闪烁，这里直接设为 true，依赖 drawerLoading 屏蔽内容
        setIsDrawerOpen(true);

        try {
          const response = await axios.get(`/api/cases/test-case/${caseData.id}`);
          setDrawerData({
            ...emptyData,
            ...response.data,
            oldName: response.data.name,
            oldModuleId: response.data.moduleId
          });
          // 数据加载完成后，再次刷新 key 强制编辑器重新挂载，确保显示图片
          // 仅在编辑模式下需要这样做（因为编辑器组件需要重置），查看模式下不需要（避免重复渲染导致图片请求翻倍）
          if (mode === 'edit') {
            setDrawerKey(Date.now());
          }
        } catch (error) {
          console.error('Fetch test case detail failed:', error);
          showToast('获取用例详情失败', 'error');
        } finally {
          setDrawerLoading(false);
        }
      } else {
        setDrawerData({
          ...emptyData,
          ...caseData
        });
        setIsDrawerOpen(true);
      }
    }
  };

  const handleOpenModal = (type, mode, node = null) => {
    setModalType(type);
    setModalMode(mode);
    if (mode === 'edit') {
      setFormData(node);
    } else {
      if (type === 'module') {
        // 如果是从树节点点击“新增子模块”，node 必然存在
        if (node) {
          const projectId = node.type === 'project' ? node.id : (node.projectId || node.project?.id);
          const parentId = node.type === 'module' ? node.id : null;
          setFormData({ 
            name: '',
            projectId: projectId, 
            project: { id: projectId }, 
            parentId: parentId 
          });
        } else {
          // 如果没有传入节点（理论上不应该发生，除非有全局的新增模块按钮）
          setFormData({ 
            name: '',
            projectId: selectedNode?.projectId || (selectedNode?.type === 'project' ? selectedNode.id : null),
            parentId: selectedNode?.type === 'module' ? selectedNode.id : null 
          });
        }
      } else {
        setFormData({ name: '' });
      }
    }
    setIsModalOpen(true);
  };

  const handleSaveDrawer = async () => {
    try {
      if (!drawerData.name) {
        showToast('请输入用例名称', 'warning');
        return;
      }

      setLoading(true);

      const method = drawerMode === 'add' ? 'post' : 'put';
      let saveUrl = drawerMode === 'add' ? '/api/cases/test-case' : `/api/cases/test-case/${drawerData.id}`;
      
      if (drawerMode === 'edit' && !drawerData.id) {
        console.error('Cannot update test case: missing ID', drawerData);
        showToast('更新失败：缺少ID', 'error');
        setLoading(false);
        return;
      }

      const payload = {
        ...drawerData,
        module: drawerData.moduleId ? { id: drawerData.moduleId } : null
      };

      console.log('Sending test case request:', { method, url: saveUrl });
      const response = await axios[method](saveUrl, payload);
      
      showToast(drawerMode === 'add' ? '创建成功' : '更新成功', 'success');
      
      // 停止加载状态，并关闭抽屉
      setLoading(false);
      setIsDrawerOpen(false);

      // 后台异步刷新数据，不阻塞 UI 
      setTimeout(async () => {
        const { moduleId, projectId, name } = drawerData;
        
        // 1. 局部更新右侧列表 (如果是编辑模式)
        if (drawerMode === 'edit') {
          setTestCases(prev => prev.map(tc => tc.id === response.data.id ? { ...tc, ...response.data } : tc));
        } else if (selectedNode) {
          // 新增模式还是需要刷新列表，或者手动插入
          fetchTestCases(selectedNode.id, selectedNode.type, true, 0, pageSize, searchTerm, statusFilter, priorityFilter);
        }

        // 2. 刷新左侧树节点 (仅当新增、或者名称/位置发生变化时刷新)
        // 这里的逻辑可以进一步精细化，目前先处理名称和目录变化
        const isNameChanged = drawerMode === 'edit' && response.data.name !== drawerData.oldName;
        const isModuleChanged = drawerMode === 'edit' && response.data.moduleId !== drawerData.oldModuleId;
        const isNewCase = drawerMode === 'add';

        if (isNewCase || isNameChanged || isModuleChanged) {
          const targetId = moduleId || projectId;
          const targetType = moduleId ? 'module' : 'project';
          
          if (targetId) {
            // 确保节点被展开
            setExpandedNodes(prev => {
              const next = new Set(prev);
              next.add(`${targetType}-${targetId}`);
              return next;
            });
            
            await refreshTreeNode(targetId, targetType);

            // 3. 如果是新增，自动定位到该节点
            if (drawerMode === 'add') {
              const newNode = { id: targetId, type: targetType, projectId: projectId };
              setSelectedNode(newNode);
              setCurrentPage(0);
            }
          }
        }
      }, 0);
    } catch (error) {
      console.error('Save test case failed:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || '保存失败';
      showToast(errorMsg, 'error');
      if (error.response?.data) {
        console.error('Backend error detail:', error.response.data);
      }
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.name) {
        showToast('请输入名称', 'warning');
        return;
      }

      let url = '';
      let data = { ...formData };
      
      if (modalType === 'project') {
        if (!selectedDeptId) {
          showToast('请先在上方选择部门后再创建项目', 'warning');
          return;
        }
        url = '/api/cases/projects';
        data = {
          id: formData.id,
          name: formData.name,
          description: formData.description,
          department: { id: selectedDeptId }
        };
      } else if (modalType === 'module') {
        url = '/api/cases/modules';
        if (modalMode === 'add') {
          // 优先使用 formData 中的 ID，这些在 handleOpenModal 中已经正确设置
          const projectId = formData.projectId || formData.project?.id;
          // 注意：parentId 可能是 null，所以不能简单地用 || 运算符
          const parentId = formData.hasOwnProperty('parentId') ? formData.parentId : null;
          
          if (!projectId) {
            showToast('项目ID不能为空', 'error');
            return;
          }
          
          data = {
            name: formData.name,
            projectId: projectId,
            parentId: parentId
          };
        } else {
          data = {
            id: formData.id,
            name: formData.name,
            projectId: formData.projectId || formData.project?.id,
            parentId: formData.parentId
          };
        }
      }

      const method = modalMode === 'add' ? 'post' : 'put';
      let finalUrl = url;
      if (modalMode === 'edit') {
        if (!formData.id) {
          console.error('Cannot update: missing ID', { modalType, formData });
          showToast('更新失败：缺少ID', 'error');
          return;
        }
        finalUrl = `${url}/${formData.id}`;
      }
      
      console.log('Sending request:', { 
        method, 
        finalUrl, 
        data, 
        modalType, 
        modalMode, 
        formDataId: formData.id 
      });
      
      const response = await axios[method](finalUrl, data);
      console.log('Request successful:', response.data);
      setIsModalOpen(false);
      
      const newNode = response.data;
      
      // Refresh data
      if (modalType === 'project') {
        const projectNode = { 
          ...newNode, 
          type: 'project', 
          children: newNode.children || [], 
          loaded: !!newNode.loaded,
          hasChildren: !!newNode.hasChildren
        };
        
        if (modalMode === 'add') {
          setTreeData(prev => [...prev, projectNode]);
          setSelectedNode(projectNode);
          setTestCases([]);
        } else {
          setTreeData(prev => prev.map(n => (n.id === newNode.id && n.type === 'project') ? { ...n, ...projectNode } : n));
          if (selectedNode?.id === newNode.id && selectedNode?.type === 'project') {
            setSelectedNode(projectNode);
          }
        }
      } else if (modalType === 'module') {
        const projectId = formData.projectId || formData.project?.id || (selectedNode?.type === 'project' ? selectedNode?.id : selectedNode?.projectId);
        const parentId = formData.parentId;
        
        const targetId = parentId || projectId;
        const targetType = parentId ? 'module' : 'project';
        
        if (targetId) {
          await refreshTreeNode(targetId, targetType);
        }

        if (modalMode === 'add') {
          const moduleNode = { ...newNode, type: 'module', projectId: projectId };
          setSelectedNode(moduleNode);
          setTestCases([]);
          
          // Expand parent
          setExpandedNodes(prev => {
            const next = new Set(prev);
            next.add(`${targetType}-${targetId}`);
            return next;
          });
        }
      }
    } catch (error) {
      console.error('Save failed:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      showToast('保存失败: ' + errorMsg, 'error');
    }
  };

  const handleDeleteNode = (e, node) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      title: '确认删除',
      message: `确定要删除${node.type === 'project' ? '项目' : '模块'} "${node.name}" 吗？`,
      onConfirm: async () => {
        try {
          const url = node.type === 'project' ? `/api/cases/projects/${node.id}` : `/api/cases/modules/${node.id}`;
          await axios.delete(url);
          
          if (node.type === 'project') {
            setTreeData(prev => prev.filter(n => !(n.id === node.id && n.type === 'project')));
          } else {
            const projectId = node.projectId || node.project?.id;
            const parentId = node.parentId;
            const targetId = parentId || projectId;
            const targetType = parentId ? 'module' : 'project';
            
            if (targetId) {
              await refreshTreeNode(targetId, targetType);
            }
          }
          
          if (selectedNode?.id === node.id && selectedNode?.type === node.type) {
            setSelectedNode(null);
            setTestCases([]);
          }
        } catch (error) {
          console.error('Delete failed:', error);
          const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
          showToast('删除失败: ' + errorMsg, 'error');
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleDeleteCase = (caseId) => {
    setConfirmModal({
      isOpen: true,
      title: '确认删除',
      message: '确定要删除该用例吗？',
      onConfirm: async () => {
        try {
          const caseToDelete = testCases.find(tc => tc.id === caseId);
          const moduleId = caseToDelete?.moduleId;

          await axios.delete(`/api/cases/test-case/${caseId}`);
          
          showToast('用例删除成功', 'success');
          
          // 1. 刷新右侧列表
          if (selectedNode) {
            fetchTestCases(selectedNode.id, selectedNode.type);
          }

          // 2. 刷新树节点
          const projectId = caseToDelete?.projectId || selectedNode?.projectId || selectedNode?.id;
          const targetId = moduleId || projectId;
          const targetType = moduleId ? 'module' : 'project';
          
          if (targetId) {
            await refreshTreeNode(targetId, targetType);
          }
        } catch (error) {
          console.error('Delete case failed:', error);
          const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
          showToast('删除用例失败: ' + errorMsg, 'error');
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // 选择用例
  const toggleCaseSelection = (caseId) => {
    const newSelection = new Set(selectedCaseIds);
    if (newSelection.has(caseId)) {
      newSelection.delete(caseId);
      setIsSelectAllPages(false);
    } else {
      newSelection.add(caseId);
    }
    setSelectedCaseIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedCaseIds.size > 0 || isSelectAllPages) {
      setSelectedCaseIds(new Set());
      setIsSelectAllPages(false);
    } else {
      setSelectedCaseIds(new Set(testCases.map(c => c.id)));
    }
  };


  // 批量删除
  const handleBatchDelete = async () => {
    try {
      setLoading(true);
      let idsToDelete = Array.from(selectedCaseIds);
      
      if (isSelectAllPages && selectedNode) {
        // 如果是全选所有页，先获取所有 ID
        const nodeParam = selectedNode.type === 'module' ? `moduleId=${selectedNode.id}` : `projectId=${selectedNode.id}`;
        const url = `/api/cases/list?${nodeParam}&recursive=true&page=0&size=10000`;
        const res = await axios.get(url);
        idsToDelete = res.data.content.map(c => c.id);
      }

      if (idsToDelete.length === 0) return;

      await axios.post('/api/cases/test-case/batch-delete', idsToDelete);
      
      showToast('批量删除成功', 'success');
      
      // 1. 刷新右侧列表
      if (selectedNode) {
        fetchTestCases(selectedNode.id, selectedNode.type);
      }

      // 2. 刷新树状目录受影响的节点
      // 批量删除时，可能有多个模块受影响。最简单的是刷新当前选中的节点及其父节点
      if (selectedNode) {
        await refreshTreeNode(selectedNode.id, selectedNode.type);
      }

      setSelectedCaseIds(new Set());
      setIsSelectAllPages(false);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Batch delete failed:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      showToast('批量删除失败: ' + errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 批量执行/修改状态
  const handleBatchUpdateStatus = async () => {
    try {
      setLoading(true);
      setBatchUpdateError(null);
      let idsToUpdate = Array.from(selectedCaseIds);
      
      if (isSelectAllPages && selectedNode) {
        const nodeParam = selectedNode.type === 'module' ? `moduleId=${selectedNode.id}` : `projectId=${selectedNode.id}`;
        const url = `/api/cases/list?${nodeParam}&recursive=true&page=0&size=10000`;
        const res = await axios.get(url);
        idsToUpdate = res.data.content.map(c => c.id);
      }

      if (idsToUpdate.length === 0) return;
      
      await axios.post('/api/cases/test-case/batch-update-status', { 
        ids: idsToUpdate, 
        status: newBatchStatus 
      });

      // 局部更新列表
      if (!isSelectAllPages) {
        setTestCases(prev => prev.map(tc => selectedCaseIds.has(tc.id) ? { ...tc, status: newBatchStatus } : tc));
      } else if (selectedNode) {
        fetchTestCases(selectedNode.id, selectedNode.type);
      }

      setSelectedCaseIds(new Set());
      setIsSelectAllPages(false);
      setIsBatchStatusModalOpen(false);
    } catch (error) {
      console.error('Batch update status failed:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      showToast('批量更新状态失败: ' + errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 批量移动
  const handleBatchMove = async () => {
    try {
      if (!moveTarget || !moveTarget.projectId) {
        showToast('请选择目标项目或模块', 'error');
        return;
      }

      setLoading(true);
      let idsToMove = Array.from(selectedCaseIds);
      
      if (isSelectAllPages && selectedNode) {
        const nodeParam = selectedNode.type === 'module' ? `moduleId=${selectedNode.id}` : `projectId=${selectedNode.id}`;
        const url = `/api/cases/list?${nodeParam}&recursive=true&page=0&size=10000`;
        const res = await axios.get(url);
        idsToMove = res.data.content.map(c => c.id);
      }

      if (idsToMove.length === 0) return;

      await axios.put('/api/cases/batch-move', {
        ids: idsToMove,
        targetProjectId: moveTarget.projectId,
        targetModuleId: moveTarget.moduleId
      });

      showToast('批量移动成功', 'success');
      setSelectedCaseIds(new Set());
      setIsSelectAllPages(false);
      setIsBatchMoveModalOpen(false);
      setMoveTarget(null);
      
      // 异步刷新受影响的节点，不阻塞 UI
      setTimeout(async () => {
        // 1. 刷新右侧列表
        if (selectedNode) {
          fetchTestCases(selectedNode.id, selectedNode.type);
        }
        
        // 2. 刷新源节点（当前选中的节点）
        if (selectedNode) {
          await refreshTreeNode(selectedNode.id, selectedNode.type);
        }
        
        // 3. 刷新目标节点
        if (moveTarget && moveTarget.id) {
          await refreshTreeNode(moveTarget.id, moveTarget.type);
        }
      }, 0);
    } catch (error) {
      console.error('Batch move failed:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      showToast('批量移动失败: ' + errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 复制用例
  const handleCopyCase = async (caseId) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/cases/test-case/${caseId}/copy`);
      const tc = response.data;
      showToast('用例复制成功', 'success');
      
      // 局部更新列表
      if (selectedNode) {
        // 如果复制出的用例属于当前查看的项目/模块，则添加到列表
        const isCurrentProject = !tc.moduleId && selectedNode.type === 'project' && tc.projectId === selectedNode.id;
        const isCurrentModule = tc.moduleId && selectedNode.type === 'module' && tc.moduleId === selectedNode.id;
        
        if (isCurrentProject || isCurrentModule) {
          setTestCases(prev => [tc, ...prev]);
          setTotalElements(prev => prev + 1);
        } else {
          // 否则刷新列表
          fetchTestCases(selectedNode.id, selectedNode.type);
        }
      }

      // 刷新树中当前节点的子项
      const targetId = tc.moduleId || tc.projectId;
      const targetType = tc.moduleId ? 'module' : 'project';
      
      if (targetId) {
        await refreshTreeNode(targetId, targetType);
      }
    } catch (error) {
      console.error('Copy case failed:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      showToast('复制用例失败: ' + errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };


  // 渲染树节点
  const handleAddCaseClick = () => {
    if (!selectedNode) {
      setShowSelectionWarning(true);
      return;
    }
    setShowSelectionWarning(false);
    handleOpenDrawer('add', selectedNode);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full mx-auto pt-4 gap-4">
      <style>{editorStyles}</style>
      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[2000] overflow-hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-[1320px] bg-white shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="h-full flex flex-col">
                <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-200">
                      <FilePlus className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-black text-gray-900 leading-tight">
                        {drawerMode === 'add' ? '新增测试用例' : drawerMode === 'edit' ? '编辑测试用例' : '查看测试用例'}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {drawerMode === 'add' ? 'Creating new test scenario' : drawerMode === 'edit' ? `Editing Case ID: ${drawerData.id}` : `Viewing Case ID: ${drawerData.id}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-xl mr-2">
                      <button 
                        onClick={() => setIsPreviewMode(false)}
                        disabled={drawerMode === 'view' || drawerMode === 'edit'}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!isPreviewMode ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'} ${drawerMode === 'view' || drawerMode === 'edit' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        编辑模式
                      </button>
                      <button 
                        onClick={() => setIsPreviewMode(true)}
                        disabled={drawerMode === 'view' || drawerMode === 'edit'}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${isPreviewMode ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'} ${drawerMode === 'view' || drawerMode === 'edit' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        预览模式
                      </button>
                    </div>
                    <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-black">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto relative" key={drawerKey}>
                  {drawerLoading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-[100] flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-black uppercase tracking-widest text-gray-500">正在获取详情...</span>
                      </div>
                    </div>
                  )}
                  <div className="p-8 space-y-12">
                  {/* Top: Name, Priority, Status aligned */}
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block"><strong>用例名称 / Case Name</strong></label>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                          {(() => {
                            const path = drawerData.moduleId 
                              ? findNodePath(treeData, drawerData.moduleId, 'module')
                              : findNodePath(treeData, drawerData.projectId, 'project');
                            
                            if (!path) return <span>{drawerData.moduleId ? '未知目录' : '项目根目录'}</span>;
                            
                            return path.map((name, index) => (
                              <React.Fragment key={index}>
                                <span className={index === path.length - 1 ? 'text-black font-black' : ''}>{name}</span>
                                {index < path.length - 1 && <ChevronRight className="w-2.5 h-2.5 text-gray-300 mx-0.5" />}
                              </React.Fragment>
                            ));
                          })()}
                        </div>
                      </div>
                      <input 
                        type="text" 
                        value={drawerData.name || ''} 
                        disabled={isPreviewMode}
                        onChange={(e) => setDrawerData({ ...drawerData, name: e.target.value })}
                        className={`w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold transition-all focus:ring-0 focus:border-black/5 ${
                          isPreviewMode ? 'cursor-default' : 'hover:bg-gray-100/50'
                        }`}
                        placeholder="输入用例名称..."
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5" /> <strong>类型 / Type</strong>
                        </label>
                        <div className="relative">
                          <button
                            ref={typeButtonRef}
                            disabled={isPreviewMode}
                            onClick={() => {
                              if (!isTypeDropdownOpen && typeButtonRef.current) {
                                  const rect = typeButtonRef.current.getBoundingClientRect();
                                  const spaceBelow = window.innerHeight - rect.bottom - 20;
                                  const spaceAbove = rect.top - 20;
                                  
                                  // Prefer bottom if space is sufficient (e.g. > 200px) or if bottom has more space than top
                                  if (spaceBelow >= 200 || spaceBelow > spaceAbove) {
                                      setDropdownPos({
                                          top: rect.bottom + 8,
                                          left: rect.left,
                                          width: rect.width,
                                          maxHeight: Math.min(300, spaceBelow),
                                          placement: 'bottom'
                                      });
                                  } else {
                                      // Otherwise place on top
                                      setDropdownPos({
                                          bottom: window.innerHeight - rect.top + 8,
                                          left: rect.left,
                                          width: rect.width,
                                          maxHeight: Math.min(300, spaceAbove),
                                          placement: 'top'
                                      });
                                  }
                              }
                              setIsTypeDropdownOpen(!isTypeDropdownOpen);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all text-sm font-bold bg-white shadow-sm ${
                              isPreviewMode 
                                ? 'cursor-default border-gray-100 bg-gray-50/50 text-gray-400' 
                                : 'cursor-pointer border-gray-200 hover:border-black focus:border-black'
                            }`}
                          >
                            <span className="text-gray-700">
                              {drawerData.type || '功能用例'}
                            </span>
                            {!isPreviewMode && (
                              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                            )}
                          </button>
                          
                          {isTypeDropdownOpen && !isPreviewMode && createPortal(
                            <>
                              <div className="fixed inset-0 z-[9998]" onClick={() => setIsTypeDropdownOpen(false)} />
                              <div 
                                className={`fixed z-[9999] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden ${
                                    dropdownPos.placement === 'top' ? 'origin-bottom' : 'origin-top'
                                }`}
                                style={{
                                    top: dropdownPos.placement === 'bottom' ? dropdownPos.top : undefined,
                                    bottom: dropdownPos.placement === 'top' ? dropdownPos.bottom : undefined,
                                    left: dropdownPos.left,
                                    width: dropdownPos.width,
                                    maxHeight: dropdownPos.maxHeight
                                }}
                              >
                                <div className="overflow-y-auto flex-1 py-2">
                                    {caseTypes.map(t => (
                                      <button
                                        key={t.id}
                                        onClick={() => {
                                          setDrawerData({ ...drawerData, type: t.name });
                                          setIsTypeDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left group ${
                                          drawerData.type === t.name ? 'bg-gray-50/50' : ''
                                        }`}
                                      >
                                        <span className={`text-sm font-bold ${
                                          drawerData.type === t.name ? 'text-black' : 'text-gray-700'
                                        }`}>
                                          {t.name}
                                        </span>
                                        {drawerData.type === t.name && (
                                          <CheckCircle2 className="w-4 h-4 text-black" />
                                        )}
                                      </button>
                                    ))}
                                </div>
                                <div className="p-2 border-t border-gray-100 bg-gray-50/30 shrink-0">
                                    <button
                                      onClick={() => {
                                        setIsAddingType(true);
                                        setIsTypeDropdownOpen(false);
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-left text-blue-600 font-bold text-sm"
                                    >
                                      <Plus className="w-4 h-4" />
                                      <span>新增类型...</span>
                                    </button>
                                </div>
                              </div>
                            </>,
                            document.body
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Flag className="w-3.5 h-3.5" /> <strong>优先级 / Priority</strong>
                        </label>
                        <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl border-2 border-transparent">
                          {['P0', 'P1', 'P2', 'P3'].map(p => (
                            <button
                              key={p}
                              disabled={isPreviewMode}
                              onClick={() => setDrawerData({ ...drawerData, priority: p })}
                              className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${
                                drawerData.priority === p 
                                  ? 'bg-white text-black shadow-[0_4px_12px_rgba(0,0,0,0.1)] scale-105 border border-gray-100' 
                                  : 'text-gray-400 hover:text-black'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Play className="w-3.5 h-3.5" /> <strong>执行状态 / Status</strong>
                        </label>
                        <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl border-2 border-transparent">
                          {[
                            { value: 'PENDING', label: '待执行' },
                            { value: 'SUCCESS', label: '成功' },
                            { value: 'FAILED', label: '失败' }
                          ].map(opt => (
                            <button
                              key={opt.value}
                              disabled={isPreviewMode}
                              onClick={() => setDrawerData({ ...drawerData, status: opt.value })}
                              className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${
                                drawerData.status === opt.value 
                                  ? 'bg-white text-black shadow-[0_4px_12px_rgba(0,0,0,0.1)] scale-105 border border-gray-100' 
                                  : 'text-gray-400 hover:text-black'
                              } ${
                                drawerData.status === opt.value && opt.value === 'SUCCESS' ? 'text-green-600' :
                                drawerData.status === opt.value && opt.value === 'FAILED' ? 'text-red-600' : ''
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rich Text Areas */}
                  <div className="space-y-8">
                    <div className="editor-group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5" /> <strong>前置步骤 / Preconditions</strong>
                      </label>
                      <div className="rounded-2xl border-2 border-gray-50 bg-white" style={{ overflow: 'visible', zIndex: 60 }}>
                        {!isPreviewMode ? (
                          <div className="min-h-[300px] flex flex-col">
                            {isEditorsVisible ? (
                              <>
                                <Toolbar
                                  key={`toolbar-pre-${drawerKey}`}
                                  editor={editorPre}
                                  defaultConfig={toolbarConfig}
                                  mode="default"
                                />
                                <Editor
                                  key={`pre-${drawerKey}`}
                                  defaultConfig={{...editorConfig, placeholder: '详细描述测试执行前需要满足的条件和准备工作...'}}
                                  defaultHtml={drawerData.preconditions || ''}
                                  onCreated={setEditorPre}
                                  onChange={editor => setDrawerData(prev => ({...prev, preconditions: editor.getHtml()}))}
                                  mode="default"
                                  style={{ height: 'auto', minHeight: '300px' }}
                                />
                              </>
                            ) : (
                              <div className="flex-1 flex items-center justify-center p-20 text-gray-400">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-5 h-5 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">编辑器加载中...</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <PreviewContent 
                            key={`preview-pre-${drawerData.id}`}
                            html={!drawerLoading ? processHtmlWithCache(drawerData.preconditions) : ''}
                            emptyText="暂无前置步骤"
                          />
                        )}
                      </div>
                    </div>

                    <div className="editor-group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <List className="w-3.5 h-3.5" /> <strong>正文步骤 / Steps</strong>
                      </label>
                      <div className="rounded-2xl border-2 border-gray-50 bg-white" style={{ overflow: 'visible', zIndex: 50 }}>
                        {!isPreviewMode ? (
                          <div className="min-h-[300px] flex flex-col">
                            {isEditorsVisible ? (
                              <>
                                <Toolbar
                                  key={`toolbar-steps-${drawerKey}`}
                                  editor={editorSteps}
                                  defaultConfig={toolbarConfig}
                                  mode="default"
                                />
                                <Editor
                                  key={`steps-${drawerKey}`}
                                  defaultConfig={{...editorConfig, placeholder: '详细描述测试执行的步骤...'}}
                                  defaultHtml={drawerData.steps || ''}
                                  onCreated={setEditorSteps}
                                  onChange={editor => setDrawerData(prev => ({...prev, steps: editor.getHtml()}))}
                                  mode="default"
                                  style={{ height: 'auto', minHeight: '300px' }}
                                />
                              </>
                            ) : (
                              <div className="flex-1 flex items-center justify-center p-20 text-gray-400">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-5 h-5 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">编辑器加载中...</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <PreviewContent 
                            key={`preview-steps-${drawerData.id}`}
                            html={!drawerLoading ? processHtmlWithCache(drawerData.steps) : ''}
                            emptyText="暂无正文步骤"
                          />
                        )}
                      </div>
                    </div>

                    <div className="editor-group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <List className="w-3.5 h-3.5" /> <strong>预期效果 / Expected Result</strong>
                      </label>
                      <div className="rounded-2xl border-2 border-gray-50 bg-white" style={{ overflow: 'visible', zIndex: 40 }}>
                        {!isPreviewMode ? (
                          <div className="min-h-[300px] flex flex-col">
                            {isEditorsVisible ? (
                              <>
                                <Toolbar
                                  key={`toolbar-exp-${drawerKey}`}
                                  editor={editorExp}
                                  defaultConfig={toolbarConfig}
                                  mode="default"
                                />
                                <Editor
                                  key={`exp-${drawerKey}`}
                                  defaultConfig={{...editorConfig, placeholder: '描述在执行上述步骤后，系统应该呈现的状态或返回的结果...'}}
                                  defaultHtml={drawerData.expectedResult || ''}
                                  onCreated={setEditorExp}
                                  onChange={editor => setDrawerData(prev => ({...prev, expectedResult: editor.getHtml()}))}
                                  mode="default"
                                  style={{ height: 'auto', minHeight: '300px' }}
                                />
                              </>
                            ) : (
                              <div className="flex-1 flex items-center justify-center p-20 text-gray-400">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-5 h-5 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">编辑器加载中...</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <PreviewContent 
                            key={`preview-exp-${drawerData.id}`}
                            html={!drawerLoading ? processHtmlWithCache(drawerData.expectedResult) : ''}
                            emptyText="暂无预期效果"
                          />
                        )}
                      </div>
                    </div>

                    <div className="editor-group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5" /> <strong>实际结果 / Actual Result</strong>
                      </label>
                      <div className="rounded-2xl border-2 border-gray-50 bg-white" style={{ overflow: 'visible', zIndex: 30 }}>
                        {!isPreviewMode ? (
                          <div className="min-h-[300px] flex flex-col">
                            {isEditorsVisible ? (
                              <>
                                <Toolbar
                                  key={`toolbar-act-${drawerKey}`}
                                  editor={editorAct}
                                  defaultConfig={toolbarConfig}
                                  mode="default"
                                />
                                <Editor
                                  key={`act-${drawerKey}`}
                                  defaultConfig={{...editorConfig, placeholder: '记录在测试执行过程中，系统实际呈现的状态或返回的结果...'}}
                                  defaultHtml={drawerData.actualResult || ''}
                                  onCreated={setEditorAct}
                                  onChange={editor => setDrawerData(prev => ({...prev, actualResult: editor.getHtml()}))}
                                  mode="default"
                                  style={{ height: 'auto', minHeight: '300px' }}
                                />
                              </>
                            ) : (
                              <div className="flex-1 flex items-center justify-center p-20 text-gray-400">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-5 h-5 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">编辑器加载中...</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <PreviewContent 
                            key={`preview-act-${drawerData.id}`}
                            html={!drawerLoading ? processHtmlWithCache(drawerData.actualResult) : ''}
                            emptyText="暂无实际结果"
                          />
                        )}
                      </div>
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
                  {drawerMode !== 'view' && (
                    <button 
                      onClick={handleSaveDrawer}
                      disabled={loading}
                      className={`flex-1 bg-black text-white py-4 rounded-2xl text-sm font-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 group ${
                        loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800 active:scale-[0.98]'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          保存中...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          保存
                        </>
                      )}
                    </button>
                  )}
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
              className={`flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border transition-all min-w-[200px] justify-between group shadow-sm ${
                isDeptDropdownOpen ? 'border-black ring-4 ring-gray-50' : 'border-gray-200 hover:border-black'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className={`w-5 h-5 ${isDeptDropdownOpen ? 'text-black' : 'text-gray-500'}`} />
                <span className="text-sm font-bold text-gray-900">
                  {departments.find(d => d.id === selectedDeptId)?.name || '选择部门'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDeptDropdownOpen ? 'rotate-180 text-black' : ''}`} />
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
                          selectedDeptId === dept.id ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          selectedDeptId === dept.id ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 group-hover:text-gray-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-sm font-bold ${
                          selectedDeptId === dept.id ? 'text-black' : 'text-gray-700'
                        }`}>{dept.name}</span>
                        {selectedDeptId === dept.id && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />
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
          {showSelectionWarning && !selectedNode && (
            <div className="flex items-center gap-2 text-orange-500 animate-pulse mr-4">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-bold">请先在左侧选择项目或模块再新增用例</span>
            </div>
          )}
          <button 
            onClick={() => {
                if (!selectedDeptId) {
                    showToast('请先选择部门', 'error');
                    return;
                }
                setIsImportModalOpen(true);
            }}
            className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all hover:shadow-lg active:scale-95 mr-3"
          >
            <Upload className="w-4 h-4" /> 导入XMind
          </button>
          <button 
            onClick={handleAddCaseClick}
            className="bg-black text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-all hover:shadow-xl active:scale-95"
          >
            <Plus className="w-4 h-4" /> 新增用例
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden pb-4">
        {/* Left Tree Area */}
        <div className="w-80 bg-white rounded-[32px] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <span className="text-sm font-black text-gray-900 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-black" />
              用例目录
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={expandAll}
                disabled={!selectedDeptId || treeData.length === 0}
                className={`p-1.5 rounded-lg transition-all ${!selectedDeptId || treeData.length === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-100 shadow-sm'}`}
                title="展开全部"
              >
                <ChevronsDown className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={collapseAll}
                disabled={!selectedDeptId || treeData.length === 0}
                className={`p-1.5 rounded-lg transition-all ${!selectedDeptId || treeData.length === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-100 shadow-sm'}`}
                title="收起全部"
              >
                <ChevronsUp className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => fetchProjects(selectedDeptId)}
                disabled={!selectedDeptId}
                className={`p-1.5 rounded-lg transition-all ${!selectedDeptId ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-100 shadow-sm'}`}
                title="刷新目录"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-3 bg-gray-200 mx-0.5" />
              <button 
                onClick={() => handleOpenModal('project', 'add')}
                disabled={!selectedDeptId}
                className={`p-2 rounded-xl transition-all shadow-sm border border-transparent ${!selectedDeptId ? 'text-gray-200 cursor-not-allowed' : 'hover:bg-white hover:border-gray-100 text-gray-400 hover:text-black'}`}
                title={!selectedDeptId ? "请先选择部门" : "新建项目"}
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {Array.isArray(treeData) && treeData.length > 0 ? (
              treeData.map(node => (
                <TreeNode 
                  key={`${node.type}-${node.id}`}
                  node={node}
                  expandedNodes={expandedNodes}
                  selectedNode={selectedNode}
                  toggleNode={toggleNode}
                  handleNodeClick={handleNodeClick}
                  handleOpenDrawer={handleOpenDrawer}
                  handleOpenModal={handleOpenModal}
                  handleDeleteNode={handleDeleteNode}
                />
              ))
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
                  placeholder="搜索名称、ID、步骤内容..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(0); // 搜索时重置分页
                  }}
                  className="pl-9 pr-4 py-1.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5 w-64 transition-all"
                />
              </div>
            </div>
            
            {/* 已选项提示和批量操作 */}
            {(selectedCaseIds.size > 0 || isSelectAllPages) && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                <span className="text-xs font-bold text-gray-400 mr-2">
                  已选择 {isSelectAllPages ? totalElements : selectedCaseIds.size} 项
                </span>
                <button 
                  onClick={() => setIsBatchStatusModalOpen(true)}
                  className="flex items-center gap-1.5 bg-white text-black hover:bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl transition-all text-xs font-black shadow-sm active:scale-95"
                >
                  <Play className="w-3.5 h-3.5" /> 批量执行
                </button>
                <button 
                  onClick={() => setIsBatchMoveModalOpen(true)}
                  className="flex items-center gap-1.5 bg-white text-black hover:bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl transition-all text-xs font-black shadow-sm active:scale-95"
                >
                  <Move className="w-3.5 h-3.5" /> 批量移动
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center gap-1.5 bg-white text-red-600 hover:bg-red-50 border border-red-100 px-3 py-1.5 rounded-xl transition-all text-xs font-black shadow-sm active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" /> 批量删除
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto relative">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-white sticky top-0 z-10">
                <tr className="text-[13px] uppercase font-black text-gray-500 tracking-wider">
                  <th className="px-6 py-5 w-16">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={testCases.length > 0 && (selectedCaseIds.size === testCases.length || isSelectAllPages)}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-black focus:ring-black"
                      />
                    </div>
                  </th>
                  <th className="px-6 py-5 w-24"><strong>ID</strong></th>
                  <th className="px-6 py-5 min-w-[300px]"><strong>用例名称</strong></th>
                  <th className="px-6 py-5 w-32">
                    <div className="flex items-center gap-2">
                      <strong>状态</strong>
                      <div className="relative" ref={statusFilterRef}>
                        <button 
                          onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                          className={`p-1.5 rounded-lg transition-all ${isStatusFilterOpen ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-black'}`}
                          title="筛选状态"
                        >
                          <Filter className={`w-3.5 h-3.5 ${statusFilter ? 'text-black' : ''}`} />
                        </button>
                        
                        {isStatusFilterOpen && (
                          <>
                            <div className="fixed inset-0 z-[100]" onClick={() => setIsStatusFilterOpen(false)} />
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-[101] animate-in fade-in zoom-in-95 duration-200">
                              {[
                                { value: '', label: '全部状态' },
                                { value: 'PENDING', label: '待执行' },
                                { value: 'SUCCESS', label: '执行成功' },
                                { value: 'FAILED', label: '执行失败' }
                              ].map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={() => {
                                    setStatusFilter(opt.value);
                                    setCurrentPage(0);
                                    setIsStatusFilterOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left group ${
                                    statusFilter === opt.value ? 'bg-gray-50' : ''
                                  }`}
                                >
                                  <span className={`text-sm font-bold ${
                                    statusFilter === opt.value ? 'text-black' : 'text-gray-700'
                                  }`}>
                                    {opt.label}
                                  </span>
                                  {statusFilter === opt.value && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-5 w-32">
                    <div className="flex items-center gap-2">
                      <strong>优先级</strong>
                      <div className="relative" ref={priorityFilterRef}>
                        <button 
                          onClick={() => setIsPriorityFilterOpen(!isPriorityFilterOpen)}
                          className={`p-1.5 rounded-lg transition-all ${isPriorityFilterOpen ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-black'}`}
                          title="筛选优先级"
                        >
                          <Filter className={`w-3.5 h-3.5 ${priorityFilter ? 'text-black' : ''}`} />
                        </button>

                        {isPriorityFilterOpen && (
                          <>
                            <div className="fixed inset-0 z-[100]" onClick={() => setIsPriorityFilterOpen(false)} />
                            <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-[101] animate-in fade-in zoom-in-95 duration-200">
                              {[
                                { value: '', label: '全部优先级' },
                                { value: 'P0', label: 'P0' },
                                { value: 'P1', label: 'P1' },
                                { value: 'P2', label: 'P2' },
                                { value: 'P3', label: 'P3' }
                              ].map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={() => {
                                    setPriorityFilter(opt.value);
                                    setCurrentPage(0);
                                    setIsPriorityFilterOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left group ${
                                    priorityFilter === opt.value ? 'bg-gray-50' : ''
                                  }`}
                                >
                                  <span className={`text-sm font-bold ${
                                    priorityFilter === opt.value ? 'text-black' : 'text-gray-700'
                                  }`}>
                                    {opt.label}
                                  </span>
                                  {priorityFilter === opt.value && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-5 w-32"><strong>创建人</strong></th>
                  <th className="px-6 py-5 w-40"><strong>更新时间</strong></th>
                  <th className="px-6 py-5 text-right w-32"><strong>操作</strong></th>
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
                ) : (Array.isArray(testCases) && testCases.length > 0) ? (
                  testCases.map((tc) => (
                    <TestCaseRow 
                      key={tc.id}
                      tc={tc}
                      selectedCaseIds={selectedCaseIds}
                      isSelectAllPages={isSelectAllPages}
                      toggleCaseSelection={toggleCaseSelection}
                      openStatusDropdownId={openStatusDropdownId}
                      setOpenStatusDropdownId={setOpenStatusDropdownId}
                      handleStatusChange={handleStatusChange}
                      handleOpenDrawer={handleOpenDrawer}
                      handleCopyCase={handleCopyCase}
                      handleDeleteCase={handleDeleteCase}
                      selectedNode={selectedNode}
                    />
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
              <span>共 {totalElements} 条数据</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  className="px-2 py-1 rounded hover:bg-white border border-transparent hover:border-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-1 rounded bg-black text-white font-bold">
                    {currentPage + 1}
                  </span>
                  <span className="px-1 text-gray-300">/</span>
                  <span className="px-1 font-bold text-gray-500">
                    {Math.max(1, Math.ceil(totalElements / pageSize))}
                  </span>
                </div>
                <button
                  disabled={currentPage >= Math.ceil(totalElements / pageSize) - 1}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-2 py-1 rounded hover:bg-white border border-transparent hover:border-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(0);
                  }}
                  className="ml-2 bg-transparent border-none focus:ring-0 cursor-pointer font-bold text-gray-500"
                >
                  <option value="10">10 条/页</option>
                  <option value="20">20 条/页</option>
                  <option value="50">50 条/页</option>
                  <option value="100">100 条/页</option>
                </select>
                <div className="flex items-center gap-1 ml-4 border-l border-gray-200 pl-4">
                  <span className="text-gray-400">跳至</span>
                  <input
                    type="text"
                    value={jumpPage}
                    onChange={(e) => setJumpPage(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && jumpPage) {
                        const page = Math.min(Math.max(1, parseInt(jumpPage)), Math.ceil(totalElements / pageSize)) - 1;
                        setCurrentPage(page);
                        setJumpPage('');
                      }
                    }}
                    className="w-12 h-6 bg-white border border-gray-200 rounded text-center text-[10px] font-bold focus:ring-1 focus:ring-black outline-none"
                  />
                  <span className="text-gray-400">页</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 添加新类型弹框 */}
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

      {/* 批量修改状态弹框 */}
      {isBatchStatusModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => {
            setIsBatchStatusModalOpen(false);
            setBatchUpdateError(null);
          }} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg shadow-gray-100">
                  <Play className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">批量修改状态</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Update Status in Bulk</p>
                </div>
              </div>
              <button onClick={() => {
                setIsBatchStatusModalOpen(false);
                setBatchUpdateError(null);
              }} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8">
              <p className="text-sm font-bold text-gray-500 mb-6 text-center">请选择要更新的目标状态</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'PENDING', label: '待执行', icon: Clock, color: 'text-black', bg: 'bg-gray-50', border: 'border-gray-100', active: 'ring-2 ring-black ring-offset-2' },
                  { value: 'SUCCESS', label: '执行成功', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', active: 'ring-2 ring-green-600 ring-offset-2' },
                  { value: 'FAILED', label: '执行失败', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', active: 'ring-2 ring-red-600 ring-offset-2' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setNewBatchStatus(opt.value);
                      setBatchUpdateError(null);
                    }}
                    className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                      newBatchStatus === opt.value 
                        ? `${opt.bg} ${opt.border} ${opt.active} scale-105 shadow-lg` 
                        : 'bg-white border-gray-50 hover:border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${opt.bg} ${opt.color}`}>
                      <opt.icon className="w-8 h-8" />
                    </div>
                    <span className={`text-xs font-black ${newBatchStatus === opt.value ? opt.color : 'text-gray-500'}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50">
              {batchUpdateError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-bold">{batchUpdateError}</span>
                </div>
              )}
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setIsBatchStatusModalOpen(false);
                    setBatchUpdateError(null);
                  }}
                  className="flex-1 py-3 border-2 border-gray-100 text-gray-400 rounded-2xl text-sm font-bold hover:bg-white hover:text-gray-600 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={handleBatchUpdateStatus}
                  disabled={loading}
                  className="flex-[2] py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  确认更新
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 批量删除确认弹框 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6 shadow-inner">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">确认批量删除？</h3>
              <p className="text-sm font-bold text-gray-500">
                您将删除已选中的 {isSelectAllPages ? '该目录下所有页' : `${selectedCaseIds.size} 条`} 测试用例。此操作不可撤销，请谨慎操作。
              </p>
            </div>
            
            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 border-2 border-gray-100 text-gray-400 rounded-2xl text-sm font-bold hover:bg-white hover:text-gray-600 transition-all"
              >
                取消
              </button>
              <button 
                onClick={handleBatchDelete}
                disabled={loading}
                className="flex-[2] py-3 bg-red-600 text-white rounded-2xl text-sm font-bold hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 批量执行状态弹框 */}
      {isBatchExecModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsBatchExecModalOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                  <Play className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">批量执行状态</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Batch Execution Progress</p>
                </div>
              </div>
              <button onClick={() => setIsBatchExecModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {testCases.filter(tc => selectedCaseIds.has(tc.id)).map(tc => (
                  <div key={tc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-2 h-2 rounded-full ${
                        batchExecStatus[tc.id] === 'success' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' :
                        batchExecStatus[tc.id] === 'failed' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' :
                        batchExecStatus[tc.id] === 'running' ? 'bg-black animate-pulse' :
                        'bg-gray-300'
                      }`} />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-gray-900 truncate">ID: {tc.id} - {tc.name}</span>
                        <span className="text-[10px] font-bold text-gray-400">
                          {batchExecStatus[tc.id] === 'success' ? '执行通过' :
                           batchExecStatus[tc.id] === 'failed' ? '执行失败' :
                           batchExecStatus[tc.id] === 'running' ? '正在执行...' : '等待执行'}
                        </span>
                      </div>
                    </div>
                    {batchExecStatus[tc.id] === 'running' && (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    )}
                    {batchExecStatus[tc.id] === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {batchExecStatus[tc.id] === 'failed' && <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex justify-end">
              <button 
                onClick={() => setIsBatchExecModalOpen(false)}
                className="px-8 py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all active:scale-95"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 自定义确认弹框 */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} />
          <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-black">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{confirmModal.title}</h3>
              <p className="text-sm font-bold text-gray-500 leading-relaxed">{confirmModal.message}</p>
            </div>
            <div className="px-8 pb-8 flex gap-3">
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 py-3 bg-gray-50 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all active:scale-95"
              >
                取消
              </button>
              <button 
                onClick={confirmModal.onConfirm}
                className="flex-1 py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 active:scale-95"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 批量移动弹框 */}
      {isBatchMoveModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsBatchMoveModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg shadow-gray-100">
                  <Move className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">批量移动用例</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">选择目标项目或模块</p>
                </div>
              </div>
              <button onClick={() => setIsBatchMoveModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {treeData.length > 0 ? (
                <div className="space-y-1">
                  {treeData.map(node => (
                    <MoveTreeNode 
                      key={`move-${node.type}-${node.id}`}
                      node={node}
                      expandedNodes={expandedNodes}
                      setExpandedNodes={setExpandedNodes}
                      moveTarget={moveTarget}
                      setMoveTarget={setMoveTarget}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <FolderOpen className="w-12 h-12 opacity-10 mb-4" />
                  <p className="text-sm">暂无目录数据</p>
                </div>
              )}
            </div>

            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs font-bold text-gray-400">
                {moveTarget ? (
                  <span className="text-black">
                    已选择: <span className="underline">{moveTarget.type === 'project' ? '项目' : '模块'} - {
                      // Find name in treeData
                      (function findName(nodes) {
                        for(const n of nodes) {
                          if(n.id === moveTarget.id && n.type === moveTarget.type) return n.name;
                          if(n.children) {
                            const found = findName(n.children);
                            if(found) return found;
                          }
                        }
                        return '';
                      })(treeData)
                    }</span>
                  </span>
                ) : '请选择目标位置'}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsBatchMoveModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-black transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleBatchMove}
                  disabled={!moveTarget || loading}
                  className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg flex items-center gap-2 ${
                    !moveTarget || loading 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-black text-white hover:bg-gray-800 active:scale-95 shadow-gray-200'
                  }`}
                >
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  确认移动
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* XMind Import Modal */}
      <XMindImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={handleImportSuccess}
        departmentId={selectedDeptId}
        projectId={selectedNode ? (selectedNode.type === 'project' ? selectedNode.id : selectedNode.projectId) : null}
      />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top-4 duration-300">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md border ${
            toast.type === 'success' 
              ? 'bg-green-50/90 border-green-100 text-green-600' 
              : 'bg-red-50/90 border-red-100 text-red-600'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="text-sm font-black tracking-tight">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManagement;
