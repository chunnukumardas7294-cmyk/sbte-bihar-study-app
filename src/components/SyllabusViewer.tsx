import React, { useState } from 'react';
import { 
  GraduationCap, 
  Clock, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SubjectSyllabus, Subject } from '../types';
import { SUBJECT_SYLLABI } from '../data/syllabusData';

interface SyllabusViewerProps {
  currentSubject?: Subject;
  availableSubjects: Subject[];
  onSelectSubject: (subId: string) => void;
}

export const SyllabusViewer: React.FC<SyllabusViewerProps> = ({
  currentSubject,
  availableSubjects,
  onSelectSubject,
}) => {
  const currentSyllabus: SubjectSyllabus | undefined = SUBJECT_SYLLABI.find(
    (s) => s.subjectId === currentSubject?.id
  ) || SUBJECT_SYLLABI[0];

  const [expandedUnit, setExpandedUnit] = useState<number | null>(1);

  return (
    <div className="space-y-5" id="syllabus-viewer-container">
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

        <div className="text-xs font-medium text-stone-600">
          Course Code: <span className="font-bold text-blue-900">{currentSyllabus?.courseCode}</span>
        </div>
      </div>

      {/* Overview & Scheme Card */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-serif">
              {currentSyllabus?.subjectName}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {currentSyllabus?.scheme} • SBTE Bihar Curriculum
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-800 border border-blue-200 font-semibold px-2.5 py-1 rounded-md text-xs">
              Credits: {currentSyllabus?.teachingScheme.totalCredits}
            </span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-2.5 py-1 rounded-md text-xs">
              Pass Mark: 28/70 (Theory)
            </span>
          </div>
        </div>

        {/* Examination Pattern Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-center">
            <p className="text-[11px] text-stone-500 uppercase font-semibold">External Theory</p>
            <p className="text-xl font-bold text-blue-800 mt-0.5">
              {currentSyllabus?.examinationScheme.endSemesterTheory} M
            </p>
            <p className="text-[10px] text-emerald-700 font-medium mt-0.5">Min 28 to Pass</p>
          </div>

          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-center">
            <p className="text-[11px] text-stone-500 uppercase font-semibold">Class Test (Internal)</p>
            <p className="text-xl font-bold text-stone-800 mt-0.5">
              {currentSyllabus?.examinationScheme.classTest} M
            </p>
            <p className="text-[10px] text-stone-500 mt-0.5">Mid-Semester Exam</p>
          </div>

          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-center">
            <p className="text-[11px] text-stone-500 uppercase font-semibold">Teacher Assessment</p>
            <p className="text-xl font-bold text-stone-800 mt-0.5">
              {currentSyllabus?.examinationScheme.teachersAssessment} M
            </p>
            <p className="text-[10px] text-stone-500 mt-0.5">Attendance & Assignment</p>
          </div>

          <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-center">
            <p className="text-[11px] text-blue-900 uppercase font-semibold">Total Theory Marks</p>
            <p className="text-xl font-bold text-blue-900 mt-0.5">
              {currentSyllabus?.examinationScheme.totalTheory} M
            </p>
            <p className="text-[10px] text-blue-700 mt-0.5">Aggregate 40% Pass</p>
          </div>
        </div>
      </div>

      {/* Units Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wide">
          Unit-wise Detailed Syllabus & Weightage
        </h3>

        {currentSyllabus?.units.map((unit) => {
          const isOpen = expandedUnit === unit.unitNumber;
          return (
            <div
              key={unit.unitNumber}
              className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden"
            >
              <div
                onClick={() => setExpandedUnit(isOpen ? null : unit.unitNumber)}
                className="p-4 bg-stone-50 border-b border-stone-100 flex items-center justify-between cursor-pointer hover:bg-stone-100/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                    U{unit.unitNumber}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">
                      Unit {unit.unitNumber}: {unit.title}
                    </h4>
                    <p className="text-xs text-stone-500 font-serif">
                      {unit.hindiTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-600 hidden sm:inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {unit.hours} Hours
                  </span>
                  <span className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded text-xs">
                    ~{unit.weightageEstimate} Marks
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-stone-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-500" />
                  )}
                </div>
              </div>

              {isOpen && (
                <div className="p-4 space-y-3 bg-white">
                  <div>
                    <p className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-2">
                      Key Topics Covered:
                    </p>
                    <ul className="space-y-1.5 text-xs text-stone-700">
                      {unit.subtopics.map((topic, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-stone-100 text-xs text-stone-600">
                    <span className="font-semibold text-stone-800">Course Outcome (CO): </span>
                    {unit.learningOutcomes}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recommended Reference Books for Bihar Polytechnics */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-3">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-700" />
          <span>Recommended Reference Books for SBTE Bihar</span>
        </h3>
        <p className="text-xs text-stone-500">
          बिहार के सरकारी एवं प्राइवेट पॉलिटेक्निक कॉलेजों में सुझाई गई मानक पाठ्यपुस्तकें:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {currentSyllabus?.recommendedBooks.map((book, bIdx) => (
            <div
              key={bIdx}
              className="p-3 rounded-lg border border-stone-200 bg-stone-50/70 space-y-1"
            >
              <p className="font-bold text-xs text-stone-900">{book.title}</p>
              <p className="text-[11px] text-stone-600">Author: {book.author}</p>
              <p className="text-[11px] text-blue-700 font-medium">
                Publisher: {book.publisher}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
