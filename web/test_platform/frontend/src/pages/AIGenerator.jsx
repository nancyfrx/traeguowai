import React, { useState } from 'react';
import { Sparkles, Zap, Copy, Trash2, FileText, Loader2 } from 'lucide-react';
import CryptoJS from 'crypto-js';

const AIGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [requirement, setRequirement] = useState('');
  const [result, setResult] = useState(null);

  const generateToken = async (apiKey) => {
    const [id, secret] = apiKey.split('.');
    const header = { alg: 'HS256', sign_type: 'SIGN' };
    const payload = {
      api_key: id,
      exp: Date.now() + 3600 * 1000,
      timestamp: Date.now()
    };
    
    const base64UrlEncode = (obj) => {
      return btoa(JSON.stringify(obj))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    };

    const unsignedToken = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}`;
    const signature = CryptoJS.HmacSHA256(unsignedToken, secret);
    const base64Signature = CryptoJS.enc.Base64.stringify(signature)
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return `${unsignedToken}.${base64Signature}`;
  };

  const handleGenerate = async () => {
    if (!requirement.trim()) {
      alert('Please enter requirement description');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this key should be in environment variables or backend proxy
      const token = await generateToken("23204924195156455ee147659695034a.bl5S3g0x7wY5X5X1");
      
      const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          model: "glm-4",
          messages: [
            {
              role: "system",
              content: "You are a Senior QA 1. Generate a comprehensive test case list based on the user's requirements. Format: Test Module, Test Point, Pre-conditions, Steps, Expected Result. Output in clean Markdown."
            },
            {
              role: "user",
              content: requirement
            }
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0].message) {
        setResult(data.choices[0].message.content);
      } else {
        setResult('API Error: Failed to generate content');
      }
    } catch (error) {
      console.error(error);
      setResult(`Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl card-hover overflow-hidden flex flex-col md:flex-row min-h-[600px] max-w-7xl mx-auto mt-4">
      {/* Input Area */}
      <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50">
        <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-3">
          <div className="p-2 bg-black rounded-lg text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          AI Generator
        </h3>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">Powered by GLM-4. Generate comprehensive test scenarios from simple descriptions.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Requirement Description</label>
            <textarea 
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              className="w-full h-80 p-4 rounded-xl border-0 bg-white shadow-sm ring-1 ring-gray-200 text-sm focus:ring-2 focus:ring-black/10 resize-none transition-shadow" 
              placeholder="e.g. User registration flow including phone verification, password strength check, and error handling..."
            ></textarea>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? 'Generating...' : 'Generate Cases'}
          </button>
        </div>
      </div>

      {/* Output Area */}
      <div className="w-full md:w-2/3 p-8 flex flex-col bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-gray-900">Results</h3>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                if (result) {
                  navigator.clipboard.writeText(result);
                  // Using a more subtle way to show success if possible, but alert is fine for now
                  // alert('Copied to clipboard'); 
                  // If we had showToast here, we would use it.
                }
              }}
              className="glass-btn px-4 py-2 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-2 hover:text-black"
            >
              <Copy className="w-3 h-3" /> Copy
            </button>
            <button 
              onClick={() => setResult(null)}
              className="glass-btn px-4 py-2 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-2 hover:text-red-600"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>
        <div className="flex-1 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl p-6 overflow-y-auto text-sm leading-7 text-gray-700 font-mono">
          {result ? (
            <div className="markdown-body whitespace-pre-wrap">{result}</div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300">
              <FileText className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-medium">Enter requirements to start</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
