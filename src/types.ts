export type BranchId = 'ce' | 'me' | 'ee' | 'cse' | 'ece' | 'first_year';

export interface Branch {
  id: BranchId;
  name: string;
  hindiName: string;
  code: string;
  iconName: string;
  description: string;
  totalSemesters: number;
}

export type SemesterNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface Subject {
  id: string;
  code: string;
  name: string;
  hindiName: string;
  branchId: BranchId;
  semester: SemesterNumber;
  passingMarks: number;
  totalTheoryMarks: number;
  internalMarks: number;
  keyUnitsCount: number;
  highYieldTag?: string;
}

export interface PYQQuestion {
  id: string;
  section: 'A' | 'B' | 'C'; // A: 1-mark MCQ, B: 4-mark short, C: 6-mark long/numerical
  questionNumber: number;
  marks: number;
  questionText: string;
  hindiQuestionText?: string;
  options?: string[]; // for Section A
  correctOptionIndex?: number; // for Section A
  modelAnswer: string;
  diagramDescription?: string;
  examWritingTip: string;
  repeatedYears: number[];
  isHighFrequency: boolean;
}

export interface PYQPaper {
  id: string;
  subjectId: string;
  subjectName: string;
  branchId: BranchId;
  semester: SemesterNumber;
  year: number;
  session: 'Odd' | 'Even' | 'Special';
  paperCode: string;
  totalMarks: number;
  durationHours: number;
  questions: PYQQuestion[];
}

export interface NoteUnit {
  unitNumber: number;
  unitTitle: string;
  hindiTitle: string;
  weightageMarks: string;
  isMustDoForPassing: boolean;
  coreConcepts: {
    title: string;
    englishSummary: string;
    simpleHindiExplanation: string;
    keyFormulas?: string[];
    importantPoints: string[];
    examTrick?: string;
  }[];
  differencesTable?: {
    title: string;
    col1Header: string;
    col2Header: string;
    rows: { point: string; val1: string; val2: string }[];
  };
  goldenQuestions: {
    question: string;
    marks: number;
    simplifiedSolution: string;
    diagramTip?: string;
  }[];
}

export interface SubjectNotes {
  id: string;
  subjectId: string;
  subjectName: string;
  branchId: BranchId;
  semester: SemesterNumber;
  passFormulaSummary: string;
  minimumUnitsToPass: string;
  formulaCheatSheet: {
    name: string;
    formula: string;
    variables: string;
    application: string;
  }[];
  units: NoteUnit[];
}

export interface SyllabusUnit {
  unitNumber: number;
  title: string;
  hindiTitle: string;
  hours: number;
  weightageEstimate: number;
  subtopics: string[];
  learningOutcomes: string;
}

export interface SubjectSyllabus {
  id: string;
  subjectId: string;
  subjectName: string;
  branchId: BranchId;
  semester: SemesterNumber;
  courseCode: string;
  scheme: string; // e.g., 'SBTE Bihar Diploma New Scheme'
  teachingScheme: {
    lectureHours: number;
    tutorialHours: number;
    practicalHours: number;
    totalCredits: number;
  };
  examinationScheme: {
    endSemesterTheory: number; // 70
    classTest: number; // 20
    teachersAssessment: number; // 10
    totalTheory: number; // 100
    endSemesterPractical?: number;
    internalPractical?: number;
  };
  units: SyllabusUnit[];
  recommendedBooks: {
    title: string;
    author: string;
    publisher: string;
  }[];
  passCriteria: string;
}

export interface ObjectiveQuizItem {
  id: string;
  subjectId: string;
  subjectName: string;
  semester: SemesterNumber;
  branchId: BranchId;
  year: number;
  question: string;
  hindiQuestion?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hindiExplanation: string;
  topic: string;
}

export interface BookmarkItem {
  id: string;
  type: 'pyq' | 'note' | 'formula' | 'syllabus';
  title: string;
  subtitle: string;
  subjectName: string;
  savedAt: string;
  dataRefId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isFallback?: boolean;
}

export interface ExamScheduleItem {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:30 AM - 12:30 PM"
  shift: 'Morning' | 'Evening';
  roomNo?: string;
  targetMarks: number; // default 35
  isPassedOrDone?: boolean;
}

export interface ExamCountdownConfig {
  sessionName: string;
  targetExamDate: string; // ISO / YYYY-MM-DD
  dailyStudyHoursGoal: number;
  theoryFullMarks: number; // 70
  passingMarks: number; // 28
}
