import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  Bookmark, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { Branch, BranchId, SemesterNumber } from '../types';
import { BRANCHES } from '../data/branchesData';

interface HeaderProps {
  selectedBranchId: BranchId;
  onSelectBranch: (id: BranchId) => void;
  selectedSemester: SemesterNumber;
  onSelectSemester: (sem: SemesterNumber) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  bookmarkCount: number;
  onOpenBookmarks: () => void;
  onOpenAiGuru: () => void;
  onOpenCountdownTab?: () => void;
  onOpenChatbotTab?: () => void;
  activeTab?: string;
}

export const Header: React.FC<HeaderProps> = ({
  selectedBranchId,
  onSelectBranch,
  selectedSemester,
  onSelectSemester,
  searchQuery,
  onSearchChange,
  bookmarkCount,
  onOpenBookmarks,
  onOpenAiGuru,
  onOpenCountdownTab,
  onOpenChatbotTab,
  activeTab,
}) => {
  const currentBranch = BRANCHES.find((b) => b.id === selectedBranchId) || BRANCHES[0];
  const semesters: SemesterNumber[] = currentBranch.id === 'first_year' ? [1, 2] : [1, 2, 3, 4, 5, 6];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs" id="main-header">
      {/* Top Banner specifically for Bihar Diploma Students */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-4 py-2 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[11px] uppercase tracking-wide">
              SBTE Bihar
            </span>
            <span className="font-medium text-slate-200">
              State Board of Technical Education, Bihar • Diploma Engineering Study Portal
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              सरल हिंदी + English मिश्रित नोट्स (कमज़ोर छात्रों के लिए)
            </span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] text-amber-200">
              Min. 28/70 Pass Guide
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-sm shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-serif">
                  SBTE Bihar Study App
                </h1>
                <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  All Branches
                </span>
              </div>
              <p className="text-xs text-stone-600">
                Previous Year Papers • Passing Notes • Complete Syllabus • 20-Mark MCQs
              </p>
            </div>
          </div>

          {/* Action Buttons & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search PYQ, topic, formula..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-stone-800 placeholder-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* AI Chatbot Button */}
            {onOpenChatbotTab && (
              <button
                id="open-ai-chatbot-header-btn"
                onClick={onOpenChatbotTab}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'chatbot'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white shadow-sm'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>AI Study Chatbot</span>
              </button>
            )}

            {/* Exam Countdown Button */}
            {onOpenCountdownTab && (
              <button
                id="open-countdown-header-btn"
                onClick={onOpenCountdownTab}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-all ${
                  activeTab === 'countdown'
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Exam Countdown</span>
              </button>
            )}

            {/* Bookmarks Drawer Trigger */}
            <button
              id="open-bookmarks-btn"
              onClick={onOpenBookmarks}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-medium rounded-lg border border-stone-200 transition-colors"
            >
              <Bookmark className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Saved</span>
              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                {bookmarkCount}
              </span>
            </button>
          </div>
        </div>

        {/* Branch & Semester Selection Bar */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Branch Selectors */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
              Branch:
            </span>
            {BRANCHES.map((branch) => {
              const isSelected = branch.id === selectedBranchId;
              return (
                <button
                  key={branch.id}
                  id={`branch-btn-${branch.id}`}
                  onClick={() => {
                    onSelectBranch(branch.id);
                    if (branch.id === 'first_year' && selectedSemester > 2) {
                      onSelectSemester(1);
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-700 text-white shadow-xs font-semibold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  <span>{branch.name}</span>
                </button>
              );
            })}
          </div>

          {/* Semester Selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider mr-1">
              Semester:
            </span>
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
              {semesters.map((sem) => (
                <button
                  key={sem}
                  id={`sem-btn-${sem}`}
                  onClick={() => onSelectSemester(sem)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    selectedSemester === sem
                      ? 'bg-white text-blue-700 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
