import React, { useState, useEffect, useMemo } from 'react';
import { format, eachDayOfInterval, startOfYear, endOfYear, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Trash2, StickyNote, X, Plus } from 'lucide-react';
import clsx from 'clsx';
import './App.css';

// Constants
const START_YEAR = 2016;
const END_YEAR = 2126;
const COLORS = [
  { name: 'Default', bg: 'bg-white', text: 'text-gray-600', border: 'border-gray-200' },
  { name: 'Red', bg: 'bg-red-700', text: 'text-white', border: 'border-red-700' },
  { name: 'Yellow', bg: 'bg-yellow-600', text: 'text-white', border: 'border-yellow-600' },
  { name: 'Green', bg: 'bg-green-700', text: 'text-white', border: 'border-green-700' },
  { name: 'Blue', bg: 'bg-blue-700', text: 'text-white', border: 'border-blue-700' },
  { name: 'Purple', bg: 'bg-purple-700', text: 'text-white', border: 'border-purple-700' },
  { name: 'Stone', bg: 'bg-stone-600', text: 'text-white', border: 'border-stone-600' },
];

const MONTH_FIRST_DAY_COLOR = 'bg-gray-200 text-gray-800 border-gray-300';

function App() {
  const [currentYear, setCurrentYear] = useState(() => {
    const year = new Date().getFullYear();
    if (year < START_YEAR) return START_YEAR;
    if (year > END_YEAR) return END_YEAR;
    return year;
  });
  
  // checkIns: { "YYYY-MM-DD": colorIndex }
  const [checkIns, setCheckIns] = useState({});
  // notes: { "YYYY-MM-DD": "Note text" }
  const [notes, setNotes] = useState({});
  const [selectedColorIndex, setSelectedColorIndex] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeDate, setActiveDate] = useState(null); // Date currently being edited
  const [noteInput, setNoteInput] = useState("");

  // Load from local storage on mount
  useEffect(() => {
    const savedCheckIns = localStorage.getItem('checkInsDatabase');
    const savedNotes = localStorage.getItem('notesDatabase');
    const savedColor = localStorage.getItem('userSelectedColor');
    
    if (savedCheckIns) {
      try {
        setCheckIns(JSON.parse(savedCheckIns));
      } catch (e) {
        console.error("Failed to parse checkInsDatabase", e);
      }
    }

    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Failed to parse notesDatabase", e);
      }
    }
    
    if (savedColor) {
      setSelectedColorIndex(parseInt(savedColor, 10) || 1);
    }
    
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('checkInsDatabase', JSON.stringify(checkIns));
      localStorage.setItem('notesDatabase', JSON.stringify(notes));
    }
  }, [checkIns, notes, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('userSelectedColor', selectedColorIndex.toString());
    }
  }, [selectedColorIndex, isLoaded]);

  const handleCheckIn = (dateStr) => {
    setCheckIns(prev => {
      const current = prev[dateStr];
      const newState = { ...prev };
      
      if (current === selectedColorIndex) {
        delete newState[dateStr];
      } else {
        newState[dateStr] = selectedColorIndex;
      }
      return newState;
    });
  };

  const handleClearAll = () => {
    if (window.confirm("确定要清空所有打卡记录和备注吗？此操作不可撤销。")) {
      setCheckIns({});
      setNotes({});
    }
  };

  const handleSaveNote = () => {
    if (!activeDate) return;
    setNotes(prev => {
      const newNotes = { ...prev };
      if (noteInput.trim()) {
        newNotes[activeDate] = noteInput.trim();
      } else {
        delete newNotes[activeDate];
      }
      return newNotes;
    });
    setActiveDate(null);
    setNoteInput("");
  };

  const openNoteEditor = (dateStr) => {
    setActiveDate(dateStr);
    setNoteInput(notes[dateStr] || "");
  };

  const sortedNotes = useMemo(() => {
    return Object.entries(notes)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA)) // Latest first
      .slice(0, 20); // Only show top 20
  }, [notes]);

  const days = useMemo(() => {
    return eachDayOfInterval({
      start: startOfYear(new Date(currentYear, 0, 1)),
      end: endOfYear(new Date(currentYear, 0, 1))
    });
  }, [currentYear]);

  const changeYear = (delta) => {
    const newYear = currentYear + delta;
    if (newYear >= START_YEAR && newYear <= END_YEAR) {
      setCurrentYear(newYear);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f5f5f7] font-sans text-gray-800">
      {/* Sidebar - Notes List */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <StickyNote size={20} className="text-blue-500" />
            备注列表
          </h2>
          <button 
            onClick={handleClearAll}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="清空所有数据"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {sortedNotes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">暂无备注</p>
              <p className="text-xs mt-1">点击右侧日期圆圈添加</p>
            </div>
          ) : (
            sortedNotes.map(([date, text]) => (
              <div 
                key={date} 
                className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer group"
                onClick={() => openNoteEditor(date)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono font-semibold text-blue-600">{date}</span>
                  <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity">
                    <X size={14} onClick={(e) => {
                      e.stopPropagation();
                      setNotes(prev => {
                        const next = {...prev};
                        delete next[date];
                        return next;
                      });
                    }} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{text}</p>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 bg-gray-50 text-xs text-gray-400 border-t border-gray-100">
          显示最近 20 条备注
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-8 px-4 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col items-center gap-6 mb-8 select-none w-full max-w-4xl">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => changeYear(-1)}
              disabled={currentYear <= START_YEAR}
              className="p-3 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 text-gray-600"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-4xl font-bold tracking-wider text-gray-800 font-mono">{currentYear}</h1>
            <button 
              onClick={() => changeYear(1)}
              disabled={currentYear >= END_YEAR}
              className="p-3 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 text-gray-600"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-sm font-medium text-gray-500 mr-2">选择打卡颜色:</span>
            {COLORS.slice(1).map((color, index) => (
              <button
                key={color.name}
                onClick={() => setSelectedColorIndex(index + 1)}
                className={clsx(
                  "w-8 h-8 rounded-full border-2 transition-all duration-200",
                  color.bg,
                  selectedColorIndex === index + 1 ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "border-transparent opacity-60 hover:opacity-100"
                )}
                title={color.name}
              />
            ))}
          </div>
        </header>

        {/* Grid */}
        <div className="w-full max-w-6xl flex justify-center overflow-x-auto pb-4 px-2">
           <div 
             className="grid gap-3 sm:gap-4 mx-auto"
             style={{ 
               gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
               width: 'fit-content'
             }}
           >
             {days.map((day) => {
               const dateStr = format(day, 'yyyy-MM-dd');
               const dayNum = day.getDate();
               const colorIndex = checkIns[dateStr] || 0;
               const isToday = isSameDay(day, new Date());
               const isFirstDayOfMonth = dayNum === 1;
               const hasNote = !!notes[dateStr];
               
               const colorConfig = COLORS[colorIndex];
               
               return (
                 <div key={dateStr} className="relative group">
                   <button
                     onClick={() => handleCheckIn(dateStr)}
                     onContextMenu={(e) => {
                       e.preventDefault();
                       openNoteEditor(dateStr);
                     }}
                     className={clsx(
                       "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-medium transition-all duration-200 border",
                       colorIndex > 0 ? `${colorConfig.bg} ${colorConfig.text} ${colorConfig.border}` : 
                       (isFirstDayOfMonth ? MONTH_FIRST_DAY_COLOR : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"),
                       colorIndex === 0 && "shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]",
                       colorIndex > 0 && "shadow-md border-transparent",
                       isToday && colorIndex === 0 && "ring-2 ring-blue-400 ring-offset-2",
                       "hover:scale-105 active:scale-95"
                     )}
                     title={`${format(day, 'yyyy-MM-dd EEEE')}${hasNote ? '\n备注: ' + notes[dateStr] : '\n右键点击添加备注'}`}
                   >
                     {dayNum}
                     {hasNote && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                     )}
                   </button>
                   
                   {/* Tooltip-like Plus button on hover */}
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       openNoteEditor(dateStr);
                     }}
                     className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-blue-50 text-blue-500"
                   >
                     <Plus size={12} />
                   </button>
                 </div>
               );
             })}
           </div>
        </div>

        <footer className="mt-12 mb-8 text-center text-gray-400 font-serif tracking-[0.2em] text-lg sm:text-xl">
          日日不断 &nbsp; 日拱一卒 &nbsp; 功不唐捐 !
        </footer>
      </main>

      {/* Note Editor Modal */}
      {activeDate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-800">添加备注</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{activeDate}</p>
              </div>
              <button onClick={() => setActiveDate(null)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <textarea
                autoFocus
                className="w-full h-40 p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none text-gray-700 leading-relaxed"
                placeholder="在此输入当天的备注内容..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
              />
              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => setActiveDate(null)}
                  className="flex-1 py-3 px-6 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveNote}
                  className="flex-1 py-3 px-6 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  保存备注
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
