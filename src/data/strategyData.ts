export interface PassingTip {
  title: string;
  hindiTitle: string;
  category: 'Presentation' | 'Marks Scheme' | 'Time Management' | 'Passing Strategy';
  description: string;
  hindiDescription: string;
  actionableStep: string;
}

export const SBTE_PASSING_RULES: PassingTip[] = [
  {
    title: 'The 28-Mark Threshold in Theory',
    hindiTitle: 'थ्योरी में न्यूनतम 28 अंक का नियम',
    category: 'Marks Scheme',
    description: 'In SBTE Bihar 70-mark external theory examinations, you MUST score at least 28 marks (40%) independently. Even if you have 30/30 in internal, scoring 27 in theory means carrying a backlog.',
    hindiDescription: 'SBTE बिहार में 70 नंबर की थ्योरी परीक्षा में कम से कम 28 नंबर लाना अनिवार्य है। अगर आंतरिक परीक्षा में पूरे 30/30 भी हैं, लेकिन थ्योरी में 27 रह गए तो कैरी (Backlog) लग जाएगी।',
    actionableStep: 'Target: 16 Marks in Section A (MCQs) + 3 Questions from Section B (12 Marks) = 28 Marks reached safely!',
  },
  {
    title: 'Lead with Diagrams for Instant Step-Marks',
    hindiTitle: 'हर उत्तर में स्वच्छ चित्र (Diagram) जरूर बनाएं',
    category: 'Presentation',
    description: 'SBTE evaluators check hundreds of answer sheets daily. A neat, labeled pencil diagram tells the examiner instantly that the student understands the concept.',
    hindiDescription: 'उत्तर पुस्तिका जांचने वाले शिक्षक सबसे पहले आपका डायग्राम देखते हैं। अगर पेंसिल और स्केल से बना डायग्राम साफ है, तो 6 में से 3-4 अंक केवल चित्र के मिल जाते हैं।',
    actionableStep: 'Carry a sharp HB pencil, eraser, and ruler to the exam hall. Draw diagrams before writing textual paragraphs.',
  },
  {
    title: 'Enclose Final Formulas & Answers in Boxes',
    hindiTitle: 'सूत्र और अंतिम उत्तर को बॉक्स में बंद करें',
    category: 'Presentation',
    description: 'Whenever solving numericals (like SFD/BMD, Cramer Rule, or Thevenin circuit), enclose the governing formula and final answer with proper SI units inside a clean rectangular box.',
    hindiDescription: 'न्यूमेरिकल सवाल हल करते समय मुख्य फॉर्मूला और अंतिम उत्तर को SI यूनिट के साथ एक बॉक्स में बंद करें। इससे परीक्षक को उत्तर खोजने में आसानी होती है।',
    actionableStep: 'Example: [ Maximum Bending Moment M_max = 75.0 kNm ]',
  },
  {
    title: 'Attempt Difference Questions in Tabular Format',
    hindiTitle: 'अंतर वाले प्रश्नों को हमेशा दो कॉलम तालिका में लिखें',
    category: 'Passing Strategy',
    description: 'SBTE Bihar papers almost always contain 1 or 2 difference questions (e.g. 2-stroke vs 4-stroke, DBMS vs File system, Ductile vs Brittle). Tabular answers score 100% full marks.',
    hindiDescription: 'अंतर वाले सवालों (Differences) को कभी पैराग्राफ में न लिखें। बाकायदा 2 कॉलम (और पहला कॉलम "आधार / Point") बनाकर 4 या 5 साफ बिंदु लिखें।',
    actionableStep: 'Column 1: Parameter/Basis; Column 2: Item A; Column 3: Item B.',
  },
  {
    title: 'Never Leave Any Question Blank',
    hindiTitle: 'कोई भी प्रश्न खाली न छोड़ें (Step Marking)',
    category: 'Passing Strategy',
    description: 'In SBTE evaluation guidelines, step marks are awarded for writing Given Data, standard governing formula, and basic schematic diagram even if final calculation is unfinished.',
    hindiDescription: 'SBTE में स्टेप मार्किंग होती है। अगर सवाल का पूरा हल नहीं आता, तो भी "दिया गया डेटा (Given Data)", संबंधित फॉर्मूला और रफ चित्र जरूर बनाएं। 6 में से 2-3 नंबर मिल जाएंगे।',
    actionableStep: 'Always write: "Given Data:", "Formula Used:", followed by known steps.',
  },
  {
    title: '3-Hour SBTE Time Allocation Matrix',
    hindiTitle: '3 घंटे के पेपर का सही समय प्रबंधन (Time Management)',
    category: 'Time Management',
    description: 'Do not spend more than 30-35 minutes on Section A (20 MCQs). Spend 60 minutes on Section B (5 short answers × 12 min), 70 minutes on Section C (5 long answers × 14 min), and keep 15 minutes for review.',
    hindiDescription: 'सेक्शन A (20 ऑब्जेक्टिव) को 30-35 मिनट में पूरा करें। सेक्शन B को 1 घंटा और सेक्शन C को 1 घंटा 15 मिनट दें। आखिरी 15 मिनट रोल नंबर और पेज नंबर चेक करने के लिए रखें।',
    actionableStep: 'Start directly from Section A, tick confident MCQs, then quickly move to easiest Section B questions.',
  },
];
