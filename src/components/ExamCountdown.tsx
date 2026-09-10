import React, { useState, useEffect, useMemo } from 'react';
import { 
  Timer, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  BookOpen, 
  Edit3, 
  Save, 
  RotateCcw, 
  CheckSquare, 
  Square,
  Award,
  ChevronRight,
  TrendingUp,
  FileText,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Subject, ExamScheduleItem, ExamCountdownConfig } from '../types';
import { 
  EXAM_SESSIONS_PRESETS, 
  SBTE_EXAM_TIPS, 
  REVISION_MILESTONES,
  generateDefaultScheduleForSubjects 
} from '../data/examScheduleData';

interface ExamCountdownProps {
  availableSubjects: Subject[];
  currentSubject?: Subject;
  branchName: string;
  semester: number;
  onAskAi: (prompt: string, subjectName: string) => void;
  onOpenChatbotWithPlan?: (planPrompt: string) => void;
}

export const ExamCountdown: React.FC<ExamCountdownProps> = ({
  availableSubjects,
  currentSubject,
  branchName,
  semester,
  onAskAi,
  onOpenChatbotWithPlan,
}) => {
  // Saved config state
  const storageKey = `sbte_countdown_${semester}`;
  const scheduleStorageKey = `sbte_schedule_${semester}`;
  const checklistStorageKey = `sbte_checklist_${semester}`;

  const [config, setConfig] = useState<ExamCountdownConfig>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default 24 days ahead
    const target = new Date();
    target.setDate(target.getDate() + 24);
    target.setHours(9, 30, 0, 0);
    return {
      sessionName: `SBTE Bihar Semester ${semester} Board Theory Exam`,
      targetExamDate: target.toISOString(),
      dailyStudyHoursGoal: 4,
      theoryFullMarks: 70,
      passingMarks: 28,
    };
  });

  // Schedule items for each subject in current semester
  const [schedule, setSchedule] = useState<ExamScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem(scheduleStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return generateDefaultScheduleForSubjects(availableSubjects, config.targetExamDate);
  });

  // Update schedule if subjects change or empty
  useEffect(() => {
    if (schedule.length === 0 || !schedule.some((s) => availableSubjects.some((as) => as.id === s.subjectId))) {
      setSchedule(generateDefaultScheduleForSubjects(availableSubjects, config.targetExamDate));
    }
  }, [availableSubjects]);

  // Persist config
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }, [config, storageKey]);

  // Persist schedule
  useEffect(() => {
    try {
      localStorage.setItem(scheduleStorageKey, JSON.stringify(schedule));
    } catch (e) {
      console.error(e);
    }
  }, [schedule, scheduleStorageKey]);

  // Checklist items
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(checklistStorageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleTask = (taskKey: string) => {
    setCompletedTasks((prev) => {
      const updated = { ...prev, [taskKey]: !prev[taskKey] };
      try {
        localStorage.setItem(checklistStorageKey, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Real-time ticking state
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Time remaining calculation
  const targetDate = new Date(config.targetExamDate);
  const diffMs = targetDate.getTime() - now.getTime();
  const isPast = diffMs <= 0;

  const daysRemaining = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const hoursRemaining = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutesRemaining = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)));
  const secondsRemaining = Math.max(0, Math.floor((diffMs % (1000 * 60)) / 1000));

  // Study hours computation
  const totalStudyHoursAvailable = daysRemaining * config.dailyStudyHoursGoal;
  const hoursPerSubject = availableSubjects.length > 0 
    ? (totalStudyHoursAvailable / availableSubjects.length).toFixed(1) 
    : '0';

  // State for editing config
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [tempDateStr, setTempDateStr] = useState(config.targetExamDate.split('T')[0]);
  const [tempSessionName, setTempSessionName] = useState(config.sessionName);
  const [tempHoursGoal, setTempHoursGoal] = useState(config.dailyStudyHoursGoal);

  const handleSaveConfig = () => {
    const newTarget = new Date(tempDateStr);
    newTarget.setHours(9, 30, 0, 0);
    const updated = {
      ...config,
      sessionName: tempSessionName,
      targetExamDate: newTarget.toISOString(),
      dailyStudyHoursGoal: tempHoursGoal,
    };
    setConfig(updated);
    setSchedule(generateDefaultScheduleForSubjects(availableSubjects, newTarget.toISOString()));
    setIsEditingConfig(false);
  };

  const handleSelectPreset = (preset: typeof EXAM_SESSIONS_PRESETS[0]) => {
    const newTarget = new Date();
    newTarget.setDate(newTarget.getDate() + preset.defaultOffsetDays);
    newTarget.setHours(9, 30, 0, 0);

    const updated = {
      ...config,
      sessionName: preset.name,
      targetExamDate: newTarget.toISOString(),
    };
    setConfig(updated);
    setTempDateStr(newTarget.toISOString().split('T')[0]);
    setTempSessionName(preset.name);
    setSchedule(generateDefaultScheduleForSubjects(availableSubjects, newTarget.toISOString()));
  };

  const handleTogglePaperPassed = (id: string) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPassedOrDone: !item.isPassedOrDone } : item))
    );
  };

  const handleUpdatePaperDate = (id: string, newDate: string) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, date: newDate } : item))
    );
  };

  // Readiness score computation
  const totalChecklistItems = REVISION_MILESTONES.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedChecklistCount = Object.values(completedTasks).filter(Boolean).length;
  const readinessPercent = Math.min(100, Math.round((completedChecklistCount / Math.max(1, totalChecklistItems)) * 100));

  // Request AI custom study schedule
  const handleAskAiForRoutine = () => {
    const prompt = `Please create an actionable, day-by-day exam revision plan for SBTE Bihar Diploma Semester ${semester} (${branchName}).
I have exactly ${daysRemaining} days remaining before my theory exams start.
My subjects are: ${availableSubjects.map((s) => `${s.name} (${s.code})`).join(', ')}.
I can study ${config.dailyStudyHoursGoal} hours per day.
Please structure the plan into:
1. Daily subject time-slots
2. High-yield units to focus on first to guarantee 28+ passing marks
3. When to solve 20-mark Section A MCQs
4. Formula and diagram revision blocks.`;

    if (onOpenChatbotWithPlan) {
      onOpenChatbotWithPlan(prompt);
    } else {
      onAskAi(prompt, availableSubjects[0]?.name || 'SBTE Exam Strategy');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200" id="exam-countdown-container">
      {/* Top Hero Countdown Card */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-blue-800/40 relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  SBTE Bihar Examination Portal
                </span>
                <span className="text-xs text-slate-300">
                  {branchName} • Semester {semester}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                {config.sessionName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Passing Criteria: Minimum <strong className="text-amber-300 font-bold">28 / 70 marks</strong> in external theory paper
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="edit-target-date-btn"
                onClick={() => setIsEditingConfig(!isEditingConfig)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                <span>{isEditingConfig ? 'Cancel' : 'Change Date / Target'}</span>
              </button>

              <button
                id="generate-ai-routine-btn"
                onClick={handleAskAiForRoutine}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Study Routine Generator</span>
              </button>
            </div>
          </div>

          {/* Quick Date / Goal Editor Drawer */}
          {isEditingConfig && (
            <div className="bg-black/40 p-4 rounded-xl border border-white/15 space-y-3 animate-in fade-in">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Customize Target Exam Date & Study Goals</span>
              </h4>

              {/* Quick Presets */}
              <div>
                <span className="text-[11px] text-slate-300 block mb-1.5 font-medium">
                  Quick SBTE Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {EXAM_SESSIONS_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className="text-xs px-2.5 py-1 bg-white/10 hover:bg-blue-600/50 text-slate-200 hover:text-white rounded-md border border-white/15 transition-colors"
                    >
                      {preset.name.split('(')[0]} ({preset.defaultOffsetDays} Days)
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">
                    Exam Title / Session:
                  </label>
                  <input
                    type="text"
                    value={tempSessionName}
                    onChange={(e) => setTempSessionName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">
                    Start Date (YYYY-MM-DD):
                  </label>
                  <input
                    type="date"
                    value={tempDateStr}
                    onChange={(e) => setTempDateStr(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">
                    Daily Study Target (Hours/Day):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={tempHoursGoal}
                    onChange={(e) => setTempHoursGoal(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsEditingConfig(false)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs rounded-md text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="px-4 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Recalculate Routine</span>
                </button>
              </div>
            </div>
          )}

          {/* Countdown Clock Display */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Days Card */}
            <div className="bg-black/30 backdrop-blur-xs border border-white/15 rounded-xl p-4 text-center shadow-inner flex flex-col justify-center">
              <span className="text-3xl sm:text-5xl font-extrabold font-mono text-amber-300 tracking-tight leading-none">
                {String(daysRemaining).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-300 mt-1">
                Days Left
              </span>
            </div>

            {/* Hours Card */}
            <div className="bg-black/30 backdrop-blur-xs border border-white/15 rounded-xl p-4 text-center shadow-inner flex flex-col justify-center">
              <span className="text-3xl sm:text-5xl font-extrabold font-mono text-white tracking-tight leading-none">
                {String(hoursRemaining).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-300 mt-1">
                Hours
              </span>
            </div>

            {/* Minutes Card */}
            <div className="bg-black/30 backdrop-blur-xs border border-white/15 rounded-xl p-4 text-center shadow-inner flex flex-col justify-center">
              <span className="text-3xl sm:text-5xl font-extrabold font-mono text-white tracking-tight leading-none">
                {String(minutesRemaining).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-300 mt-1">
                Minutes
              </span>
            </div>

            {/* Seconds Card */}
            <div className="bg-black/30 backdrop-blur-xs border border-white/15 rounded-xl p-4 text-center shadow-inner flex flex-col justify-center">
              <span className="text-3xl sm:text-5xl font-extrabold font-mono text-emerald-400 tracking-tight leading-none">
                {String(secondsRemaining).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-300 mt-1">
                Seconds
              </span>
            </div>
          </div>

          {/* Key Metric Stats Footer Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Total Study Hours</span>
                <span className="font-bold text-white">~{totalStudyHoursAvailable} Hours</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-300 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Per Subject Prep Time</span>
                <span className="font-bold text-white">~{hoursPerSubject} Hours / Sub</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Exam Readiness</span>
                <span className="font-bold text-emerald-300">{readinessPercent}% Prepared</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Safe Target Mark</span>
                <span className="font-bold text-white">35+ / 70 (Min 28)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Subject Routine & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Subject Routine Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-700" />
                  <span>Subject-Wise Exam Schedule & Routine</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Paper dates, shift timings (SBTE Morning / Evening), and countdown to each specific subject
                </p>
              </div>

              <span className="text-xs bg-blue-50 text-blue-800 font-semibold px-2.5 py-1 rounded-full border border-blue-200">
                {availableSubjects.length} Papers Total
              </span>
            </div>

            {/* Routine Paper Cards */}
            <div className="space-y-3">
              {schedule.map((item, index) => {
                const itemDate = new Date(item.date);
                const itemDiffDays = Math.ceil((itemDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const isItemPast = itemDiffDays < 0;
                const isItemToday = itemDiffDays === 0;

                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border p-4 transition-all ${
                      item.isPassedOrDone
                        ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
                        : isItemToday
                        ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-300/50'
                        : 'bg-stone-50/60 border-stone-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left Paper Details */}
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleTogglePaperPassed(item.id)}
                          className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors"
                          title="Mark as revision completed"
                        >
                          {item.isPassedOrDone ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5 text-stone-400" />
                          )}
                        </button>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded">
                              Paper {index + 1}
                            </span>
                            <span className="text-xs font-mono font-semibold text-stone-500">
                              Code: {item.subjectCode}
                            </span>
                            <span className="text-xs px-2 py-0.2 rounded-full border font-medium bg-stone-100 text-stone-600">
                              {item.shift} Shift ({item.time})
                            </span>
                          </div>

                          <h4 className={`text-sm sm:text-base font-bold mt-1 ${item.isPassedOrDone ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                            {item.subjectName}
                          </h4>

                          <div className="flex items-center gap-3 text-xs text-stone-600 mt-1">
                            <span>
                              Exam Date: <strong className="text-stone-800">{item.date}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Target: <strong className="text-emerald-700 font-semibold">{item.targetMarks}/70 Marks</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Countdown Tag & AI Help */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200">
                        <div>
                          {item.isPassedOrDone ? (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Prepared
                            </span>
                          ) : isItemToday ? (
                            <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2.5 py-1 rounded-lg animate-pulse">
                              🔥 Today's Exam!
                            </span>
                          ) : isItemPast ? (
                            <span className="text-xs text-stone-400 bg-stone-200 px-2.5 py-1 rounded-lg">
                              Completed
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2.5 py-1 rounded-lg">
                              ⏳ In {itemDiffDays} Days
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            onAskAi(
                              `Give me the top 5 highest repeated questions and passing strategy for ${item.subjectName} in SBTE Bihar diploma exams.`,
                              item.subjectName
                            );
                          }}
                          className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>AI Guru Tips</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SBTE Examination Hall Checklist */}
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 space-y-3">
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>SBTE Bihar Official Examination Hall Rules & Essentials</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
              <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900">Non-Programmable Calculator:</strong>
                  <p className="text-stone-500 mt-0.5">Casio fx-82MS, fx-991ES Plus, or fx-991MS are strictly allowed in numerical papers (SOM, TOM, Electrical Circuits).</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900">Drawing Instruments:</strong>
                  <p className="text-stone-500 mt-0.5">Mini-drafter, compass, set-squares and pencils (2B/HB) are required for Engineering Graphics and Surveying.</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900">OMR Section A (20 Marks):</strong>
                  <p className="text-stone-500 mt-0.5">Section A 20 MCQs are to be marked clearly with black/blue ballpoint pen. No negative marking in SBTE!</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900">Original Admit Card:</strong>
                  <p className="text-stone-500 mt-0.5">Must be stamped/signed by your polytechnic Principal. Carry along with college student ID card.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: 4-Phase Revision Milestones & Daily Tips */}
        <div className="space-y-4">
          {/* Milestone Checklist */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>SBTE Revision Roadmap</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {completedChecklistCount}/{totalChecklistItems} Done
              </span>
            </div>

            {/* Milestone Cards */}
            <div className="space-y-4">
              {REVISION_MILESTONES.map((m, mIdx) => (
                <div key={mIdx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900">
                      {m.badge} ({m.daysRemaining} Days Out)
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      Target: {m.daysRemaining}d
                    </span>
                  </div>

                  <div className="space-y-1.5 pl-1">
                    {m.tasks.map((task, tIdx) => {
                      const key = `${m.daysRemaining}_${tIdx}`;
                      const isDone = !!completedTasks[key];
                      return (
                        <button
                          key={tIdx}
                          onClick={() => toggleTask(key)}
                          className={`w-full text-left p-2 rounded-lg text-xs flex items-start gap-2 transition-colors ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-900 line-through'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-800'
                          }`}
                        >
                          {isDone ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                          )}
                          <span className="leading-snug">{task}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily SBTE Exam Tips Carousel / List */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-xl border border-amber-200 p-5 space-y-3">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Bihar Polytechnic Exam Secrets (Pass 28+)</span>
            </h4>

            <div className="space-y-2.5">
              {SBTE_EXAM_TIPS.slice(0, 3).map((item, idx) => (
                <div key={idx} className="bg-white/80 p-3 rounded-lg border border-amber-200/70 text-xs space-y-1">
                  <strong className="text-stone-900 block font-bold text-xs text-amber-950">
                    💡 {item.title}
                  </strong>
                  <p className="text-stone-600 leading-relaxed">
                    {item.tip}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                onAskAi(
                  'Explain the marking scheme of SBTE Bihar 70 marks theory paper and how to easily get 28+ passing marks.',
                  currentSubject?.name || 'General Strategy'
                );
              }}
              className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI for Personalized Pass Formula</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
