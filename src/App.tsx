import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  BookOpen, 
  ClipboardList, 
  Award, 
  Calculator, 
  Sparkles, 
  GraduationCap,
  Lightbulb,
  CheckCircle2,
  Bookmark,
  Share2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { BranchId, SemesterNumber, Subject, BookmarkItem, ExamScheduleItem } from './types';
import { BRANCHES, SUBJECTS } from './data/branchesData';
import { generateDefaultScheduleForSubjects } from './data/examScheduleData';
import { Header } from './components/Header';
import { CountdownBanner } from './components/CountdownBanner';
import { ExamCountdown } from './components/ExamCountdown';
import { AiChatbot } from './components/AiChatbot';
import { PYQViewer } from './components/PYQViewer';
import { PassingNotesViewer } from './components/PassingNotesViewer';
import { SyllabusViewer } from './components/SyllabusViewer';
import { ObjectiveTestSimulator } from './components/ObjectiveTestSimulator';
import { PassingStrategyCalculator } from './components/PassingStrategyCalculator';
import { AiDoubtSolverModal } from './components/AiDoubtSolverModal';
import { BookmarksModal } from './components/BookmarksModal';

export default function App() {
  // Navigation & Filtering State
  const [selectedBranchId, setSelectedBranchId] = useState<BranchId>('first_year');
  const [selectedSemester, setSelectedSemester] = useState<SemesterNumber>(1);
  const [activeTab, setActiveTab] = useState<'pyq' | 'notes' | 'syllabus' | 'objective' | 'calculator' | 'chatbot' | 'countdown'>('pyq');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // AI Chatbot Initial Prompt State (when launched from other sections)
  const [chatbotInitialPrompt, setChatbotInitialPrompt] = useState<string>('');

  // Target exam date state for countdown banner
  const targetExamDateIso = useMemo(() => {
    try {
      const saved = localStorage.getItem(`sbte_countdown_${selectedSemester}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.targetExamDate) return parsed.targetExamDate;
      }
    } catch (e) {
      console.error(e);
    }
    const target = new Date();
    target.setDate(target.getDate() + 24);
    target.setHours(9, 30, 0, 0);
    return target.toISOString();
  }, [selectedSemester]);

  const sessionName = useMemo(() => {
    try {
      const saved = localStorage.getItem(`sbte_countdown_${selectedSemester}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sessionName) return parsed.sessionName;
      }
    } catch (e) {
      console.error(e);
    }
    return `SBTE Bihar Semester ${selectedSemester} Theory Exams`;
  }, [selectedSemester]);

  // Bookmarks State stored in localStorage
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem('sbte_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sbte_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks:', e);
    }
  }, [bookmarks]);

  const bookmarkedIds = useMemo(() => new Set(bookmarks.map((b) => b.dataRefId)), [bookmarks]);

  const handleToggleBookmark = (item: { id: string; type: 'pyq' | 'note' | 'formula'; title: string; subtitle: string; subjectName: string; dataRefId: string }) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.dataRefId === item.dataRefId);
      if (exists) {
        return prev.filter((b) => b.dataRefId !== item.dataRefId);
      } else {
        const newItem: BookmarkItem = {
          ...item,
          savedAt: new Date().toISOString(),
        };
        return [newItem, ...prev];
      }
    });
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleClearAllBookmarks = () => {
    setBookmarks([]);
  };

  // AI Guru Modal State
  const [isAiGuruOpen, setIsAiGuruOpen] = useState(false);
  const [aiInitialQuestion, setAiInitialQuestion] = useState('');
  const [aiInitialSubject, setAiInitialSubject] = useState('');

  // Bookmarks Modal State
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Available subjects for the chosen branch and semester
  const availableSubjects = useMemo(() => {
    const list = SUBJECTS.filter(
      (s) => s.branchId === selectedBranchId && s.semester === selectedSemester
    );
    if (list.length === 0) {
      // If branch has no specific subjects defined for this sem, fallback to any for that branch or first year
      return SUBJECTS.filter((s) => s.branchId === selectedBranchId) || [];
    }
    return list;
  }, [selectedBranchId, selectedSemester]);

  // Selected subject inside current semester
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    availableSubjects[0]?.id || SUBJECTS[0].id
  );

  // Synchronize selected subject when branch/sem changes
  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.some((s) => s.id === selectedSubjectId)) {
      setSelectedSubjectId(availableSubjects[0].id);
    }
  }, [availableSubjects, selectedSubjectId]);

  const currentSubject = availableSubjects.find((s) => s.id === selectedSubjectId) || availableSubjects[0];
  const currentBranch = BRANCHES.find((b) => b.id === selectedBranchId) || BRANCHES[0];

  const handleOpenAiGuruWithQuestion = (qText: string, subName: string) => {
    setAiInitialQuestion(qText);
    setAiInitialSubject(subName);
    setIsAiGuruOpen(true);
  };

  const handleNavigateFromBookmark = (b: BookmarkItem) => {
    if (b.type === 'pyq') {
      setActiveTab('pyq');
    } else {
      setActiveTab('notes');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header
        selectedBranchId={selectedBranchId}
        onSelectBranch={setSelectedBranchId}
        selectedSemester={selectedSemester}
        onSelectSemester={setSelectedSemester}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        bookmarkCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenAiGuru={() => {
          setActiveTab('chatbot');
        }}
        onOpenCountdownTab={() => setActiveTab('countdown')}
        onOpenChatbotTab={() => setActiveTab('chatbot')}
        activeTab={activeTab}
      />

      {/* Live Exam Countdown Header Banner */}
      <CountdownBanner
        targetExamDateIso={targetExamDateIso}
        sessionName={sessionName}
        scheduleItems={generateDefaultScheduleForSubjects(availableSubjects, targetExamDateIso)}
        onOpenCountdownTab={() => setActiveTab('countdown')}
        onOpenChatbot={() => setActiveTab('chatbot')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 space-y-5">
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-1.5 flex items-center justify-between overflow-x-auto scrollbar-none gap-1">
          <button
            id="tab-countdown"
            onClick={() => setActiveTab('countdown')}
            className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'countdown'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-amber-50/70'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Exam Countdown</span>
          </button>

          <button
            id="tab-chatbot"
            onClick={() => setActiveTab('chatbot')}
            className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'chatbot'
                ? 'bg-blue-800 text-white font-bold shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-blue-50/70'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Study Chatbot</span>
          </button>

          <button
            id="tab-pyq"
            onClick={() => setActiveTab('pyq')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'pyq'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Previous Years (PYQs)</span>
          </button>

          <button
            id="tab-notes"
            onClick={() => setActiveTab('notes')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Passing Notes & Formulas</span>
          </button>

          <button
            id="tab-syllabus"
            onClick={() => setActiveTab('syllabus')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'syllabus'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Official Syllabus</span>
          </button>

          <button
            id="tab-objective"
            onClick={() => setActiveTab('objective')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'objective'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>20 MCQs Simulator</span>
          </button>

          <button
            id="tab-calculator"
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'calculator'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Pass Marks Calculator</span>
          </button>
        </div>

        {/* Selected Context Bar */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {currentBranch.name} ({currentBranch.hindiName})
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-700">
              Semester {selectedSemester}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Active: {currentSubject?.name || 'All Subjects'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-stone-500">
            <span>
              Passing Rule: <strong className="text-emerald-700 font-bold">Min 28 / 70</strong> in Theory
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              Total External: <strong>70 Marks</strong>
            </span>
          </div>
        </div>

        {/* View Component Switch */}
        {activeTab === 'countdown' && (
          <ExamCountdown
            availableSubjects={availableSubjects}
            currentSubject={currentSubject}
            branchName={currentBranch.name}
            semester={selectedSemester}
            onAskAi={handleOpenAiGuruWithQuestion}
            onOpenChatbotWithPlan={(planPrompt) => {
              setChatbotInitialPrompt(planPrompt);
              setActiveTab('chatbot');
            }}
          />
        )}

        {activeTab === 'chatbot' && (
          <AiChatbot
            currentSubject={currentSubject}
            availableSubjects={availableSubjects}
            branchName={currentBranch.name}
            semester={selectedSemester}
            initialPrompt={chatbotInitialPrompt}
            onSelectSubject={setSelectedSubjectId}
          />
        )}

        {activeTab === 'pyq' && (
          <PYQViewer
            currentSubject={currentSubject}
            availableSubjects={availableSubjects}
            onSelectSubject={setSelectedSubjectId}
            searchQuery={searchQuery}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onAskAi={handleOpenAiGuruWithQuestion}
          />
        )}

        {activeTab === 'notes' && (
          <PassingNotesViewer
            currentSubject={currentSubject}
            availableSubjects={availableSubjects}
            onSelectSubject={setSelectedSubjectId}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onAskAi={handleOpenAiGuruWithQuestion}
          />
        )}

        {activeTab === 'syllabus' && (
          <SyllabusViewer
            currentSubject={currentSubject}
            availableSubjects={availableSubjects}
            onSelectSubject={setSelectedSubjectId}
          />
        )}

        {activeTab === 'objective' && (
          <ObjectiveTestSimulator
            currentSubject={currentSubject}
            availableSubjects={availableSubjects}
            onSelectSubject={setSelectedSubjectId}
            onAskAi={handleOpenAiGuruWithQuestion}
          />
        )}

        {activeTab === 'calculator' && (
          <PassingStrategyCalculator />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-bold text-stone-800">
              SBTE Bihar Diploma Study App • समर्पित बिहार के पॉलिटेक्निक छात्रों के लिए
            </p>
            <p className="mt-0.5 text-stone-500">
              Covers Civil, Mechanical, Electrical, Computer Science, Electronics & 1st Year (Group A/B)
            </p>
          </div>
          <div className="flex items-center gap-4 text-stone-600">
            <button
              onClick={() => {
                setAiInitialQuestion('Explain passing formula for SBTE Bihar diploma exams');
                setIsAiGuruOpen(true);
              }}
              className="hover:text-blue-700 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Ask AI Doubt Solver
            </button>
            <span>•</span>
            <button
              onClick={() => setIsBookmarksOpen(true)}
              className="hover:text-blue-700 hover:underline flex items-center gap-1"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
              My Saved Notes ({bookmarks.length})
            </button>
          </div>
        </div>
      </footer>

      {/* AI Doubt Solver Modal */}
      <AiDoubtSolverModal
        isOpen={isAiGuruOpen}
        onClose={() => setIsAiGuruOpen(false)}
        initialQuestion={aiInitialQuestion}
        initialSubject={aiInitialSubject}
        currentBranchName={currentBranch.name}
        onOpenFullChatbot={(prompt) => {
          if (prompt) setChatbotInitialPrompt(prompt);
          setActiveTab('chatbot');
        }}
      />

      {/* Bookmarks Modal */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onRemoveBookmark={handleRemoveBookmark}
        onClearAll={handleClearAllBookmarks}
        onNavigateToItem={handleNavigateFromBookmark}
      />
    </div>
  );
}
