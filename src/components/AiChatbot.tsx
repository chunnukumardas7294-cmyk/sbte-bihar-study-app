import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { 
  Sparkles, 
  Send, 
  Trash2, 
  Download, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Loader2, 
  Bot, 
  User, 
  BookOpen, 
  Lightbulb, 
  CheckCircle2, 
  RefreshCw,
  HelpCircle,
  Clock,
  ArrowRight,
  ListChecks
} from 'lucide-react';
import { Subject, ChatMessage } from '../types';

interface AiChatbotProps {
  currentSubject?: Subject;
  availableSubjects: Subject[];
  branchName: string;
  semester: number;
  initialPrompt?: string;
  onSelectSubject: (id: string) => void;
}

export const AiChatbot: React.FC<AiChatbotProps> = ({
  currentSubject,
  availableSubjects,
  branchName,
  semester,
  initialPrompt,
  onSelectSubject,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`sbte_chat_${semester}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: `👋 **Namaste! Main hoon aapka SBTE Bihar AI Study Guru.**\n\nAap **${branchName} (Semester ${semester})** ki taiyari kar rahe hain. SBTE Bihar ke theory exams me **70 me se 28 marks** pass hone ke liye chahiye hote hain.\n\nAap mujhse kisi bhi subject ke:\n- 🎯 **Pass hone ke Golden Questions & Tips**\n- 📐 **Formula Derivation aur Numericals** step-by-step\n- 📝 **Section A (20 MCQs) ke shortcuts**\n- 💡 **Hindi/Hinglish me saral explanation**\n\nNeeche diye gaye suggested prompts par click karein ya apna koi bhi sawaal puchein!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [languageStyle, setLanguageStyle] = useState<'hinglish' | 'hindi' | 'english'>('hinglish');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Persist messages in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`sbte_chat_${semester}`, JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages, semester]);

  // Handle external initial prompt if provided
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const quickPrompts = [
    {
      label: '🎯 28+ Pass Guarantee Plan',
      text: `Mujhe ${currentSubject?.name || 'is subject'} me 70 me se 28+ passing marks lane ka practical 5-day plan batayein.`,
    },
    {
      label: '⚡ Top 5 Repeated Questions',
      text: `${currentSubject?.name || 'is subject'} ke SBTE Bihar me sabse zyada repeat hone wale 5 golden questions aur unka simplified answer batayein.`,
    },
    {
      label: '📐 Key Formulas & Units',
      text: `${currentSubject?.name || 'is subject'} ke sabhi important formulas, SI units aur assumptions ek jagah list karke samjhayein.`,
    },
    {
      label: '📝 Exam Presentation Hacks',
      text: 'SBTE Bihar ke exam copy me answers kaise likhein aur diagrams kaise banayein jisse examiner step-marks na kaate?',
    },
    {
      label: '❓ 20 MCQs Solving Tricks',
      text: 'Section A ke 20 objective questions me 16+ score karne ke tricks aur tips batayein.',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const qText = textToSend || inputQuery;
    if (!qText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: qText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          subject: currentSubject?.name || 'Diploma Course',
          branch: branchName,
          semester: semester,
          studyGoal: languageStyle === 'hindi' ? 'Pure Hindi medium student' : 'Hinglish easy understanding',
        }),
      });

      const data = await res.json();
      const replyText = data.reply || data.error || 'No response received. Please try again.';

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: data.isFallback,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Server se sampark nahi ho saka.**\n\nAap tab tak application ke **PYQs** aur **Passing Notes** tab me curated golden questions dekh sakte hain.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClearChat = () => {
    if (confirm('Kya aap chat history clear karna chahte hain?')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: `👋 **Namaste! Main hoon aapka SBTE Bihar AI Study Guru.**\n\nNaya session shuru hua hai. ${currentSubject?.name || 'Subject'} se juda koi bhi sawaal puchein!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Aapke browser me text-to-speech support nahi hai.');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner voice
    const cleanText = text.replace(/[#*`_~[\]()]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Try to find Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const hiVoice = voices.find((v) => v.lang.includes('hi') || v.lang.includes('IN'));
    if (hiVoice) {
      utterance.voice = hiVoice;
    }

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleExportChat = () => {
    const transcript = messages
      .map((m) => `[${m.timestamp}] ${m.role === 'user' ? 'Student' : 'SBTE AI Guru'}:\n${m.content}\n`)
      .join('\n---\n\n');
    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SBTE_AI_Study_Notes_${branchName}_Sem${semester}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col h-[740px] overflow-hidden" id="ai-chatbot-main">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-blue-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                SBTE Bihar AI Study Chatbot
              </h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-400/30">
                Online • Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {branchName} • Semester {semester} • {currentSubject?.name || 'All Subjects'}
            </p>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Subject Context Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-300 hidden sm:inline">Subject:</span>
            <select
              value={currentSubject?.id || ''}
              onChange={(e) => onSelectSubject(e.target.value)}
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-1.5 rounded-lg border border-white/20 focus:outline-none focus:ring-1 focus:ring-amber-400 max-w-[180px] truncate"
            >
              {availableSubjects.map((sub) => (
                <option key={sub.id} value={sub.id} className="text-stone-900 bg-white">
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language / Tone Toggle */}
          <div className="flex items-center bg-black/30 p-0.5 rounded-lg border border-white/15 text-[11px]">
            <button
              onClick={() => setLanguageStyle('hinglish')}
              className={`px-2 py-1 rounded-md transition-colors ${
                languageStyle === 'hinglish' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300'
              }`}
            >
              Hinglish
            </button>
            <button
              onClick={() => setLanguageStyle('hindi')}
              className={`px-2 py-1 rounded-md transition-colors ${
                languageStyle === 'hindi' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Export Notes */}
          <button
            onClick={handleExportChat}
            title="Download notes transcript"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-lg border border-white/15 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Clear Chat */}
          <button
            onClick={handleClearChat}
            title="Clear chat history"
            className="p-1.5 bg-white/10 hover:bg-rose-600/80 text-slate-200 hover:text-white rounded-lg border border-white/15 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts Pill Carousel */}
      <div className="bg-stone-50 border-b border-stone-200 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
          <span>Quick Ask:</span>
        </span>
        {quickPrompts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(item.text)}
            className="text-xs bg-white hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 text-stone-700 font-medium px-2.5 py-1 rounded-full border border-stone-200 whitespace-nowrap transition-colors shadow-2xs"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Message Stream Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-100/50">
        {messages.map((message) => {
          const isUser = message.role === 'user';

          return (
            <div
              key={message.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
                  isUser
                    ? 'bg-blue-700 text-white'
                    : 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-bold'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-4 py-3 text-xs sm:text-sm shadow-2xs space-y-1.5 transition-all ${
                  isUser
                    ? 'bg-blue-700 text-white rounded-tr-xs'
                    : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs'
                }`}
              >
                {/* Bubble Header */}
                <div className="flex items-center justify-between gap-3 text-[11px] pb-1 border-b border-black/5">
                  <span className={`font-semibold ${isUser ? 'text-blue-100' : 'text-stone-700 flex items-center gap-1.5'}`}>
                    {isUser ? 'You' : 'SBTE AI Guru'}
                    {!isUser && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        Polytechnic Mentor
                      </span>
                    )}
                  </span>
                  <span className={`${isUser ? 'text-blue-200' : 'text-stone-400'}`}>
                    {message.timestamp}
                  </span>
                </div>

                {/* Message Content */}
                {isUser ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                ) : (
                  <div className="markdown-body text-stone-800 space-y-2 leading-relaxed font-sans">
                    <Markdown>{message.content}</Markdown>
                  </div>
                )}

                {/* Assistant Message Action Toolbar */}
                {!isUser && (
                  <div className="pt-2 flex items-center justify-end gap-3 text-stone-500 text-[11px] border-t border-stone-100">
                    <button
                      onClick={() => handleSpeak(message.id, message.content)}
                      className="hover:text-blue-700 flex items-center gap-1 transition-colors"
                      title="Listen to explanation"
                    >
                      {speakingId === message.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                          <span className="text-rose-600 font-medium">Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Voice Read</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(message.id, message.content)}
                      className="hover:text-blue-700 flex items-center gap-1 transition-colors"
                      title="Copy text"
                    >
                      {copiedId === message.id ? (
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
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-2xs">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-2xs flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-blue-700 animate-spin" />
              <div>
                <p className="text-xs font-semibold text-stone-800">
                  SBTE गुरु उत्तर तैयार कर रहे हैं...
                </p>
                <p className="text-[11px] text-stone-500">
                  सरल भाषा, फॉर्मूला बॉक्स और एग्जाम टिप्स लिखे जा रहे हैं
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-up Quick Action Chips */}
      <div className="bg-white border-t border-stone-200 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[11px] text-stone-400 shrink-0">Suggestions:</span>
        <button
          onClick={() => handleSendMessage('Iska diagram kaisa banega? Step-by-step batayein.')}
          className="text-stone-600 hover:text-blue-800 bg-stone-100 hover:bg-blue-50 px-2.5 py-1 rounded-md border border-stone-200 whitespace-nowrap transition-colors"
        >
          ✏️ Draw Diagram Steps
        </button>
        <button
          onClick={() => handleSendMessage('Ek numerical example lekar step-by-step solve karein.')}
          className="text-stone-600 hover:text-blue-800 bg-stone-100 hover:bg-blue-50 px-2.5 py-1 rounded-md border border-stone-200 whitespace-nowrap transition-colors"
        >
          🔢 Solve Numerical Example
        </button>
        <button
          onClick={() => handleSendMessage('Isko 5 bullet points me summarize karein for quick exam revision.')}
          className="text-stone-600 hover:text-blue-800 bg-stone-100 hover:bg-blue-50 px-2.5 py-1 rounded-md border border-stone-200 whitespace-nowrap transition-colors"
        >
          📌 5 Bullet Points Summary
        </button>
        <button
          onClick={() => handleSendMessage('Is topic se related 3 practice MCQs banayein options ke sath.')}
          className="text-stone-600 hover:text-blue-800 bg-stone-100 hover:bg-blue-50 px-2.5 py-1 rounded-md border border-stone-200 whitespace-nowrap transition-colors"
        >
          🎯 3 Practice MCQs
        </button>
      </div>

      {/* Message Input Box Footer */}
      <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              id="chatbot-input"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask SBTE Guru about ${currentSubject?.name || 'any topic'}, formula, or pass tricks...`}
              disabled={isLoading}
              className="w-full pl-4 pr-10 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-stone-900 placeholder-stone-400"
            />
          </div>

          <button
            type="submit"
            id="chatbot-send-btn"
            disabled={isLoading || !inputQuery.trim()}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shrink-0 shadow-xs"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Ask Guru</span>
              </>
            )}
          </button>
        </form>
        <p className="text-[11px] text-stone-400 text-center mt-2">
          Specialized for SBTE Bihar diploma syllabus • Hinglish & Hindi friendly
        </p>
      </div>
    </div>
  );
};
