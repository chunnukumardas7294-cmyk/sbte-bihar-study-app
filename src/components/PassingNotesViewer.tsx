import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  Lightbulb, 
  Table, 
  HelpCircle, 
  Calculator, 
  CheckCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SubjectNotes, Subject } from '../types';
import { SUBJECT_NOTES } from '../data/notesData';

interface PassingNotesViewerProps {
  currentSubject?: Subject;
  availableSubjects: Subject[];
  onSelectSubject: (subId: string) => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (item: { id: string; type: 'note' | 'formula'; title: string; subtitle: string; subjectName: string; dataRefId: string }) => void;
  onAskAi: (questionText: string, subjectName: string) => void;
}

export const PassingNotesViewer: React.FC<PassingNotesViewerProps> = ({
  currentSubject,
  availableSubjects,
  onSelectSubject,
  bookmarkedIds,
  onToggleBookmark,
  onAskAi,
}) => {
  const [activeTab, setActiveTab] = useState<'pass_formula' | 'formula_sheet' | 'units' | 'differences'>('pass_formula');
  const [copiedFormulaIndex, setCopiedFormulaIndex] = useState<number | null>(null);
  const [expandedUnit, setExpandedUnit] = useState<number>(1);

  // Find matching notes for current subject or fallback to first
  const currentNotes: SubjectNotes | undefined = SUBJECT_NOTES.find(
    (n) => n.subjectId === currentSubject?.id
  ) || SUBJECT_NOTES[0];

  const handleCopyFormula = (formula: string, index: number) => {
    navigator.clipboard.writeText(formula);
    setCopiedFormulaIndex(index);
    setTimeout(() => setCopiedFormulaIndex(null), 2000);
  };

  return (
    <div className="space-y-5" id="passing-notes-container">
      {/* Subject Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wide shrink-0">
            Subject:
          </span>
          {availableSubjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onSelectSubject(sub.id)}
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

        {/* View Toggle Tabs */}
        <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
          <button
            onClick={() => setActiveTab('pass_formula')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'pass_formula'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🎯 Pass Strategy
          </button>
          <button
            onClick={() => setActiveTab('formula_sheet')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'formula_sheet'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📐 Formula Sheet
          </button>
          <button
            onClick={() => setActiveTab('units')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'units'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📖 Unit Notes
          </button>
          <button
            onClick={() => setActiveTab('differences')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'differences'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📊 Difference Tables
          </button>
        </div>
      </div>

      {/* Main Content Sections based on Active Tab */}
      {activeTab === 'pass_formula' && (
        <div className="space-y-4">
          {/* Master Passing Strategy Box */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-amber-400 text-slate-950 font-bold text-xs uppercase px-2.5 py-1 rounded-md">
                पास होने का फॉर्मूला (28+ Marks Guaranteed)
              </span>
              <span className="text-xs text-slate-300">
                Subject: {currentNotes?.subjectName}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-amber-200">
                {currentNotes?.subjectName} में कम से कम 28 अंक कैसे लाएं?
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed">
                {currentNotes?.passFormulaSummary}
              </p>
            </div>

            <div className="bg-white/10 p-3 rounded-lg border border-white/15 text-xs space-y-1.5">
              <p className="font-semibold text-emerald-300">
                ✅ अनिवार्य इकाइयां (Must Prepare Units):
              </p>
              <p className="text-slate-100">
                {currentNotes?.minimumUnitsToPass}
              </p>
            </div>
          </div>

          {/* Quick Action Cards for Weak Students */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-stone-900">
                Section A: 20 MCQs
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                पहले 30 मिनट में 20 ऑब्जेक्टिव हल करें। यदि आप 15-18 सही कर लेते हैं, तो थ्योरी में केवल 10-12 अंक चाहिए।
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-stone-900">
                Section B: 4-Mark Questions
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                परिभाषाएं, अंतर (Differences), और सीधे फॉर्मूले वाले 3 प्रश्न चुनें। डायग्राम साफ बनाएं।
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-stone-900">
                Section C: 6-Mark Numerical
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                क्रेमर रूल, थेवेनिन, या SFD/BMD में से एक सवाल पूरा हल करें। स्टेप मार्किंग से 5-6 अंक मिल जाएंगे।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Formula Cheat Sheet */}
      {activeTab === 'formula_sheet' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-700" />
                <span>Formula Cheat-Sheet ({currentNotes?.subjectName})</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                परीक्षा से 1 घंटे पहले त्वरित रिविज़न के लिए सभी महत्वपूर्ण सूत्र
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {currentNotes?.formulaCheatSheet.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-50/80 transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-stone-800">
                    {item.name}
                  </span>
                  <button
                    onClick={() => handleCopyFormula(item.formula, idx)}
                    className="text-stone-400 hover:text-stone-700 transition-colors p-1"
                    title="Copy formula"
                  >
                    {copiedFormulaIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="bg-white p-2.5 rounded-md border border-stone-200 font-mono text-xs text-blue-900 font-semibold text-center">
                  {item.formula}
                </div>

                <div className="text-[11px] text-stone-600 space-y-1">
                  <p>
                    <span className="font-semibold text-stone-700">Variables:</span> {item.variables}
                  </p>
                  <p className="text-amber-800">
                    <span className="font-semibold">Exam Application:</span> {item.application}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unit Notes with Hinglish & Simple Explanations */}
      {activeTab === 'units' && (
        <div className="space-y-4">
          {currentNotes?.units.map((unit) => (
            <div
              key={unit.unitNumber}
              className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden"
            >
              <div
                onClick={() => setExpandedUnit(expandedUnit === unit.unitNumber ? 0 : unit.unitNumber)}
                className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between cursor-pointer hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                    U{unit.unitNumber}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      Unit {unit.unitNumber}: {unit.unitTitle}
                    </h3>
                    <p className="text-xs text-stone-500 font-serif">
                      {unit.hindiTitle} • Weightage: {unit.weightageMarks}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {unit.isMustDoForPassing && (
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      Must-Do for Pass
                    </span>
                  )}
                  {expandedUnit === unit.unitNumber ? (
                    <ChevronUp className="w-4 h-4 text-stone-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-500" />
                  )}
                </div>
              </div>

              {expandedUnit === unit.unitNumber && (
                <div className="p-4 space-y-4">
                  {unit.coreConcepts.map((concept, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-4 rounded-xl border border-stone-200 bg-white space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{concept.title}</span>
                        </h4>
                        <button
                          onClick={() => onAskAi(concept.title, currentNotes.subjectName)}
                          className="text-xs text-indigo-700 hover:text-indigo-900 font-medium inline-flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Explain in Hindi</span>
                        </button>
                      </div>

                      {/* Simple Hindi Explanation */}
                      <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-3 text-xs text-amber-950 space-y-1">
                        <p className="font-bold text-amber-900 flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                          <span>सरल भाषा में समझें (Hindi Explanation):</span>
                        </p>
                        <p className="leading-relaxed text-amber-900">
                          {concept.simpleHindiExplanation}
                        </p>
                      </div>

                      {/* Technical Summary */}
                      <div className="text-xs text-stone-700 leading-relaxed">
                        <p className="font-semibold text-stone-900 mb-1">Standard Definition:</p>
                        <p>{concept.englishSummary}</p>
                      </div>

                      {/* Exam Trick if available */}
                      {concept.examTrick && (
                        <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-2.5 text-xs text-blue-950 font-medium">
                          💡 <span className="font-bold">Exam Writing Trick:</span> {concept.examTrick}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Difference Tables */}
      {activeTab === 'differences' && (
        <div className="space-y-4">
          {currentNotes?.units.map(
            (unit, uIdx) =>
              unit.differencesTable && (
                <div
                  key={uIdx}
                  className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                        <Table className="w-4 h-4 text-blue-700" />
                        <span>{unit.differencesTable.title}</span>
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        SBTE परीक्षा में 4 से 6 अंक का अंतर वाला प्रश्न हर साल पूछा जाता है।
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-stone-200">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                        <tr>
                          <th className="p-3 w-1/4">आधार (Point of Comparison)</th>
                          <th className="p-3 w-3/8 text-blue-900">
                            {unit.differencesTable.col1Header}
                          </th>
                          <th className="p-3 w-3/8 text-indigo-900">
                            {unit.differencesTable.col2Header}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {unit.differencesTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-stone-50">
                            <td className="p-3 font-semibold text-stone-800 bg-stone-50/50">
                              {row.point}
                            </td>
                            <td className="p-3 text-stone-700">{row.val1}</td>
                            <td className="p-3 text-stone-700">{row.val2}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};
