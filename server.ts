import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "sbte-bihar-study-api" });
});

// AI SBTE Bihar Doubt Solver & Concept Explainer endpoint
app.post("/api/gemini/explain", async (req, res) => {
  try {
    const { question, subject, branch, language } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback helpful guidance if API key is not configured yet
      return res.json({
        answer: `### 📌 SBTE Bihar Quick Guide: "${question}"\n\n**Note:** Gemini API Key is not set in environment secrets yet. Here is a curated quick tip for SBTE Bihar diploma students:\n\n1. **SBTE Exam Strategy**: Always start answers with a neat labeled block diagram or circuit. SBTE examiners award 40% of marks for clear diagrams alone.\n2. **Pass Mark Requirement**: In theory 70 marks paper, target Section A (20 Objectives) + at least two 4-mark short questions from Section B to cross the 28 passing mark barrier safely!\n3. **Key Concepts**: Focus on definitions, units (SI), assumptions, derivations step-by-step, and real-life engineering applications.\n\n*Configure GEMINI_API_KEY in Secrets panel for live interactive AI answers.*`,
        isFallback: true,
      });
    }

    const systemInstruction = `You are "SBTE Bihar Polytechnic Guru", a friendly, patient, and highly encouraging engineering tutor dedicated to helping weak and struggling diploma polytechnic students in Bihar under the State Board of Technical Education (SBTE Bihar).
Many students come from Hindi-medium schools (BSEB) and find engineering terms in English intimidating.
Your instructions:
1. Explain technical concepts in simple, clear Hinglish (mix of easy Hindi and English technical terms) or Hindi as requested.
2. Always break down answers into:
   - 🎯 **Simple Definition / Saral Bhasha Me Samjho**
   - 📐 **Formula / Derivation / Key Equation** (clearly written)
   - 📝 **SBTE Exam Writing Tip** (how to draw diagrams, underline keywords, and write points to get maximum step-marks from SBTE Bihar examiners)
   - 💡 **Example / Numerical Step-by-Step**
   - ⚠️ **Common Mistakes To Avoid** (what weak students often mess up)
3. Keep the tone warm, motivating ("Aap aasaani se pass ho sakte hain!"), concise, and directly oriented towards SBTE exam syllabus.`;

    const prompt = `Student Branch: ${branch || "Engineering Diploma"}
Subject: ${subject || "General SBTE Diploma"}
Question/Topic: ${question}
Preferred style: Simple Hindi/Hinglish student-friendly explanation with SBTE exam passing tips.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const answer = response.text || "No response received. Please try asking again.";
    res.json({ answer, isFallback: false });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate AI explanation",
      fallbackTip: "In SBTE exams, draw diagrams neatly with pencil and write standard definitions to secure passing marks.",
    });
  }
});

// Multi-turn conversational AI Chatbot endpoint for SBTE Diploma Students
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, subject, branch, semester, studyGoal } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
      return res.json({
        reply: `### 🤖 SBTE AI Guru (Demo Mode)\n\n**Aapka Sawaal:** "${lastUserMsg}"\n\n*Note: GEMINI_API_KEY environment secret configure hone par live real-time conversational AI active ho jayega. Tab tak ke liye SBTE Bihar diploma special guidance:*\n\n1. 🎯 **SBTE Exam Blueprint**: 70 marks theory paper me passing score **28 marks** hai.\n2. 📝 **Section A Strategy**: 20 Objective questions (1 mark each) me se kam se kam 14-16 marks target karein. Ye pass karwane me sabse bada role play karta hai!\n3. 📐 **Section B & C**: Section B me 4-mark short questions aur Section C me 6-mark derivations/numericals aate hain. Har answer me neat labeled block diagram ya formula box banayein.\n4. ⏳ **Countdown Advice**: Baki bache dino me har subject ke Unit 1 aur Unit 2 ke golden questions ko pehle revise karein.`,
        isFallback: true,
      });
    }

    const systemInstruction = `You are "SBTE Bihar AI Study Chatbot", an expert polytechnic diploma tutor and mentor dedicated to students of State Board of Technical Education, Bihar (SBTE Bihar).
You specialize in engineering branches: Civil (CE), Mechanical (ME), Electrical (EE), Computer Science (CSE), Electronics (ECE), and 1st Year common subjects (Group A & Group B: Applied Physics, Applied Chemistry, Applied Mathematics, Engineering Mechanics, Basic Electrical & Electronics, IT Systems, Engineering Graphics).

Student context:
- Branch: ${branch || "Engineering Diploma"}
- Semester: ${semester || "Current"}
- Current Active Subject: ${subject || "General SBTE Course"}
${studyGoal ? `- Student's Goal: ${studyGoal}` : ""}

Pedagogical guidelines:
1. Many SBTE Bihar students transition from BSEB (Hindi medium) schools and find engineering English challenging. Respond in natural, encouraging Hinglish (mixture of friendly Hindi and clear English technical terms) or pure Hindi/English if the user specifies.
2. Structure technical answers cleanly with markdown headings, bullet points, formula callouts, and step-by-step derivations.
3. Include "💡 SBTE Exam Tip": how to present this answer in Bihar board copy (marking scheme, diagram placement, step marks).
4. For numericals, show Given data -> Formula used -> Step-by-step calculation -> Final answer with units in a box.
5. If asked about exam countdown, revision planning, or passing 28/70 marks, give actionable day-by-day advice.
6. Keep the tone warm, confident, and respectful ("Namaste! Aap nishchint hokar preparation karein, hum aapke saath hain.").`;

    // Map conversation into Gemini SDK format
    const contents = messages
      .filter((m: any) => m && m.content && typeof m.content === "string")
      .map((m: any) => ({
        role: m.role === "assistant" || m.role === "model" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Mujhe khed hai, main uttar prapt nahi kar saka. Kripya punah prayas karein.";
    res.json({ reply, isFallback: false });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate AI response",
      fallbackReply: "Server se connect karne me dikkat aa rahi hai. Kripya apna prashna dobara puchein.",
    });
  }
});

// Start server with Vite middleware in dev, static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SBTE Bihar Study App server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
