import React, { useState, useRef } from 'react';
import { X, Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const XMindImportModal = ({ isOpen, onClose, onSuccess, departmentId, projectId }) => {
  const [step, setStep] = useState(1);
  const [importMode, setImportMode] = useState('new');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setUploadProgress(0);
      setError(null);
      setImportMode('new');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadTemplate = async () => {
    try {
        const response = await axios.get('/api/xmind/template', {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '用例模版.xmind');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Failed to download template", err);
        setError("下载模版失败，请稍后重试");
    }
  };

  const processUpload = async (file) => {
    if (!file) return;

    if (!file.name.endsWith('.xmind')) {
        setError("请上传 .xmind 格式的文件");
        return;
    }

    setStep(2);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    // 总是发送部门 ID
    if (departmentId) {
        formData.append('departmentId', departmentId);
    }
    
    // 只有在“导入到当前项目”模式下，才发送项目 ID
    if (importMode === 'merge' && projectId) {
        formData.append('projectId', projectId);
    }
    
    formData.append('importMode', importMode);
    const username = localStorage.getItem('username');
    if (username) {
        formData.append('username', username);
    }

    try {
        const response = await axios.post('/api/xmind/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            }
        });
        
        // Add a small delay to show 100% before switching
        setTimeout(() => {
            setStep(3);
            if (onSuccess && response.data && response.data.projectId) {
                onSuccess(response.data.projectId);
            } else if (onSuccess) {
                onSuccess();
            }
        }, 500);
        
    } catch (err) {
        console.error("Import failed", err);
        setError("导入失败: " + (err.response?.data || err.message));
        setStep(1); // Go back to upload if failed
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processUpload(file);
  };

  const handleClose = () => {
      setStep(1);
      setUploadProgress(0);
      setError(null);
      onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-[700px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">导入 XMind 用例</h3>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              {/* Row 1: Download and Target Selection */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column: Download Template */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-black p-2.5 rounded-xl">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-base font-bold text-gray-900">1. 下载模版</h4>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1">
                    请使用标准 XMind 模版编写用例，确保解析成功。
                  </p>
                  <button 
                    onClick={handleDownloadTemplate}
                    className="w-full py-3 bg-white border border-gray-200 text-gray-900 rounded-xl text-xs font-bold hover:bg-gray-50 hover:border-black transition-all shadow-sm"
                  >
                    下载【用例模版.xmind】
                  </button>
                </div>

                {/* Right Column: Import Target */}
                <div className={`p-6 rounded-2xl border flex flex-col gap-4 ${projectId ? 'bg-gray-50 border-gray-100' : 'bg-gray-50/50 border-dashed border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className="bg-black p-2.5 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-base font-bold text-gray-900">2. 导入目标</h4>
                  </div>
                  
                  {projectId ? (
                    <div className="flex flex-col gap-2 flex-1 justify-center">
                      <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${importMode === 'new' ? 'bg-white border-black shadow-md scale-[1.02]' : 'border-transparent hover:bg-white/50'}`}>
                        <input 
                          type="radio" 
                          name="importMode" 
                          value="new" 
                          checked={importMode === 'new'}
                          onChange={() => setImportMode('new')}
                          className="text-black focus:ring-black"
                        />
                        <span className="text-sm font-bold">创建新项目</span>
                      </label>
                      <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${importMode === 'merge' ? 'bg-white border-black shadow-md scale-[1.02]' : 'border-transparent hover:bg-white/50'}`}>
                        <input 
                          type="radio" 
                          name="importMode" 
                          value="merge" 
                          checked={importMode === 'merge'}
                          onChange={() => setImportMode('merge')}
                          className="text-black focus:ring-black"
                        />
                        <span className="text-sm font-bold">导入到当前项目</span>
                      </label>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center flex-1 text-center">
                      <AlertCircle className="w-8 h-8 text-gray-300 mb-2" />
                      <p className="text-sm font-bold text-gray-400">未选择项目</p>
                      <p className="text-[11px] text-gray-500 mt-1">系统将自动在当前部门下创建新项目</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Upload Area */}
              <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center gap-6 hover:border-black hover:bg-gray-50 transition-all cursor-pointer group bg-gray-50/30"
                   onClick={() => fileInputRef.current?.click()}
                   onDragOver={(e) => e.preventDefault()}
                   onDrop={handleDrop}
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 border border-gray-50">
                  <Upload className="w-10 h-10 text-gray-300 group-hover:text-black transition-colors" />
                </div>
                <div className="text-center space-y-2">
                  <h4 className="text-xl font-black text-gray-900">3. 上传 XMind 文件</h4>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-gray-400">点击或拖拽文件到此处开始导入</p>
                    <p className="text-[11px] text-gray-500">支持标准 .xmind 格式文件</p>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden"
                  accept=".xmind"
                  onChange={handleFileChange}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl text-sm font-bold">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="py-8 text-center space-y-6">
                <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="48"
                            cy="48"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            className="text-gray-100"
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={283}
                            strokeDashoffset={283 - (283 * uploadProgress) / 100}
                            className="text-black transition-all duration-300 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-black">{uploadProgress}%</span>
                    </div>
                </div>
                <p className="text-gray-500 font-medium animate-pulse">正在导入用例，请稍候...</p>
            </div>
          )}

          {step === 3 && (
            <div className="py-6 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">导入成功!</h3>
                    <p className="text-gray-500">用例已成功生成，请在列表中查看。</p>
                </div>
                <button 
                    onClick={handleClose}
                    className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
                >
                    完成
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default XMindImportModal;
