import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  BookOpen, 
  CheckCircle2, 
  Lightbulb, 
  Copy, 
  Check, 
  Loader2,
  AlertCircle
} from 'lucide-react';

interface AiDoubtSolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
  initialSubject?: string;
  currentBranchName?: string;
  onOpenFullChatbot?: (prompt?: string) => void;
}

export const AiDoubtSolverModal: React.FC<AiDoubtSolverModalProps> = ({
  isOpen,
  onClose,
  initialQuestion = '',
  initialSubject = '',
  currentBranchName = 'Diploma Engineering',
  onOpenFullChatbot,
}) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [subject, setSubject] = useState(initialSubject);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update question when initialQuestion changes
  React.useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
    }
    if (initialSubject) {
      setSubject(initialSubject);
    }
  }, [initialQuestion, initialSubject]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Mohr\'s circle numerical ko simple Hindi me samjhao',
    'Explain Thevenin Theorem step-by-step with simple example',
    'Stress-Strain curve for mild steel ko exam me kaise draw karein?',
    'Cramer\'s Rule se 3 equations solve karne ka aasan tarika',
    'Difference between 1NF, 2NF and 3NF in DBMS with table example',
    'SBTE theory exam me 28+ pass marks lane ka 7-day plan',
  ];

  const handleAskQuestion = async (qToAsk?: string) => {
    const activeQ = qToAsk || question;
    if (!activeQ.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQ,
          subject: subject || 'SBTE Diploma Engineering',
          branch: currentBranchName,
          language: 'hinglish',
        }),
      });

      const data = await res.json();
      if (!res.ok && !data.answer) {
        throw new Error(data.error || 'Failed to get answer');
      }

      setAnswer(data.answer || 'No explanation generated.');
    } catch (err: any) {
      console.error(err);
      setError(
        'Unable to connect to AI server. Please try again or ask with another topic.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>AI SBTE Guru • Doubt Solver</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Hindi / Hinglish
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                कठिन इंजीनियरिंग टॉपिक्स को सरल हिंदी में स्टेप-वाइज़ समझें
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Quick Prompts */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
              छात्रों द्वारा पूछे गए लोकप्रिय प्रश्न (Click to Ask):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(prompt);
                    handleAskQuestion(prompt);
                  }}
                  className="text-xs bg-stone-100 hover:bg-blue-50 hover:text-blue-800 text-stone-700 px-2.5 py-1.5 rounded-lg border border-stone-200 transition-colors text-left"
                >
                  ⚡ {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Question Input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject (e.g. SOM, Maths, Circuit)"
                className="w-1/3 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
              <div className="relative flex-1">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                  placeholder="Ask any question, theorem, or numerical..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
              <button
                disabled={isLoading || !question.trim()}
                onClick={() => handleAskQuestion()}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Ask Guru</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Answer Card */}
          {isLoading && (
            <div className="p-8 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-blue-700 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-stone-700">
                SBTE गुरु उत्तर तैयार कर रहे हैं...
              </p>
              <p className="text-[11px] text-stone-400">
                सरल भाषा, फॉर्मूला और परीक्षा में पूरे अंक पाने के टिप्स लिखे जा रहे हैं
              </p>
            </div>
          )}

          {answer && !isLoading && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>गुरु की सरल व्याख्या (Explanation & Tips):</span>
                </span>
                <button
                  onClick={handleCopy}
                  className="text-stone-500 hover:text-stone-800 text-xs flex items-center gap-1 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Answer</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 whitespace-pre-line leading-relaxed font-sans space-y-2">
                {answer}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-5 py-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
          <span>Powered by Gemini 3.8 Flash • SBTE Assistant</span>
          <div className="flex items-center gap-2">
            {onOpenFullChatbot && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFullChatbot(question);
                }}
                className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-md font-semibold flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Open in Full AI Chatbot</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1 bg-white hover:bg-stone-100 border border-stone-300 rounded-md text-stone-700 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
