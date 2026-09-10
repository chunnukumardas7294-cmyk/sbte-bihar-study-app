import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  Award, 
  Sparkles, 
  AlertCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { ObjectiveQuizItem, Subject } from '../types';
import { OBJECTIVE_QUESTIONS } from '../data/objectiveQuestions';

interface ObjectiveTestSimulatorProps {
  currentSubject?: Subject;
  availableSubjects: Subject[];
  onSelectSubject: (subId: string) => void;
  onAskAi: (questionText: string, subjectName: string) => void;
}

export const ObjectiveTestSimulator: React.FC<ObjectiveTestSimulatorProps> = ({
  currentSubject,
  availableSubjects,
  onSelectSubject,
  onAskAi,
}) => {
  // Filter questions for the current subject, or show all if none found
  const subjectQuestions = OBJECTIVE_QUESTIONS.filter(
    (q) => !currentSubject || q.subjectId === currentSubject.id
  );
  const questionsToUse = subjectQuestions.length > 0 ? subjectQuestions : OBJECTIVE_QUESTIONS;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (selectedAnswers[questionId] !== undefined) return; // already answered
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    setShowExplanation((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowExplanation({});
  };

  // Calculate score
  const totalAnswered = Object.keys(selectedAnswers).length;
  let correctCount = 0;
  questionsToUse.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });

  return (
    <div className="space-y-5" id="objective-test-container">
      {/* Subject Filter & Reset Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wide shrink-0">
            Subject:
          </span>
          {availableSubjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                onSelectSubject(sub.id);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                currentSubject?.id === sub.id
                  ? 'bg-blue-700 text-white font-semibold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
          <span>Reset Test</span>
        </button>
      </div>

      {/* 20-Mark Score Progress Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="bg-amber-400 text-slate-950 font-bold text-[11px] uppercase px-2 py-0.5 rounded">
              SBTE Section A (20 Marks) Simulator
            </span>
            <h2 className="text-lg font-bold text-white">
              ऑब्जेक्टिव 20 में से 16+ अंक लाने का अभ्यास
            </h2>
            <p className="text-xs text-slate-300">
              प्रत्येक सही उत्तर के बाद सरल हिंदी में व्याख्या और कॉन्सेप्ट देखें।
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl border border-white/15 shrink-0">
            <div className="text-center px-2">
              <p className="text-xs text-slate-300">Answered</p>
              <p className="text-xl font-bold text-white">
                {totalAnswered} / {questionsToUse.length}
              </p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <p className="text-xs text-slate-300">Score</p>
              <p className="text-xl font-bold text-emerald-300">
                {correctCount}
              </p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <p className="text-xs text-slate-300">Passing Status</p>
              <p className="text-xs font-bold text-amber-300">
                {correctCount >= 14 ? '🌟 Safe Pass Zone' : '⚠️ Need 14+ for safety'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questionsToUse.map((q, idx) => {
          const userAnswer = selectedAnswers[q.id];
          const hasAnswered = userAnswer !== undefined;
          const isCorrect = userAnswer === q.correctAnswer;

          return (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-stone-200 shadow-2xs p-5 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium text-stone-500">
                      Topic: {q.topic} • SBTE {q.year}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-stone-900 leading-snug">
                    {q.question}
                  </h3>
                  {q.hindiQuestion && (
                    <p className="text-xs text-stone-600 font-serif">
                      {q.hindiQuestion}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onAskAi(q.question, q.subjectName)}
                  className="text-stone-400 hover:text-indigo-600 transition-colors p-1"
                  title="Ask AI Guru to explain"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                </button>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((opt, oIdx) => {
                  let optStyle = 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800';

                  if (hasAnswered) {
                    if (oIdx === q.correctAnswer) {
                      optStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold';
                    } else if (userAnswer === oIdx) {
                      optStyle = 'bg-rose-50 border-rose-400 text-rose-950';
                    } else {
                      optStyle = 'bg-stone-50/50 border-stone-200 text-stone-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(q.id, oIdx)}
                      className={`p-3 rounded-lg border text-left text-xs sm:text-sm flex items-center justify-between gap-2 transition-all ${optStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-white border border-stone-300 flex items-center justify-center text-[11px] font-bold shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {hasAnswered && oIdx === q.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {hasAnswered && userAnswer === oIdx && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after selecting answer */}
              {hasAnswered && (
                <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? '✅ सही उत्तर (Correct!)' : '❌ गलत उत्तर (Incorrect)'}
                    </span>
                    <span className="font-semibold text-stone-700">
                      सही विकल्प: ({String.fromCharCode(65 + q.correctAnswer)}) {q.options[q.correctAnswer]}
                    </span>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-amber-950 space-y-1">
                    <p className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>सरल हिंदी व्याख्या (Hindi Explanation):</span>
                    </p>
                    <p className="leading-relaxed text-amber-900">
                      {q.hindiExplanation}
                    </p>
                  </div>

                  <p className="text-stone-600 leading-relaxed pl-1">
                    <span className="font-semibold text-stone-800">Technical Reason: </span>
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
