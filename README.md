# StudyLens

StudyLens is a web app that turns a student's own study material into a concept-level map of what they know, don't know, and are likely to forget, then tells them exactly what to study next. It acts as an intelligent learning diagnostic tool, transforming static PDFs into an actionable, spaced-repetition plan powered by AI, securely executed using Gemini on the server.

## Features

- **Knowledge Mirror**: Visualizes your mastery across extracted concepts using progress rings, sparklines, and status chips (strong, fair, weak, critical).
- **Adaptive Quiz**: 5 LLM-generated MCQs targeting your weakest areas.
- **Confusion Detector**: Analyzes incorrect answers to detect overarching concept confusions (e.g., Paging vs Segmentation).
- **Teach Back**: Explains a concept via voice (Web Speech API) or text. The AI acts as the student, grading the explanation against source text for understanding, accuracy, and completeness.
- **15-Minute Rescue**: An automated focus session utilizing a countdown timer to boost retention for the lowest-mastery, highest-urgency topics.
- **Explain It 3 Ways**: Dynamically explains a concept to a 10-year-old, as an exam answer, or for an interview.
- **Exam Traps**: Highlights frequently confused concepts and models exam-style comparison questions.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF Extraction**: pdf-parse (Server-side)
- **AI**: Google Gemini (gemini-1.5-flash) via native fetch API
- **State**: React Context + `localStorage` persistence

## Architecture

\`\`\`
Client (Browser)                           Server (Next.js Route Handlers)                   Google
┌─────────────────────┐                   ┌───────────────────────────────┐                  ┌────────────────┐
│ UI Components       │ ── Upload PDF ──> │ POST /api/extract             │                  │                │
│ Zustand-like Store  │                   │ - pdf-parse reads buffer      │ ── LLM Prompt ─> │ Gemini 1.5 API │
│ localStorage        │ <── JSON concepts │ - callGeminiJSON(prompt)      │ <── JSON Data ── │ (Flash)        │
│                     │                   └───────────────────────────────┘                  └────────────────┘
│ - Dashboard         │                   ┌───────────────────────────────┐
│ - Knowledge Mirror  │ ── fetch Quiz ──> │ POST /api/quiz                │ ── LLM Prompt ─> (Gemini)
│ - 15-Min Rescue     │ <── JSON Qs ──────│ - callGeminiJSON(prompt)      │ <── JSON Data ──
│ - Teach Back (Voice)│                   └───────────────────────────────┘
└─────────────────────┘                   (Same pattern for /api/teach, /api/confusion, etc)
\`\`\`

*Note: The Gemini API Key is stored only on the server, ensuring client safety and keeping credentials hidden from the browser.*

## Under the Hood: Mastery & Scheduling

**Mastery Calculation**:
- Each quiz answer affects mastery by +15 or -15, bounded between 0 and 100.
- When completing a Teach Back evaluation, mastery adjusts based on a weighted average of Understanding, Accuracy, and Completeness.
- The 14-day Readiness Trend uses the average mastery of all concepts over time.

**Review Radar (Spaced Repetition)**:
- Baseline review interval based on status: Critical (1 day), Weak (3 days), Fair (7 days), Strong (14 days).
- Penalties: If a concept accumulates >2 past mistakes, its review interval shrinks by 2 days.
- The formula actively tracks `lastTested` timestamps against `Date.now()` to sort into Today, Tomorrow, In 3 Days, and In 7+ Days buckets.

## Local Development

1. **Clone and Install**
   \`\`\`bash
   git clone https://github.com/your-username/studylens.git
   cd studylens
   npm install
   \`\`\`

2. **Setup Environment Variables**
   Rename \`.env.example\` to \`.env.local\` and add your Gemini API Key.
   \`\`\`env
   GEMINI_API_KEY=your_gemini_api_key_here
   \`\`\`

3. **Run the Application**
   \`\`\`bash
   npm run dev
   \`\`\`
   Visit \`http://localhost:3000\` and click **"Try the demo"** to populate the store instantly with Operating Systems data.

## Screenshots

*(Add screenshots here)*
![Dashboard](/dashboard-placeholder.png)
![Knowledge Mirror](/knowledge-placeholder.png)
![15-Minute Rescue](/rescue-placeholder.png)
