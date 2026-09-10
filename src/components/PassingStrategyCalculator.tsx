import React, { useState } from 'react';
import { 
  Calculator, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Clock, 
  Check, 
  BookCheck,
  Sparkles
} from 'lucide-react';
import { SBTE_PASSING_RULES } from '../data/strategyData';

export const PassingStrategyCalculator: React.FC = () => {
  const [midSemMarks, setMidSemMarks] = useState<number>(14);
  const [taMarks, setTaMarks] = useState<number>(8);

  const internalTotal = Math.min(30, Math.max(0, midSemMarks + taMarks));
  
  // SBTE Rule:
  // 1. External Theory passing mark: Minimum 28 out of 70 (strictly non-negotiable!).
  // 2. Aggregate passing mark: Minimum 40 out of 100 overall.
  // So minimum theory required to pass = Math.max(28, 40 - internalTotal).
  const minTheoryForPass = Math.max(28, 40 - internalTotal);
  const minTheoryForFirstClass = Math.max(minTheoryForPass, 60 - internalTotal);
  const minTheoryForDistinction = Math.max(minTheoryForPass, 75 - internalTotal);

  return (
    <div className="space-y-6" id="passing-strategy-container">
      {/* Interactive Pass Calculator Card */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <Calculator className="w-5 h-5 text-blue-700" />
          <div>
            <h2 className="text-base font-bold text-stone-900 font-serif">
              SBTE Bihar Pass & Division Calculator (पास मार्क्स कैलकुलेटर)
            </h2>
            <p className="text-xs text-stone-500">
              आंतरिक अंक (Internal Marks) डालकर देखें कि 70 नंबर की थ्योरी में कितने नंबर चाहिए
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                1. मिड-सेमेस्टर क्लास टेस्ट (Mid-Sem Test): {midSemMarks} / 20 Marks
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={midSemMarks}
                onChange={(e) => setMidSemMarks(Number(e.target.value))}
                className="w-full accent-blue-700 h-2 bg-stone-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-0.5">
                <span>0</span>
                <span>10 (Avg)</span>
                <span>20 (Full)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                2. टीचर असेसमेंट (TA & Attendance): {taMarks} / 10 Marks
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={taMarks}
                onChange={(e) => setTaMarks(Number(e.target.value))}
                className="w-full accent-blue-700 h-2 bg-stone-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-0.5">
                <span>0</span>
                <span>5 (Avg)</span>
                <span>10 (Full)</span>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 space-y-1">
              <p className="font-semibold text-stone-900">
                कुल आंतरिक अंक (Total Internal): <span className="text-blue-700 font-bold">{internalTotal} / 30</span>
              </p>
              <p className="text-[11px] text-stone-500">
                कॉलेज द्वारा दिए जाने वाले आंतरिक अंक (Mid Sem + TA)
              </p>
            </div>
          </div>

          {/* Results Output */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-5 rounded-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              70 नंबर की एक्सटर्नल थ्योरी में आवश्यकता:
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-white/10 rounded-lg border border-white/15 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-200 font-medium">न्यूनतम पास होने के लिए (To Pass):</p>
                  <p className="text-[11px] text-emerald-300">Strict SBTE Rule: Min 28 Required</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-300">
                    {minTheoryForPass}
                  </span>
                  <span className="text-xs text-slate-300"> / 70</span>
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-lg border border-white/15 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-200 font-medium">फर्स्ट क्लास (1st Class - 60%):</p>
                  <p className="text-[11px] text-slate-300">Total Aggregate: 60/100</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-white">
                    {minTheoryForFirstClass <= 70 ? minTheoryForFirstClass : 'N/A'}
                  </span>
                  <span className="text-xs text-slate-300"> / 70</span>
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-lg border border-white/15 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-200 font-medium">डिस्टिंक्शन (Distinction - 75%):</p>
                  <p className="text-[11px] text-slate-300">Total Aggregate: 75/100</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-white">
                    {minTheoryForDistinction <= 70 ? minTheoryForDistinction : 'N/A'}
                  </span>
                  <span className="text-xs text-slate-300"> / 70</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-amber-200 bg-amber-500/20 p-2 rounded border border-amber-400/30 flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
              <span>
                सावधानी: थ्योरी में 28 नंबर लाना अनिवार्य है, भले ही आपके इंटरनल में 30/30 क्यों न हों!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Golden Rules of SBTE Answer Sheet Presentation */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <span>SBTE उत्तर-पुस्तिका लेखन के 6 स्वर्णिम नियम (Exam Writing Secrets)</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            बिहार के कॉपियां जांचने वाले शिक्षकों से पूरे अंक प्राप्त करने की सिद्ध तकनीक
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SBTE_PASSING_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition-all space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {rule.category}
                </span>
                <span className="text-xs font-bold text-stone-400">#{idx + 1}</span>
              </div>

              <h3 className="text-sm font-bold text-stone-900">
                {rule.title}
              </h3>
              <p className="text-xs font-serif text-stone-600">
                {rule.hindiTitle}
              </p>

              <p className="text-xs text-stone-700 leading-relaxed">
                {rule.hindiDescription}
              </p>

              <div className="pt-2 border-t border-stone-200/80 text-[11px] text-emerald-800 font-medium">
                👉 <span className="font-semibold">Action:</span> {rule.actionableStep}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Last Minute Revision Routine */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-3">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-700" />
          <span>7-Day Last-Minute Routine for Weak Students (कमज़ोर छात्रों का 7 दिवसीय प्लान)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
            <span className="font-bold text-blue-800">Day 1 & Day 2:</span>
            <p className="font-semibold text-stone-900">20-Marks Objective Bank</p>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              पिछले 4 वर्षों के सभी ऑब्जेक्टिव प्रश्न हल करें। सही उत्तरों के कारणों को याद करें।
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
            <span className="font-bold text-blue-800">Day 3 & Day 4:</span>
            <p className="font-semibold text-stone-900">Top 2 High Weightage Units</p>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              केवल वे 2 यूनिट्स पढ़ें जिनका कुल वेटेज 35+ अंक है (जैसे Maths में Matrices, SOM में SFD/BMD)।
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
            <span className="font-bold text-blue-800">Day 5, 6 & 7:</span>
            <p className="font-semibold text-stone-900">Diagrams & Formula Sheets</p>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              फॉर्मूला शीट रट लें और सभी मुख्य डायग्राम्स को सफेद पन्ने पर बिना देखे 3 बार बनाएं।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
