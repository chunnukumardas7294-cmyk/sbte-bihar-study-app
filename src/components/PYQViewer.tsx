import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Flame, 
  HelpCircle, 
  Printer, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { PYQPaper, PYQQuestion, Subject } from '../types';
import { PYQ_PAPERS } from '../data/pyqData';

interface PYQViewerProps {
  currentSubject?: Subject;
  availableSubjects: Subject[];
  onSelectSubject: (subId: string) => void;
  searchQuery: string;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (item: { id: string; type: 'pyq'; title: string; subtitle: string; subjectName: string; dataRefId: string }) => void;
  onAskAi: (questionText: string, subjectName: string) => void;
}

export const PYQViewer: React.FC<PYQViewerProps> = ({
  currentSubject,
  availableSubjects,
  onSelectSubject,
  searchQuery,
  bookmarkedIds,
  onToggleBookmark,
  onAskAi,
}) => {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedSection, setSelectedSection] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});
  const [onlyHighFrequency, setOnlyHighFrequency] = useState(false);

  // Filter papers by current subject or branch
  const activePapers = useMemo(() => {
    let list = PYQ_PAPERS;
    if (currentSubject) {
      list = list.filter((p) => p.subjectId === currentSubject.id);
    }
    if (selectedYear !== 'all') {
      list = list.filter((p) => p.year === selectedYear);
    }
    return list;
  }, [currentSubject, selectedYear]);

  // Aggregate questions with search and section filters
  const filteredQuestions = useMemo(() => {
    const questionsWithPaper: { paper: PYQPaper; q: PYQQuestion }[] = [];

    activePapers.forEach((paper) => {
      paper.questions.forEach((q) => {
        if (selectedSection !== 'ALL' && q.section !== selectedSection) {
          return;
        }
        if (onlyHighFrequency && !q.isHighFrequency) {
          return;
        }
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchQ = q.questionText.toLowerCase().includes(query);
          const matchH = q.hindiQuestionText?.toLowerCase().includes(query);
          const matchAns = q.modelAnswer.toLowerCase().includes(query);
          const matchSub = paper.subjectName.toLowerCase().includes(query);
          if (!matchQ && !matchH && !matchAns && !matchSub) {
            return;
          }
        }
        questionsWithPaper.push({ paper, q });
      });
    });

    return questionsWithPaper;
  }, [activePapers, selectedSection, onlyHighFrequency, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5" id="pyq-viewer-container">
      {/* Top Controls: Subject, Year, Section & High Frequency Filter */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Subject Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide shrink-0">
              Subject:
            </span>
            {availableSubjects.map((sub) => (
              <button
                key={sub.id}
                id={`sub-select-${sub.id}`}
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

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Print / PDF</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-stone-500">Year:</span>
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
              {(['all', 2024, 2023, 2022] as const).map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedYear === yr
                      ? 'bg-white text-blue-700 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {yr === 'all' ? 'All Years' : yr}
                </button>
              ))}
            </div>
          </div>

          {/* Section Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-stone-500">Exam Section:</span>
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
              <button
                onClick={() => setSelectedSection('ALL')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedSection === 'ALL'
                    ? 'bg-white text-blue-700 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Sections
              </button>
              <button
                onClick={() => setSelectedSection('A')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedSection === 'A'
                    ? 'bg-white text-blue-700 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Sec A (1 Mark MCQs)
              </button>
              <button
                onClick={() => setSelectedSection('B')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedSection === 'B'
                    ? 'bg-white text-blue-700 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Sec B (4 Marks)
              </button>
              <button
                onClick={() => setSelectedSection('C')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedSection === 'C'
                    ? 'bg-white text-blue-700 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Sec C (6 Marks)
              </button>
            </div>
          </div>

          {/* Repeat Questions Only Switch */}
          <button
            onClick={() => setOnlyHighFrequency(!onlyHighFrequency)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
              onlyHighFrequency
                ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${onlyHighFrequency ? 'text-amber-600' : 'text-stone-400'}`} />
            <span>🔥 Repeated Questions Only</span>
          </button>
        </div>
      </div>

      {/* Weak Student Exam Advice Card */}
      <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-200 rounded-xl p-3.5 text-stone-800 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-amber-950">
            कमज़ोर छात्रों के लिए SBTE परीक्षा सीक्रेट (Passing Secret):
          </p>
          <p className="text-amber-900 leading-relaxed">
            SBTE बिहार में 60% से अधिक प्रश्न पिछले 4-5 वर्षों के पेपर्स से दोहराए जाते हैं। नीचे दिए गए <span className="font-bold text-amber-950">"🔥 बार-बार पूछे जाने वाले (Repeated)"</span> प्रश्नों को अच्छे से हल कर लें। प्रत्येक प्रश्न का स्टेप-वाइज़ मॉडल उत्तर और लिखने की तकनीक दी गई है।
          </p>
        </div>
      </div>

      {/* Question Papers & Question List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-stone-200">
            <FileText className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700">No question papers found</p>
            <p className="text-xs text-stone-500 mt-1">
              Try adjusting your year, section, or search filters above.
            </p>
          </div>
        ) : (
          filteredQuestions.map(({ paper, q }) => {
            const isExpanded = !!expandedAnswers[q.id];
            const isBookmarked = bookmarkedIds.has(q.id);

            return (
              <div
                key={q.id}
                id={`pyq-card-${q.id}`}
                className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden transition-all hover:border-stone-300"
              >
                {/* Header of Question Card */}
                <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      SBTE {paper.year} • Paper {paper.paperCode}
                    </span>
                    <span className="text-stone-500">
                      {paper.subjectName}
                    </span>
                    <span className="bg-stone-200 text-stone-700 font-semibold px-2 py-0.5 rounded">
                      Sec {q.section} • Q{q.questionNumber} ({q.marks} {q.marks === 1 ? 'Mark' : 'Marks'})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {q.isHighFrequency && (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full text-[11px]">
                        <Flame className="w-3 h-3 text-amber-600" />
                        Repeated ({q.repeatedYears.join(', ')})
                      </span>
                    )}

                    {/* Bookmark Question */}
                    <button
                      onClick={() =>
                        onToggleBookmark({
                          id: q.id,
                          type: 'pyq',
                          title: `Q${q.questionNumber} (Sec ${q.section}): ${q.questionText.slice(0, 60)}...`,
                          subtitle: `${paper.subjectName} • ${paper.year} Exam`,
                          subjectName: paper.subjectName,
                          dataRefId: q.id,
                        })
                      }
                      title="Save to revision folder"
                      className="p-1 text-stone-400 hover:text-amber-600 transition-colors"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-600 fill-amber-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Question Body */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-stone-900 leading-snug">
                      {q.questionText}
                    </h3>
                    {q.hindiQuestionText && (
                      <p className="text-xs sm:text-sm text-stone-600 mt-1 font-serif text-stone-700">
                        {q.hindiQuestionText}
                      </p>
                    )}
                  </div>

                  {/* If Section A Multiple Choice Options */}
                  {q.section === 'A' && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, idx) => {
                        const isCorrect = idx === q.correctOptionIndex;
                        return (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                              isExpanded && isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                                : 'bg-stone-50 border-stone-200 text-stone-800'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-white border border-stone-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isExpanded && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Actions: View Solution & Ask AI */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium text-xs rounded-lg border border-blue-200 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          <span>Hide Model Answer & Notes</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          <span>View Step-by-Step Solution ({q.marks} Marks)</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onAskAi(q.questionText, paper.subjectName)}
                      className="inline-flex items-center gap-1 text-xs text-indigo-700 hover:text-indigo-900 font-medium hover:underline"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Ask AI Guru for simpler explanation</span>
                    </button>
                  </div>

                  {/* Expanded Model Answer & Exam Tips */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-stone-200 space-y-3 bg-stone-50/70 -mx-4 -mb-4 p-4 rounded-b-xl">
                      {/* Step-by-step Solution */}
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Step-by-Step Model Answer for Evaluator:</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-stone-200 text-xs text-stone-800 whitespace-pre-line leading-relaxed font-mono">
                          {q.modelAnswer}
                        </div>
                      </div>

                      {/* Diagram Guidance if applicable */}
                      {q.diagramDescription && (
                        <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-xs text-blue-950">
                          <p className="font-bold text-blue-900 mb-1">
                            📐 आवश्यक डायग्राम (Diagram Guidance):
                          </p>
                          <p className="leading-relaxed text-blue-900">
                            {q.diagramDescription}
                          </p>
                        </div>
                      )}

                      {/* Examiner Marking & Writing Trick */}
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-950">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          <span>SBTE Evaluator Writing Tip (पूरे नंबर पाने का तरीका):</span>
                        </div>
                        <p className="leading-relaxed text-amber-900">
                          {q.examWritingTip}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
