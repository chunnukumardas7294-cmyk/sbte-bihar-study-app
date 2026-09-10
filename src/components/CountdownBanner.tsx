import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  ChevronRight, 
  CheckCircle,
  Timer
} from 'lucide-react';
import { ExamScheduleItem } from '../types';

interface CountdownBannerProps {
  targetExamDateIso: string;
  sessionName: string;
  scheduleItems: ExamScheduleItem[];
  onOpenCountdownTab: () => void;
  onOpenChatbot: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  totalHours: number;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({
  targetExamDateIso,
  sessionName,
  scheduleItems,
  onOpenCountdownTab,
  onOpenChatbot,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => calculateTime(targetExamDateIso));

  function calculateTime(targetIso: string): TimeRemaining {
    const diff = new Date(targetIso).getTime() - new Date().getTime();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, totalHours: 0 };
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    return { days, hours, minutes, seconds, isPast: false, totalHours };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTime(targetExamDateIso));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetExamDateIso]);

  // Find nearest upcoming paper
  const now = new Date().toISOString().split('T')[0];
  const nextPaper = scheduleItems
    .filter((item) => item.date >= now && !item.isPassedOrDone)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const urgencyBadge = () => {
    if (timeRemaining.isPast) return { label: 'Exam Cycle Active', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (timeRemaining.days <= 3) return { label: 'Final 72 Hours Sprint!', color: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' };
    if (timeRemaining.days <= 10) return { label: 'Exam Week Approaching', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    if (timeRemaining.days <= 20) return { label: 'Revision Phase Active', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    return { label: 'Study & Preparation Phase', color: 'bg-stone-100 text-stone-700 border-stone-300' };
  };

  const badge = urgencyBadge();

  return (
    <div 
      id="sbte-countdown-banner"
      className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white border-b border-blue-900/60 py-2.5 px-4 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Left Info */}
        <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Timer className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 tracking-wide text-xs sm:text-sm">
                  SBTE Bihar Exam Countdown
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-1">
                {sessionName} {nextPaper ? `• Next: ${nextPaper.subjectName} (${nextPaper.date})` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Center Live Ticking Clock */}
        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-xs font-mono shadow-inner">
          <div className="text-center px-1.5 min-w-[36px]">
            <span className="block text-sm sm:text-base font-bold text-amber-300 leading-none">
              {String(timeRemaining.days).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Days</span>
          </div>
          <span className="text-amber-400/60 font-bold -mt-2">:</span>

          <div className="text-center px-1.5 min-w-[36px]">
            <span className="block text-sm sm:text-base font-bold text-slate-100 leading-none">
              {String(timeRemaining.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Hours</span>
          </div>
          <span className="text-amber-400/60 font-bold -mt-2">:</span>

          <div className="text-center px-1.5 min-w-[36px]">
            <span className="block text-sm sm:text-base font-bold text-slate-100 leading-none">
              {String(timeRemaining.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Mins</span>
          </div>
          <span className="text-amber-400/60 font-bold -mt-2">:</span>

          <div className="text-center px-1.5 min-w-[36px]">
            <span className="block text-sm sm:text-base font-bold text-emerald-400 leading-none">
              {String(timeRemaining.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Secs</span>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          <button
            id="view-full-routine-btn"
            onClick={onOpenCountdownTab}
            className="px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg border border-blue-400/40 text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-200" />
            <span>Full Routine & Plan</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          <button
            id="countdown-ask-ai-btn"
            onClick={onOpenChatbot}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Chatbot Tutor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
