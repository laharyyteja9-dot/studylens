import { NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/llm';

export async function POST(req: Request) {
  try {
    const { mistakes } = await req.json();

    const schema = {
      type: "object",
      properties: {
        hasConfusion: { type: "boolean" },
        conceptA: { type: "string" },
        conceptB: { type: "string" },
        clarification: { type: "string" },
        message: { type: "string" }
      },
      required: ["hasConfusion", "message"]
    };

    const prompt = `
Analyze these incorrect quiz answers from a student.
Determine if there is a clear pattern of confusion between two specific concepts.
If there is, return hasConfusion: true, identify conceptA and conceptB, and provide a 2-minute clarification explaining the difference.
If mistakes seem random or don't cluster clearly between two concepts, return hasConfusion: false and a supportive message.

Mistakes:
\${JSON.stringify(mistakes)}
    `;

    const result = await callGeminiJSON(prompt, schema);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
