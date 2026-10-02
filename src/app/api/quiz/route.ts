import { NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/llm';

export async function POST(req: Request) {
  try {
    const { concepts } = await req.json();

    const schema = {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              conceptId: { type: "string" },
              question: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              correctOptionIndex: { type: "number" },
              explanation: { type: "string" }
            },
            required: ["conceptId", "question", "options", "correctOptionIndex", "explanation"]
          }
        }
      },
      required: ["questions"]
    };

    const prompt = `
You are an expert tutor. Generate 5 multiple choice questions based on the following concepts.
Focus on testing deep understanding, not just rote memorization.
The questions must ONLY be about these concepts. Include the conceptId for each question.

Concepts:
\${JSON.stringify(concepts.map((c: any) => ({ id: c.id, name: c.name, summary: c.summary, source: c.sourceExcerpt })))}
    `;

    const result = await callGeminiJSON<{ questions: any[] }>(prompt, schema);
    return NextResponse.json({ questions: result.questions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
