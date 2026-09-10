import { Subject, ExamScheduleItem, ExamCountdownConfig } from '../types';

export const DEFAULT_COUNTDOWN_CONFIG: ExamCountdownConfig = {
  sessionName: 'SBTE Bihar Board Theory Examination',
  // Default target date: ~3 weeks from now for immediate relevance, or configurable
  targetExamDate: (() => {
    const now = new Date();
    // Default to 24 days ahead so the student immediately sees a real countdown
    const target = new Date(now.getTime() + 24 * 24 * 60 * 60 * 1000);
    target.setHours(9, 30, 0, 0);
    return target.toISOString();
  })(),
  dailyStudyHoursGoal: 4,
  theoryFullMarks: 70,
  passingMarks: 28,
};

export const EXAM_SESSIONS_PRESETS = [
  {
    id: 'odd_sem_main',
    name: 'SBTE Bihar Odd Semester (1st, 3rd, 5th Sem) Theory Exams',
    defaultOffsetDays: 24,
    description: 'Main End-Semester Theory Board Papers (70 Marks external)',
  },
  {
    id: 'even_sem_main',
    name: 'SBTE Bihar Even Semester (2nd, 4th, 6th Sem) Theory Exams',
    defaultOffsetDays: 60,
    description: 'Upcoming Summer Even Semester Board Papers',
  },
  {
    id: 'mid_sem_test',
    name: 'College Class Test / Mid-Semester Sessional (20 Marks)',
    defaultOffsetDays: 10,
    description: 'Internal college assessment to secure maximum sessional marks',
  },
  {
    id: 'practical_viva',
    name: 'SBTE External Practical & Viva-Voce Examination',
    defaultOffsetDays: 35,
    description: 'Laboratory experiments, viva questions, and lab records submission',
  },
];

export const SBTE_EXAM_TIPS = [
  {
    title: 'Section A 20 MCQs ko sabse pehle karein',
    tip: 'SBTE me 20 objective questions aate hain. Agar aap isme 16+ sahi karte hain, to passing marks (28) ke liye sirf 12 marks aur chahiye hote hain!',
  },
  {
    title: 'Neat Diagram with 2B/HB Pencil',
    tip: 'SBTE ke examiners neat labeled diagram par bhar-bharkar step marks dete hain. Har answer me relevant block diagram ya curve zaroor banayein.',
  },
  {
    title: 'Formula ko hamesha box me likhein',
    tip: 'Derivation ya numerical me final answer aur core formulas ko rectangular box me band karein aur SI Unit likhna na bhoolein.',
  },
  {
    title: 'BSEB Hindi background students ke liye',
    tip: 'Aap technical words English me aur baki explanation aasan Hinglish/Hindi me likh sakte hain. SBTE me concept clear hone par marks milte hain.',
  },
  {
    title: 'Pichhle 3 saal ke PYQs ka 70% repeat pattern',
    tip: 'SBTE Bihar ke har subject me 5-6 questions repeated hote hain. Golden questions ko bilkul miss na karein.',
  },
  {
    title: 'Har question attempt karein',
    tip: 'Koi bhi question blank na chhodein. Related formula, given data aur basic definition likhne par bhi 1 se 2 step marks mil jate hain.',
  },
];

export const REVISION_MILESTONES = [
  {
    daysRemaining: 30,
    title: 'Syllabus Mapping & Section A Foundation',
    badge: 'Phase 1: Foundation',
    tasks: [
      'Download official SBTE syllabus for all 5 subjects',
      'Solve previous 3 years Section A (20 MCQs) for high confidence',
      'Identify 2 easiest and high-scoring units per subject',
    ],
  },
  {
    daysRemaining: 15,
    title: 'Passing Mastery (Target 28+ Marks)',
    badge: 'Phase 2: Pass Guarantee',
    tasks: [
      'Master the 5 Golden repeated questions for each subject',
      'Memorize all key formulas and practice drawing standard diagrams by hand',
      'Simulate 1 full 70-mark question paper within 3 hours',
    ],
  },
  {
    daysRemaining: 7,
    title: 'High-Yield PYQ Sprint & Formula Revision',
    badge: 'Phase 3: Sprint',
    tasks: [
      'Revise formula cheat sheets twice daily',
      'Review differences tables (e.g. 2-stroke vs 4-stroke, AC vs DC, 1NF vs 2NF)',
      'Prepare exam stationery (scientific calculator fx-991ES/MS, admit card copy, scales, stencils)',
    ],
  },
  {
    daysRemaining: 1,
    title: 'Final Day Calm & Rapid Recall',
    badge: 'Final 24 Hours',
    tasks: [
      'No heavy new topics; only rapid formula & diagram glance',
      'Keep admit card, college ID card, pens, and calculator ready',
      'Get 7-8 hours sleep to ensure peak concentration in 3-hour theory hall',
    ],
  },
];

export function generateDefaultScheduleForSubjects(
  subjects: Subject[],
  startDateIso: string
): ExamScheduleItem[] {
  const baseDate = new Date(startDateIso);
  
  return subjects.map((sub, index) => {
    // Gap of 2 to 3 days between successive SBTE theory papers
    const examDate = new Date(baseDate.getTime() + index * 3 * 24 * 60 * 60 * 1000);
    const dateStr = examDate.toISOString().split('T')[0];
    const isMorning = index % 2 === 0;

    return {
      id: `paper-${sub.id}-${index}`,
      subjectId: sub.id,
      subjectCode: sub.code,
      subjectName: sub.name,
      date: dateStr,
      time: isMorning ? '09:30 AM - 12:30 PM' : '02:00 PM - 05:00 PM',
      shift: isMorning ? 'Morning' : 'Evening',
      targetMarks: 35, // Safe score comfortably above 28 passing mark
      isPassedOrDone: false,
    };
  });
}
