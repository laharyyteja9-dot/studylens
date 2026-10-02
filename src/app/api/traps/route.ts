import { NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/llm';

export async function POST(req: Request) {
  try {
    const { concepts } = await req.json();

    const schema = {
      type: "object",
      properties: {
        traps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              conceptA: { type: "string" },
              conceptB: { type: "string" },
              description: { type: "string" },
              questions: { type: "array", items: { type: "string" } }
            },
            required: ["conceptA", "conceptB", "description", "questions"]
          }
        }
      },
      required: ["traps"]
    };

    const prompt = `
You are an expert exam setter. Analyze these concepts and find 5-8 commonly confused concept pairs.
For each pair, explain the typical confusion (description) and generate 2 comparison questions that would test the difference on an exam.

Concepts:
\${JSON.stringify(concepts.map((c: any) => ({ name: c.name, summary: c.summary })))}
    `;

    const result = await callGeminiJSON<{ traps: any[] }>(prompt, schema);
    return NextResponse.json({ traps: result.traps });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
